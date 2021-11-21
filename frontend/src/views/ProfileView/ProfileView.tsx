import React from 'react';
import { observer } from 'mobx-react';

import { Header } from 'components/Header/Header';
import { Footer } from 'components/Footer/Footer';

import { StatusBar } from 'components/StatusBar/StatusBar';
import { CardList } from 'components/CardList/CardList';
import { Button } from 'components/Button/Button';
import { ErrorBlock } from 'components/ErrorBlock/ErrorBlock';

import RouteStore from 'store/routes';

import Carrier from 'services/carrier';

import { serializeFormData } from 'utils/forms';

import { DeliveryInfoErrors, IUserInstance } from '@/models/UserData';
import { ISeasonDataInstance } from '@/models/SeasonData';
import { IStoreInstance } from '@/models';

import { getCardListEntries } from '@/views/ProfileView/cards';
import { getStatusBarEntries } from '@/views/ProfileView/utils/statuses';
import { CardEntry } from '@/components/Card/Card';
import { SeasonInformation } from '@/components/SeasonInformation/SeasonInformation';

import './ProfileView.scss';

export interface State {
	formErrors?: DeliveryInfoErrors | null;
	error?: {
		code: number;
		message: any;
	} | null;
}

export interface Props {
	stats: ISeasonDataInstance;
	user: IUserInstance;
	debug: boolean;
	store: IStoreInstance;
}

class ProfileView extends React.Component<Props, State> {
	state = {
		error: null,
		formErrors: null,
	};

	handleParticipateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		const { user } = this.props;

		event.preventDefault();
		const form = event.target as HTMLFormElement;

		// const action = form.getAttribute('action')!;

		const formData = new FormData(form);
		const payload = serializeFormData(formData);

		user.saveDeliveryInfo(payload as any).then((formErrors) => {
			this.setState({
				formErrors,
			});
		});
	};

	handleRevokeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.target;

		// @ts-expect-error TODO: deal with getAttribute typing
		const action = form.getAttribute('action');

		const payload = {
			is_active: false,
		};

		Carrier.post(action, { payload }).then((data) => {
			const { code, message } = data;

			if (code !== 200) {
				this.setState({
					error: {
						code,
						message,
					},
				});

				return;
			}

			const { store } = this.props;

			store.setUser(message);
		});
	};

	handleGiftSentConfirmSubmit = (event: React.MouseEvent) => {
		event.preventDefault();
		const action = RouteStore.api.users.profile;

		const payload = {
			is_sent: true,
		};

		Carrier.post(action, { payload }).then((data) => {
			const { code, message } = data;

			if (code !== 200) {
				this.setState({
					error: {
						code,
						message,
					},
				});

				return;
			}

			const { store } = this.props;

			store.setUser(message);
		});
	};

	handleGiftReceivedConfirmSubmit = (event: React.MouseEvent) => {
		event.preventDefault();
		const action = RouteStore.api.users.profile;

		const payload = {
			is_received: true,
		};

		Carrier.post(action, { payload }).then((data) => {
			const { code, message } = data;

			if (code !== 200) {
				this.setState({
					error: {
						code,
						message,
					},
				});

				return;
			}

			const { store } = this.props;

			store.setUser(message);

			/*
			 * this.setState({
			 *     leftCardLayout: 'received'
			 * });
			 */
		});
	};

	handleDropUserClick = (event: React.MouseEvent) => {
		event.preventDefault();
		const { store } = this.props;
		const action = RouteStore.api.users.drop;

		Carrier.get(action).then((data) => {
			const { code, message } = data;

			if (code !== 200) {
				this.setState({
					error: {
						code,
						message,
					},
				});

				return;
			}

			store.setUser(message);
		});
	};

	getCardListEntries = (): CardEntry[] => {
		const { stats, user } = this.props;
		const { formErrors } = this.state;

		return getCardListEntries({
			user,
			stats,
			formErrors,
			handleRevokeSubmit: this.handleRevokeSubmit,
			handleParticipateSubmit: this.handleParticipateSubmit,
			handleGiftSentConfirmSubmit: this.handleGiftSentConfirmSubmit,
			handleGiftReceivedConfirmSubmit: this.handleGiftReceivedConfirmSubmit,
		});
	};

	render() {
		const {
			stats, debug, store, user,
		} = this.props;

		const { error } = this.state;

		const statusBarEntries = getStatusBarEntries(stats);
		const cardListEntries = this.getCardListEntries();

		return (
			<div className="profile-view">
				<Header short store={store} />
				<div className="profile-view__content">
					<div className="profile-view__container">
						<StatusBar entries={statusBarEntries!} />

						<SeasonInformation stats={stats} />

						{error && <ErrorBlock error={error!} />}

						<CardList entries={cardListEntries} />

						{debug && (
							<Button
								text="Сбросить пользователя"
								stretch
								repulsive
								onAction={this.handleDropUserClick}
							/>
						)}
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}

export default observer(ProfileView);
