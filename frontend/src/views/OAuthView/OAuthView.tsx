import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import type { RouteComponentProps } from 'react-router';

import RouteStore from 'store/routes';

import { Loader } from 'components/Loader/Loader';
import { Header } from 'components/Header/Header';
import { Footer } from 'components/Footer/Footer';
import { ErrorBlock } from 'components/ErrorBlock/ErrorBlock';

import Carrier from 'services/carrier';

import { getQueryParams } from 'utils/query-string';

import './OAuthView.scss';
import { internalFlag } from '@/store/features';
import { IUserInstance, User } from '@/models/UserData';
import { observer } from 'mobx-react';
import { IStoreInstance } from '@/models';

interface ApiError {
	code: number;
	message: string;
}

interface State {
	error: null | ApiError;
}

interface Props extends RouteComponentProps {
	store: IStoreInstance;
	user: IUserInstance | null;
}

class OAuthView extends Component<Props, State> {
	state: State = {
		error: null,
	};

	componentDidMount() {
		const { location } = this.props;
		const queryParams = getQueryParams(window.location);
		const { backParam } = internalFlag('oauth');

		if (!queryParams[backParam]) {
			return;
		}

		// eslint-disable-next-line no-console
		console.log({ location });
		// TODO: костыль для технопроектов, сделать нормально
		const authSourceMatch = (/\/([^/]+)\/?$/u).exec(location.pathname);
		const currentUrl = new URL(window.location.href);

		currentUrl.search = '';

		const payload: Record<string, any> = {
			[backParam]: queryParams[backParam],
			auth_source: authSourceMatch?.[1],
			redirect_uri: currentUrl,
		};

		const { store } = this.props;

		store.auth(payload).then((error) => {
			this.setState({
				error,
			});
		});
	}

	render() {
		const { store } = this.props;
		const { user } = store;

		const { error } = this.state;

		return (
			<>
				{user
					? <Redirect to={RouteStore.pages.profile} />
					: (
						<div className="oauth-view">
							<Header store={store} />
							<div className="oauth-view__content">
								<div className="oauth-view__container">
									{error && <ErrorBlock error={error!} />}
									<Loader type="regular" />
								</div>
							</div>
							<Footer />
						</div>
					)}
			</>
		);
	}
}

export default withRouter(observer(OAuthView));
