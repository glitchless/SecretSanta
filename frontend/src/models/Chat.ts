import {
	types, Instance, SnapshotOrInstance, SnapshotIn, cast, flow, toGeneratorFunction, getRoot, detach, isAlive,
} from 'mobx-state-tree';
import routes from '@/store/routes';
import { api } from '@/services/api';
import axios, {Canceler, CancelToken} from 'axios';

export const MessageFrom = types.enumeration('messageFrom', ['current', 'companion']);

export const Message = types.model('Message', {
	text: types.string,
	id: types.identifierNumber,
	timestamp: types.Date,
	from: MessageFrom,
});

type MessageSnapshot = SnapshotIn<typeof Message>;

export const Chat = types.model('Chat', {
	with: types.enumeration('with', ['receiver', 'sender']),
	messages: types.optional(types.array(Message), []),
	pollingEnabled: false,
}).actions((self) => ({
	lastMessage() {
		return self.messages[self.messages.length - 1];
	},
	setMessages(messages: SnapshotOrInstance<typeof Message>[]) {
		self.messages = cast(messages);
	},
	mergeMessagesToEnd(newMessages: MessageSnapshot[]) {
		const lastId = self.messages[self.messages.length - 1]?.id;
		const startWithIndex = newMessages.findIndex(({ id }) => lastId === id);

		if (startWithIndex === -1) {
			// eslint-disable-next-line no-console
			console.error('No common messages were found :(');
			self.messages.push(...newMessages);

			return;
		}

		self.messages.splice(self.messages.length - startWithIndex - 1, newMessages.length, ...newMessages);
	},
})).volatile(() => ({
	canceler: null as (Canceler | null),
})).actions((self) => {
	const fetchMessages = async ({
		offset_id = null,
		// eslint-disable-next-line arrow-body-style
	}: {offset_id?: number | null} = {}) => {
		const result = await api.get<{message: {messages: MessageSnapshot[] }}>(
			routes.api.chat.get,
			{
				// TODO: Вернуть лимит!
				// params: { with: self.with, offset_id, limit: 10 },
				params: { with: self.with, offset_id },
			},
		);

		result.data.message.messages.reverse();

		return result;
	};

	const longPollMessages = async ({
		offset_id = null,
		// eslint-disable-next-line arrow-body-style
	}: {offset_id?: number | null} = {}) => {
		const result = await api.get<{message: {messages: MessageSnapshot[] }}>(
			routes.api.chat.longpoll,
			{
				params: { with: self.with, offset_id },
				cancelToken: new axios.CancelToken((cancel) => {
					self.canceler = cancel;
				}),
			},
		);

		result.data.message.messages.reverse();

		return result;
	};

	const genFetchMessages = toGeneratorFunction(fetchMessages);
	const genLongPollMessages = toGeneratorFunction(longPollMessages);

	return {
		loadInitialMessages: flow(function* loadInitialMessages() {
			const { data } = yield* genFetchMessages();

			self.setMessages(data.message.messages);
		}),
		loadMore: flow(function* loadMore() {
			try {
				const { data } = yield* genFetchMessages({ offset_id: self.messages[0].id });

				self.messages.unshift(...data.message.messages);
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		}),
		refresh: flow(function* loadMore() {
			const { data } = yield* genFetchMessages();
			const responseMessages = data.message.messages;

			self.mergeMessagesToEnd(responseMessages);
		}),
		setupPolling: flow(function* setupPolling() {
			self.pollingEnabled = true;

			while (true) {
				if (!isAlive(self) || !self.pollingEnabled) {
					return;
				}

				try {
					const { data } = yield* genLongPollMessages({ offset_id: self.lastMessage()?.id });

					self.mergeMessagesToEnd(data.message.messages);
				} catch (err) {
					// eslint-disable-next-line no-console
					console.log({ err });
				}

				if (!isAlive(self) || !self.pollingEnabled) {
					return;
				}
			}
		}),
	};
}).actions((self) => ({
	sendMessage(text: string) {
		api.post<{message: any}>(routes.api.chat.post, { to: self.with, text }).then(() => {
			self.refresh();
		});
	},
	init: flow(function* init() {
		yield self.loadInitialMessages();
		self.setupPolling();
	}),
	destroy() {
		self.messages = cast([]);
		self.pollingEnabled = false;
		self.canceler?.();
		// eslint-disable-next-line @typescript-eslint/no-extra-parens
		getRoot<{clearChat?:(key: string) => void}>(self).clearChat?.(self.with);
	},
}));

export type ChatInstance = Instance<typeof Chat>;
