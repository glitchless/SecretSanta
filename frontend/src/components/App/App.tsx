import React from 'react';
import {
	BrowserRouter,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';

// Сторы
import RouteStore from 'store/routes';

// Компоненты
import IndexView from '@/views/IndexView/IndexView';
import ProfileView from '@/views/NewProfileView/ProfileView';
import OAuthView from '@/views/OAuthView/OAuthView';

// Сервисы
import Carrier from 'services/carrier';

/*
 * Модели
 * import User from 'models/user';
 */

// Шрифты
import 'assets/fonts/ST SEV 85178 Regular.ttf';
import 'assets/fonts/PTSans Regular.ttf';
import 'assets/fonts/PTSans Bold.ttf';
import 'assets/fonts/RoundedMplus1c Regular.ttf';
import 'assets/fonts/RoundedMplus1c ExtraBold.ttf';

// Стили
import './App.scss';

// Модели
import { IStoreInstance, Store } from '@/models';
import { User } from '@/models/UserData';
import { internalFlag } from '@/store/features';
import { observer } from 'mobx-react';

interface State {
	store: IStoreInstance;
	debug: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
}

class App extends React.Component<Props, State> {
	routes: any;

	constructor(props: Props) {
		super(props);

		const store = Store.create({
			seasonData: null,
			user: null,
		});

		(window as any).store = store;

		this.state = {
			debug: false,
			store,
		};
	}

	componentDidMount() {
		const { store } = this.state;

		Carrier.getWithValidation(RouteStore.api.stats).then(({ message }) => {
			store.setSeasonData(message);
		});

		Carrier.getWithValidation(RouteStore.api.users.profile).then((profile) => {
			const { message: userData } = profile;

			const user = User.create(userData);

			store.setUser(user);
		});
	}

	render() {
		const {
			debug, store,
		} = this.state;

		return (
			<BrowserRouter>
				<Switch>
					<Route path={RouteStore.pages.index} exact>
						{store.isDataFully()
							? <Redirect to={{ pathname: RouteStore.pages.profile, search: window.location.search }} />
							: <IndexView store={store} />}
					</Route>
					<Route path={RouteStore.pages.profile} exact>
						{store.isDataFully()
							? <ProfileView store={store} />
							: <Redirect to={{ pathname: RouteStore.pages.index, search: window.location.search }} />}
					</Route>
					<Route path={internalFlag('oauth').backRoute} exact>
						<OAuthView store={store} user={store.user} />
					</Route>
					<Route>
						<Redirect to={{ pathname: RouteStore.pages.index, search: window.location.search }} />
					</Route>
				</Switch>
			</BrowserRouter>
		);
	}
}

export default observer(App);
