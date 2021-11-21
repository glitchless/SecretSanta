import {
	types, Instance, flow, SnapshotIn, applySnapshot,
} from 'mobx-state-tree';
import Carrier from '@/services/carrier';
import RouteStore from '@/store/routes';
import { ConditionalExcept } from 'type-fest';

const maybeMaybeNull = (arg: Parameters<typeof types.maybe>[0]) => types.maybe(types.maybeNull(arg));

export const DeliveryInfo = types.model('UserStats', {
	name: types.string,
	comment: types.string,
	index: types.string,
	address: types.string,
});

type DeliveryInfoProps = ConditionalExcept<SnapshotIn<typeof DeliveryInfo>, symbol>;

export type DeliveryInfoErrors = Partial<{
	[k in keyof DeliveryInfoProps]: string
}>;

export const PairUser = types.model('PairUser', {
	delivery_information: DeliveryInfo,
	photo_url: maybeMaybeNull(types.string),
	profile_url: maybeMaybeNull(types.string),
	is_received: false,
	is_sent: false,
});

export const User = types.model('User', {
	id: types.number, // types.identifierNumber,// TODO: вернуть когда полностью переедем на единый store
	email: types.optional(types.string, ''),
	full_name: types.optional(types.string, ''),
	is_active: false,
	is_sent: false,
	is_received: false,
	photo_url: maybeMaybeNull(types.string),
	profile_url: maybeMaybeNull(types.string),
	pair_sent: maybeMaybeNull(types.boolean),
	pair_user: maybeMaybeNull(PairUser),
	delivery_information: DeliveryInfo,
}).actions((self) => ({
	saveIsSent: flow<any, [boolean]>(function* save(value) {
		self.is_sent = value;

		try {
			const response = yield Carrier.postWithValidation(
				RouteStore.api.users.profile,
				{ payload: { is_sent: value } },
			);

			applySnapshot(self, response.message);
		} catch (response) {
			const { message } = response;

			return message.errors;
		}

		return null;
	}),
	saveIsReceived: flow<any, [boolean]>(function* save(value) {
		self.is_sent = value;

		try {
			const response = yield Carrier.postWithValidation(
				RouteStore.api.users.profile,
				{ payload: { is_received: value } },
			);

			applySnapshot(self, response.message);
		} catch (response) {
			const { message } = response;

			return message.errors;
		}

		return null;
	}),
	saveDeliveryInfo: flow<DeliveryInfoErrors | null, [SnapshotIn<typeof DeliveryInfo>]>(
		function* save(data) {
			self.delivery_information = data;

			try {
				const response = yield Carrier.postWithValidation(
					RouteStore.api.users.profile,
					{ payload: { delivery_information: data, is_active: true } },
				);

				applySnapshot(self, response.message);
			} catch (response) {
				const { message } = response;

				return message.errors.delivery_information;
			}

			return null;
		},
	),
})).views((self) => ({
	get name() {
		return self.delivery_information.name || self.full_name;
	},
}));

export type IUserInstance = Instance<typeof User>;
