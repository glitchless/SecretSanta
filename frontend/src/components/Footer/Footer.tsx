import React from 'react';

import { Blink } from 'components/Blink/Blink';

import IllustrationFooter from 'assets/images/illustration-footer-transparent.svg';

import RouteStore from 'store/routes';

import './Footer.scss';

interface Props {
	short?: boolean;
}

export const Footer: React.FC<Props> = (props) => {
	const { short } = props;

	return (
		<div className="footer">
			<div className="footer__content">
				<div className="footer__item">
					<div className="footer__row">
						<Blink to="mailto:support@glitchless.ru">
							Поддержка проекта <u>support@glitchless.ru</u>
						</Blink>
					</div>
					<div className="footer__row">
						<Blink to="mailto:support@glitchless.ru">
							Сотрудничество <u>support@glitchless.ru</u>
						</Blink>
					</div>
				</div>
				<div className="footer__item">
					<div className="footer__row">
						<Blink to={RouteStore.external.other.takataka} blank>Задизайнила <u>@taka_taka_artist</u></Blink>
					</div>
					<div className="footer__row">
						<Blink to={RouteStore.external.other.nafanya} blank>Иллюстрации <u>@nafanya_pict</u></Blink>
					</div>
					<div className="footer__row">
						<Blink to={RouteStore.external.glitchless.website} blank>Накодила команда <u>glitchless</u></Blink>
					</div>
				</div>
			</div>
			{/* TODO: подставлять текущий год */}
			{!short && <img className="footer__illustration" alt="Тайный Санта 2021" src={IllustrationFooter} />}
		</div>
	);
};
