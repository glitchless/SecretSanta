import { plural } from '@/utils/plural';
import { ISeasonDataInstance } from '@/models/SeasonData';

const months = {
	1: { neutral: 'январь', pointer: 'января' },
	2: { neutral: 'февраль', pointer: 'февраля' },
	3: { neutral: 'март', pointer: 'марта' },
	4: { neutral: 'апрель', pointer: 'апреля' },
	5: { neutral: 'май', pointer: 'мая' },
	6: { neutral: 'июнь', pointer: 'июня' },
	7: { neutral: 'июль', pointer: 'июля' },
	8: { neutral: 'август', pointer: 'августа' },
	9: { neutral: 'сентябрь', pointer: 'сентября' },
	10: { neutral: 'октябрь', pointer: 'октября' },
	11: { neutral: 'ноябрь', pointer: 'ноября' },
	12: { neutral: 'декабрь', pointer: 'декабря' },
};

export type MonthNumber = keyof typeof months;

export const humanizeDate = (month: MonthNumber, day: number) => {
	const monthTexts = months[month];

	if (day) {
		const dayString = day.toString().padStart(2, '0');

		return `${dayString} ${monthTexts.pointer}`;
	}

	return monthTexts.neutral;
};

export const humanizeNativeDate = (date: Date): string => {
	const month = (date.getMonth() + 1) as MonthNumber;
	const day = date.getDate();

	return humanizeDate(month, day);
};

export const calculateDateDiff = (date: Date) => {
	const timestampDiff = Number(date) - Date.now();

	const days = Math.floor(timestampDiff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((timestampDiff / (1000 * 60 * 60)) % 24);

	return {
		days,
		hours,
	};
};

export const getStartTimeText = (stats: ISeasonDataInstance) => {
	const dateDiff = calculateDateDiff(stats.shuffle_date);

	let startTimeText = `${dateDiff.days} ${plural(dateDiff.days, ['дней',
		'день',
		'дня'])}`;

	if (dateDiff.hours !== 0) {
		startTimeText += ` ${dateDiff.hours} ${plural(dateDiff.hours, ['часов',
			'час',
			'часа'])}`;
	}

	return startTimeText;
};
