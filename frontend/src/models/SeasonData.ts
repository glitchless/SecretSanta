import { types, Instance } from 'mobx-state-tree';

import { humanizeNativeDate } from '@/utils/dates';
import { getDebugParam } from '@/utils/query-string';

export const UserStats = types.model('UserStats', {
	active: 0,
	received: 0,
	sent: 0,
});

export const SeasonData = types.model('SeasonData', {
	is_expired: types.boolean,
	start_date: types.Date,
	shuffle_date: types.Date,
	end_date: types.Date,
	users: UserStats,
}).views((self) => ({
	get humanizedStats() {
		return {
			start: {
				title: 'Открытие сезона',
				date: humanizeNativeDate(self.start_date),
			},
			shuffle: {
				title: 'Жеребьевка',
				date: humanizeNativeDate(self.shuffle_date),
			},
			end: {
				title: 'Конец сезона',
				date: humanizeNativeDate(self.end_date),
			},
		};
	},
})).views((self) => ({
	get isExpired(): boolean {
		const overridedState = getDebugParam('stats-is-expired');

		if (overridedState === 'true') {
			return true;
		}

		if (overridedState === 'false') {
			return false;
		}

		return self.is_expired;
	},
}));

export type ISeasonDataInstance = Instance<typeof SeasonData>;
