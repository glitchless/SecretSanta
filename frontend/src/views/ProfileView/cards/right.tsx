import React from 'react';

import IllustratedEntryQuestionIcon from '@/assets/images/illustrated-entry-question.svg';
import IllustratedEntryGiftMaiIcon from '@/assets/images/illustrated-entry-gift-mail.svg';
import IllustratedEntryWithHeadphonesIcon from '@/assets/images/illustrated-entry-with-headphones.svg';
import IllustratedEntryBagIcon from '@/assets/images/illustrated-entry-bag.svg';

import { Button } from '@/components/Button/Button';

import { IUserInstance } from '@/models/UserData';
import { ISeasonDataInstance } from '@/models/SeasonData';

import { humanizeDate } from '@/utils/dates';

export enum RightCardLayoutType {
	Initial = 'initial',
	Received = 'received',
	Sent = 'sent',
	Awaiting = 'awaiting',
	Unauthorized = 'unauthorized',
}

export const getRightCardLayoutType = (user: IUserInstance, stats: ISeasonDataInstance): RightCardLayoutType => {
	let layout: RightCardLayoutType = RightCardLayoutType.Unauthorized;

	if (user && stats) {
		if (stats.is_expired) {
			if (user.is_sent) {
				if (user?.pair_user?.is_received) {
					layout = RightCardLayoutType.Received;
				} else {
					layout = RightCardLayoutType.Sent;
				}
			} else {
				layout = RightCardLayoutType.Awaiting;
			}
		} else {
			layout = RightCardLayoutType.Initial;
		}
	}

	return layout;
};

export interface IGetRightCardLayoutParams {
	user: IUserInstance;
	stats: ISeasonDataInstance;
	handleGiftSentConfirmSubmit: (event: React.MouseEvent) => void;
}

export const getRightCardLayout = ({
	user,
	stats,
	handleGiftSentConfirmSubmit,
}: IGetRightCardLayoutParams) => {
	const layout: RightCardLayoutType = getRightCardLayoutType(user, stats);

	const { pair_user: receiver } = user;

	switch (layout) {
		default:
		case RightCardLayoutType.Initial: {
			const { shuffle_date: shuffleDate } = stats;
			const day = shuffleDate.getDate();
			const month = shuffleDate.getMonth() + 1;

			return {
				icon: IllustratedEntryQuestionIcon,
				title: 'Адресат',
				subtitle: 'Твой получатель еще неизвестен',
				description: [
					<div>Жеребьевка адресов пройдет <b>{humanizeDate(month as any, day)}</b>. Каждому будет назначен свой
						получатель.
					</div>,
				],
				markup: null,
			};
		}
		case RightCardLayoutType.Awaiting:
			return {
				icon: IllustratedEntryGiftMaiIcon,
				title: receiver!.delivery_information.name,
				subtitle: 'Время отправить подарок!',
				description: [
					<div>Твой получатель — <b><a href={receiver!.profile_url} target="_blank" rel="noopener noreferrer">{receiver!.delivery_information.name}</a></b></div>,
					<div><b>Адрес:</b> {`${receiver!.delivery_information.index}, ${receiver!.delivery_information.address}`}</div>,
					<div><b>Комментарий получателя:</b></div>,
					`"${receiver!.delivery_information.comment}"`,
				],
				markup: <Button text="Подарок отправлен" stretch repulsive onAction={handleGiftSentConfirmSubmit} />,
			};
		case RightCardLayoutType.Sent:
			return {
				icon: IllustratedEntryBagIcon,
				title: receiver!.delivery_information.name,
				subtitle: 'Подарок отправился к получателю!',
				description: [
					<div>Твой получатель — <b><a href={receiver!.profile_url} target="_blank" rel="noopener noreferrer">{receiver!.delivery_information.name}</a></b></div>, <div><b>Адрес:</b> {`${receiver!.delivery_information.index}, ${receiver!.delivery_information.address}`}</div>,
				],
			};
		case RightCardLayoutType.Received:
			return {
				icon: IllustratedEntryWithHeadphonesIcon,
				title: receiver!.delivery_information.name,
				subtitle: 'Подарок получен!',
				description: [
					<div>Твой получатель — <b><a href={receiver!.profile_url} target="_blank" rel="noopener noreferrer">{receiver!.delivery_information.name}</a></b></div>,
					<div><b>Адрес:</b> {`${receiver!.delivery_information.index}, ${receiver!.delivery_information.address}`}</div>,
					'Надеемся, мы вместе подарили кому-то новогоднее настроение!',
				],
			};
	}
};
