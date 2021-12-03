import React, { Component } from 'react';

import { internalFlag } from '@/store/features';

import IllustratedEntryGiftIcon from 'assets/images/illustrated-entry-gift.svg';
import IconGlitchless from 'assets/images/icon-glitchless.svg';

import RouteStore from 'store/routes';

import Carrier from 'services/carrier';

import './Header.scss';

import { HeaderLogoLarge } from '@/components/HeaderLogoLarge/HeaderLogoLarge';
import { messages } from '@/store/messages';
import { IStoreInstance } from '@/models';
import { observer } from 'mobx-react';

type State = any;

const headerMessages = messages('header');

interface Props {
	short?: boolean;
	store: IStoreInstance;
}

class HeaderComponent extends Component<Props, State> {
	handleLogout = (event: React.MouseEvent) => {
		event.preventDefault();

		/*
		 * const {target} = event;
		 * const action = target.getAttribute('href');
		 */
		const action = RouteStore.api.users.logout;

		Carrier.post(action).then((data) => {
			const { code, message } = data;

			if (code !== 200) {
				this.setState({
					// TODO: поддержать стейт ошибки
					// eslint-disable-next-line react/no-unused-state
					error: {
						code,
						message,
					},
				});

				return;
			}

			const { store } = this.props;

			store.logout();
		});
	};

	render() {
		const { short, store } = this.props;
		const { user } = store;

		const donateUrl = internalFlag('donateUrl');

		return (
			<>
				{short ? (
					<div className="header header_short">
						<div className="header__title">
							<div className="header__logo">
								<img alt={headerMessages.get('title')} src={IllustratedEntryGiftIcon} />
							</div>
							<div className="header__text">{headerMessages.get('title')}</div>
						</div>
						<div className="header-controls">
							{ donateUrl && (
								<a
									href={donateUrl as string}
									className="header-controls-item"
									target="_blank"
									rel="noopener noreferrer"
								>
									<div className="header-controls-item__cta">
										<i className="fas fa-donate" />
										Поддержать разработчика
									</div>
								</a>
							)}
							<a href={RouteStore.external.glitchless.website} className="header-controls-item">
								<img className="header-controls-item__icon" alt="Сайт команды glitchless" src={IconGlitchless} />
							</a>
							<a href={RouteStore.external.glitchless.vk} className="header-controls-item">
								<i className="fab fa-vk" />
							</a>
							<a href={RouteStore.external.glitchless.github} className="header-controls-item">
								<i className="fab fa-github" />
							</a>
							{user && (
								<a href={RouteStore.api.users.logout} className="header-controls-item" onClick={this.handleLogout}>
									<i className="fas fa-sign-out-alt" />
								</a>
							)}
						</div>
					</div>
				) : (
					<div className="header header_regular">
						<div className="header__content">
							<HeaderLogoLarge title={headerMessages.get('title')} year="2021" />
							<div className="header__controls">
								<div className="header-controls">
									<a href={RouteStore.external.glitchless.website} className="header-controls-item">
										<img className="header-controls-item__icon" alt="Сайт команды glitchless" src={IconGlitchless} />
									</a>
									<a href={RouteStore.external.glitchless.vk} className="header-controls-item">
										<i className="fab fa-vk" />
									</a>
									<a href={RouteStore.external.glitchless.github} className="header-controls-item">
										<i className="fab fa-github" />
									</a>
									{user && (
										<a href={RouteStore.api.users.logout} className="header-controls-item" onClick={this.handleLogout}>
											<i className="fab fa-sign-out-alt" />
										</a>
									)}
								</div>
							</div>
						</div>
					</div>
				)}
			</>
		);
	}
}

export const Header = observer(HeaderComponent);
