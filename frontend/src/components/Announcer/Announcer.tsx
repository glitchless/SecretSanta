import React from 'react';

import { PromoLink } from 'components/PromoLink/PromoLink';

import IllustrationSeasonEnd from 'assets/images/illustration-season-end.svg';

import RouteStore from 'store/routes';

import './Announcer.scss';

export enum AnnouncerTypes {
	SeasonEnded = 'season-ended',
}

export interface Props {
	type: AnnouncerTypes;
}

export const Announcer: React.FC<Props> = (props) => {
	const { type } = props;

	switch (type) {
		case 'season-ended':
			return (
				<div className="announcer">
					<img className="announcer__picture" alt="Конец сезона" src={IllustrationSeasonEnd} />
					<div className="announcer__content">
						<div className="announcer__title">
							{/* TODO: брать текущий год + 1? */}
							С новым счастьем 2021!
						</div>
						<div className="announcer__description">
							Сезон закрыт! Большое спасибо всем участникам, вместе мы сделали этот праздник немного ярче!
						</div>
						<PromoLink
							icon="vk"
							text="Группа разработчиков на vk.com"
							href={RouteStore.external.glitchless.vk}
						/>
					</div>
				</div>
			);
		default:
			return null;
	}
};
