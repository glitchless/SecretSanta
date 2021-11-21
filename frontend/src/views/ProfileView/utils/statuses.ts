import { ISeasonDataInstance } from '@/models/SeasonData';
import { humanizeDate } from '@/utils/dates';

export const getStatusBarEntries = (stats: ISeasonDataInstance) => {
	if (!stats) {
		return null;
	}

	const pad = (number: number) => number.toString().padStart(3, '0');

	const { start_date: startDate, shuffle_date: shuffleDate, end_date: endDate } = stats;

	const dates = {
		start: humanizeDate(startDate.getMonth() + 1 as any, startDate.getDate()),
		shuffle: humanizeDate(shuffleDate.getMonth() + 1 as any, shuffleDate.getDate()),
		end: humanizeDate(endDate.getMonth() + 1 as any, endDate.getDate()),
	};

	return {
		counters: [
			{ topText: 'Участники', bottomText: pad(stats.users.active) },
			{ topText: 'Отправили', bottomText: pad(stats.users.sent) },
			{ topText: 'Получили', bottomText: pad(stats.users.received) },
		],
		roadmap: [
			{ topText: dates.start, bottomText: 'ОТКРЫТИЕ СЕЗОНА' },
			{ topText: dates.shuffle, bottomText: 'ЖЕРЕБЬЕВКА' },
			{ topText: dates.end, bottomText: 'ЗАКРЫТИЕ СЕЗОНА' },
		],
	};
};
