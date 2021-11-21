import {
	Instance, SnapshotOrInstance, types, flow, cast,
} from 'mobx-state-tree';

import { SeasonData } from '@/models/SeasonData';
import { User } from '@/models/UserData';
import Carrier from '@/services/carrier';
import { internalFlag } from '@/store/features';
import { Chat } from '@/models/Chat';
import { getDebugParam } from '@/utils/query-string';

export enum CurrentUserSeasonState {
	Initial = 'initial',
	Received = 'received',
	Sent = 'sent',
	Awaiting = 'awaiting',
	Unauthorized = 'unauthorized',
	Applied = 'applied',
}

export enum ReceiverUserSeasonState {
	Initial = 'initial',
	Received = 'received',
	Sent = 'sent',
	Awaiting = 'awaiting',
	Unauthorized = 'unauthorized',
}

const Chats = types.model('Chats', {
	sender: types.optional(Chat, {
		with: 'sender',
	}),
	receiver: types.optional(Chat, {
		with: 'receiver',
	}),
});

export const Store = types.model('Store', {
	seasonData: types.maybeNull(SeasonData),
	user: types.maybeNull(User),
	chats: types.optional(Chats, {}),
}).views((self) => ({
	isDataFully() {
		return self.seasonData !== null && self.user !== null;
	},
})).actions((self) => ({
	logout() {
		self.user = null;
	},

	setUser(data: SnapshotOrInstance<typeof User> | null) {
		self.user = cast(data);
	},
	setSeasonData(data: SnapshotOrInstance<typeof SeasonData>) {
		self.seasonData = cast(data);
	},
	clearChat(key: 'receiver' | 'sender') {
		self.chats[key] = Chat.create({ with: key });
	},
})).actions((self) => ({
	auth: flow<{code: number, message: string} | null, [Record<string, string>]>(function* auth(payload) {
		try {
			const data = yield Carrier.postWithValidation(internalFlag('oauth').apiUrl, { payload });

			self.setUser(data.message);
		} catch (err) {
			return err;
		}

		return null;
	}),
})).views((self) => ({
	getCurrentUserSeasonState() {
		const overridedState = getDebugParam('current-user-season-state');

		if (overridedState) {
			return overridedState;
		}

		let state: CurrentUserSeasonState = CurrentUserSeasonState.Unauthorized;

		if (self.user && self.seasonData) {
			if (self.seasonData.isExpired) {
				if (self.user.pair_sent) {
					if (self.user.is_received) {
						state = CurrentUserSeasonState.Received;
					} else {
						state = CurrentUserSeasonState.Sent;
					}
				} else {
					state = CurrentUserSeasonState.Awaiting;
				}
			} else if (self.user.is_active) {
				state = CurrentUserSeasonState.Applied;
			} else {
				state = CurrentUserSeasonState.Initial;
			}
		}

		return state;
	},

	getReceiverUserSeasonState() {
		// TODO: Переписать
		const overridedState = getDebugParam('receiver-season-state');

		if (overridedState) {
			return overridedState;
		}

		let state: ReceiverUserSeasonState = ReceiverUserSeasonState.Unauthorized;

		if (self.user && self.seasonData) {
			if (self.seasonData.isExpired) {
				if (self.user.pair_user) {
					if (self.user.is_sent) {
						// eslint-disable-next-line max-depth
						if (self.user.pair_user.is_received) {
							state = ReceiverUserSeasonState.Received;
						} else {
							state = ReceiverUserSeasonState.Sent;
						}
					} else {
						state = ReceiverUserSeasonState.Awaiting;
					}
				} else {
					state = ReceiverUserSeasonState.Initial;
				}
			} else {
				state = ReceiverUserSeasonState.Initial;
			}
		}

		return state;
	},
}));

export type IStoreInstance = Instance<typeof Store>;
