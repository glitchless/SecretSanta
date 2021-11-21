import React from 'react';

import IllustratedEntryNotGiftIcon from '@/assets/images/illustrated-entry-not-gift.svg';
import IllustratedEntryBoomIcon from '@/assets/images/illustrated-entry-boom.svg';
import IllustratedEntrySledIcon from '@/assets/images/illustrated-entry-sled.svg';

import { DeliveryInfoErrors, IUserInstance } from '@/models/UserData';
import { ISeasonDataInstance } from '@/models/SeasonData';

import { LeftCardApplied } from '@/components/Card/layouts/LeftCardApplied/LeftCardApplied';
import { Button } from '@/components/Button/Button';
import { CardEntry } from '@/components/Card/Card';

import { feature } from '@/store/features';

export enum LeftCardLayoutType {
	Initial = 'initial',
	Received = 'received',
	Sent = 'sent',
	Awaiting = 'awaiting',
	Unauthorized = 'unauthorized',
	Applied = 'applied',
}

export const getLeftCardLayoutType = (user: IUserInstance, stats: ISeasonDataInstance): LeftCardLayoutType => {
	let layout: LeftCardLayoutType = LeftCardLayoutType.Unauthorized;

	if (user && stats) {
		if (stats.isExpired) {
			if (user.pair_sent) {
				if (user.is_received) {
					layout = LeftCardLayoutType.Received;
				} else {
					layout = LeftCardLayoutType.Sent;
				}
			} else {
				layout = LeftCardLayoutType.Awaiting;
			}
		} else if (user.is_active) {
			layout = LeftCardLayoutType.Applied;
		} else {
			layout = LeftCardLayoutType.Initial;
		}
	}

	return layout;
};

export interface IGetLeftCardLayoutParams {
	user: IUserInstance;
	stats: ISeasonDataInstance;
	formErrors?: DeliveryInfoErrors | null;
	handleRevokeSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	handleParticipateSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	handleGiftReceivedConfirmSubmit: (event: React.MouseEvent) => void;
	handleGiftSentConfirmSubmit: (event: React.MouseEvent) => void;
}

export const getLeftCardLayout = ({
	user,
	stats,
	formErrors,
	handleRevokeSubmit,
	handleParticipateSubmit,
	handleGiftReceivedConfirmSubmit,
}: IGetLeftCardLayoutParams): CardEntry => {
	const layoutType: LeftCardLayoutType = getLeftCardLayoutType(user, stats);
	const share = feature('sharingChannel')!;

	switch (layoutType) {
		default:
		case LeftCardLayoutType.Initial:
		case LeftCardLayoutType.Applied: {
			const isRevoke = layoutType === LeftCardLayoutType.Applied;

			return {
				icon: null,
				title: user.full_name,
				description: [],
				markup: (
					<LeftCardApplied
						isRevoke={isRevoke}
						user={user}
						handleRevokeSubmit={handleRevokeSubmit}
						handleParticipateSubmit={handleParticipateSubmit}
						formErrors={formErrors}
					/>
				),
			};
		}
		case LeftCardLayoutType.Sent:
			return {
				icon: IllustratedEntrySledIcon,
				title: user.full_name,
				subtitle: 'Тебе отправили подарок!',
				description: [
					<div><b>Адрес:</b> {`${user.delivery_information.index}, ${user.delivery_information.address}`}</div>,
					<div><b>Твой комментарий:</b></div>,
					`"${user.delivery_information.comment}"`,
				],
				markup: <Button text="Подарок у меня" stretch repulsive onAction={handleGiftReceivedConfirmSubmit} />,
			};
		case LeftCardLayoutType.Awaiting:
			return {
				icon: IllustratedEntryNotGiftIcon,
				title: user.full_name,
				subtitle: 'Подарок тебе ещё не отправлен.',
				description: [
					<div>Ты представился как <b>{user.delivery_information.name}</b>.</div>,
					<div><b>Адрес:</b> {`${user.delivery_information.index}, ${user.delivery_information.address}`}</div>,
					<div><b>Твой комментарий:</b></div>,
					`"${user.delivery_information.comment}"`,
				],
			};
		case LeftCardLayoutType.Received:
			return {
				icon: IllustratedEntryBoomIcon,
				title: user.full_name,
				subtitle: 'Не забудь рассказать друзьям, что тебе подарили!',
				description: feature('sharingChannel') ? [
					<div>
						{share.promoText}&nbsp;
						<a href={share.linkHref} target="_blank" rel="noopener noreferrer">
							{share.linkText}
						</a>
					</div>,
				] : [],
			};
	}
};
