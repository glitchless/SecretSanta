import React, { Component } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';

import IllustratedEntryGiftIcon from 'assets/images/illustrated-entry-gift.svg';
import IllustratedEntrySantaCoolIcon from 'assets/images/illustrated-entry-santa-cool.svg';
import IllustratedEntrySnowmanIcon from 'assets/images/illustrated-entry-snowman.svg';

import RouteStore from 'store/routes';

import { IllustratedEntryList } from 'components/IllustratedEntryList/IllustratedEntryList';
import { Button } from 'components/Button/Button';
import { Header } from 'components/Header/Header';
import { Footer } from 'components/Footer/Footer';

import { messages } from '@/store/messages';

import './IndexView.scss';
import { navigate } from '@/utils/url';
import { internalFlag, InternalFlags, OauthProvider } from '@/store/features';
import { IStoreInstance } from '@/models';
import { observer } from 'mobx-react';
import Popover from 'antd/lib/popover';

const indexMessages = messages('index-page');

interface Props extends RouteComponentProps {
	store: IStoreInstance;
}

interface State {
	oauthSelectOpen: boolean;
}

class IndexView extends Component<Props, State> {
	state = { oauthSelectOpen: false };

	constructor(props: Props) {
		super(props);

		this.handleAuthorizeClick = this.handleAuthorizeClick.bind(this);
	}

	handleAuthorizeClick(event: React.MouseEvent) {
		const oauthFlag = internalFlag('oauth');

		event.preventDefault();

		this.handleAuthorize(oauthFlag);
	}

	handleSelectOauthType(provider: OauthProvider) {
		this.handleAuthorize({
			...internalFlag('oauth'),
			...provider,
		});
	}

	toggleOauthSelect = () => {
		this.setState(({ oauthSelectOpen }) => ({ oauthSelectOpen: !oauthSelectOpen }));
	};

	handleAuthorize(oauthFlag: InternalFlags['oauth']) {
		const url = new URL(oauthFlag.externalUrl);

		if (oauthFlag.redirectParam) {
			const backUrl = new URL(window.location.href);

			backUrl.search = '';
			backUrl.pathname = oauthFlag.backRoute;

			url.searchParams.set(oauthFlag.redirectParam, backUrl.toString());
		}

		navigate(url.toString());
	}

	getEntries() {
		return [
			{
				title: 'Итак, что же это такое?',
				description: indexMessages.get('howItWorks'),
				icon: IllustratedEntrySnowmanIcon,
			},
			{
				title: 'Анонимность',
				description: 'Вы знаете кому посылаете подарок, но человек не знает что подарок ваш :) Компаньон для подарка выбирается случайным образом. Это отличный повод познакомиться с кем-нибудь! Но помните: если вы не отправите подарок, то кто-то останется без подарка, а вы будете в черном списке.',
				icon: IllustratedEntrySantaCoolIcon,
			},
			{
				title: 'Доставка',
				description: indexMessages.get('deliveryExplanation'),
				icon: IllustratedEntryGiftIcon,
			},
		];
	}

	getLoginTooltipContent() {
		return (
			<div className="index-view__oauth-picker">
				<div className="index-view__oauth-picker-header">Войти через</div>
				{internalFlag('oauth').providers.map((provider) => (
					<div key={provider.name} className="index-view__oauth-picker-item">
						<Button stretch text={provider.name} onAction={() => this.handleSelectOauthType(provider)} />
					</div>
				))}
			</div>
		);
	}

	render() {
		const entries = this.getEntries();

		const { store } = this.props;
		const { oauthSelectOpen } = this.state;

		const loginButton = 'providers' in internalFlag('oauth')
			? (
				<Popover visible={oauthSelectOpen} content={this.getLoginTooltipContent()}>
					<Button
						text={indexMessages.get('loginText')}
						onAction={this.toggleOauthSelect}
					/>
				</Popover>
			)
			: (
				<Button
					text={indexMessages.get('loginText')}
					onAction={this.handleAuthorizeClick}
				/>
			);

		return (
			<div className="index-view">
				<Header store={store} />
				<div className="index-view__content">
					<div className="index-view__container">
						<div className="index-view__promo">
							{loginButton}
						</div>

						<div>
							<IllustratedEntryList entries={entries} />
						</div>
					</div>
				</div>
				<Footer short />
			</div>
		);
	}
}

export default withRouter(observer(IndexView));
