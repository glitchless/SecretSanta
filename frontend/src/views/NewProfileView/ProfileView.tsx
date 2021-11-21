import React from 'react';
import { observer } from 'mobx-react';

import { Header } from '@/components/Header/Header';
import { Stats } from '@/components/Stats/Stats';
import { Schedule } from '@/components/Schedule/Schedule';
import { CurrentUserSeasonState, IStoreInstance, ReceiverUserSeasonState } from '@/models';

import { FormParticipate } from '@/components/FormParticipate/FormParticipate';
import { Tabs } from '@/components/Tabs/Tabs';
import { Footer } from '@/components/Footer/Footer';
import { Props as ISidebarCard, SidebarCard } from '@/components/SidebarCard/SidebarCard';

import IllustratedEntryWithHeadphonesIcon from '@/assets/images/illustrated-entry-with-headphones.svg';
import IllustratedEntryQuestionIcon from '@/assets/images/illustrated-entry-question.svg';
import BackgroundPattern from '@/assets/images/background-pattern.svg';
import { Chat, Mode } from '@/components/Chat/Chat';
import { Summary, Mode as SummaryMode } from '@/components/Summary/Summary';
import { Reminder } from '@/components/Reminder/Reminder';
import { reminderEntries } from '@/views/ProfileView/utils/reminder';

import './ProfileView.scss';

enum Tab {
	Info,
	ChatWithSender,
	ChatWithReceiver,
}

interface State {
	activeTabIndex: number;
}

interface Props {
	store: IStoreInstance;
}

class ProfileView extends React.Component<Props, State> {
	state: State = {
		activeTabIndex: 0,
	};

	handleTabClick = (tabIndex: number) => {
		this.setState({ activeTabIndex: tabIndex });
	};

	handleGiftSentConfirmClick = () => {
		this.user.saveIsSent(true);
	};

	handleGiftReceivedConfirmClick = () => {
		this.user.saveIsReceived(true);
	};

	get stats() {
		const { store } = this.props;

		return store.seasonData!;
	}

	get user() {
		const { store } = this.props;

		return store.user!;
	}

	get content() {
		const { store } = this.props;
		const { activeTabIndex } = this.state;
		const { user, stats } = this;

		if (activeTabIndex === Tab.ChatWithSender) {
			return <Chat mode={Mode.withSender} user={user} model={store.chats.sender} key="sender" />;
		}

		if (activeTabIndex === Tab.ChatWithReceiver) {
			return <Chat mode={Mode.withReceiver} user={user} model={store.chats.receiver} key="receiver" />;
		}

		if (!stats.isExpired) {
			// Initial | Applied
			return (
				<>
					<Reminder entries={reminderEntries} />
					<FormParticipate user={user} stats={stats} store={store} />
				</>
			);
		}

		const {
			delivery_information: delivery,
			pair_user: pairUser,
		} = user;

		return (
			<>
				<Reminder entries={reminderEntries} />
				<Summary
					title={user.name}
					url={user.profile_url}
					index={delivery.index}
					address={delivery.address}
					comment={delivery.comment}
					mode={SummaryMode.Current}
				/>
				{ pairUser && (
					<Summary
						title={`${pairUser.delivery_information.name} (твой получатель)`}
						url={pairUser.profile_url}
						index={pairUser.delivery_information.index}
						address={pairUser.delivery_information.address}
						comment={pairUser.delivery_information.comment}
						mode={SummaryMode.Receiver}
					/>
				) }
			</>
		);
	}

	get tabs() {
		const { user, stats } = this;
		const { activeTabIndex } = this.state;

		return [
			{ title: 'Информация', isHidden: false },
			{ title: 'Чат с Сантой', isHidden: !stats.isExpired },
			{ title: 'Чат с Получателем', isHidden: !stats.isExpired || !user.pair_user },
		].map((tab, idx) => ({
			...tab,
			isActive: idx === activeTabIndex,
		}));
	}

	// TODO: Вынести в отдельную функцию
	get currentUserSidebarCard(): ISidebarCard {
		const { store } = this.props;
		const { user } = this;
		const state = store.getCurrentUserSeasonState();

		const name = user.delivery_information?.name || user.full_name || 'Текущий пользователь';

		const baseCardProps: Pick<ISidebarCard, 'image'> = {
			image: IllustratedEntryWithHeadphonesIcon,
		};

		if (state === CurrentUserSeasonState.Applied) {
			return {
				...baseCardProps,
				header: name,
				title: 'Ожидание жеребьевки',
				description: 'Ты участвуешь! Теперь нужно дождаться начала события.',
			};
		}

		if (state === CurrentUserSeasonState.Awaiting) {
			return {
				...baseCardProps,
				header: name,
				title: 'Подарок тебе ещё не отправлен',
				description: 'Теперь нужно дождаться, пока тебе подготовят подарок.',
			};
		}

		if (state === CurrentUserSeasonState.Sent) {
			return {
				...baseCardProps,
				header: name,
				title: 'Тебе отправили подарок',
				description: 'Осталось дождаться доставки. Рекомендуем спросить у отправителя трек-код в чате.',
				action: {
					text: 'Подарок у меня',
					onClick: this.handleGiftReceivedConfirmClick,
				},
			};
		}

		if (state === CurrentUserSeasonState.Received) {
			return {
				...baseCardProps,
				header: name,
				title: 'Не забудь рассказать друзьям, что тебе подарили!',
				description: 'Мы планируем опубликовать фотографии подарков в Instagram проекта.',
			};
		}

		// По-умолчанию и Initial
		return {
			...baseCardProps,
			header: user.delivery_information.name,
			title: 'Можно подать заявку',
			description: 'Чтобы принять участие в фестивале подарков, заполни и отправь анкету!',
		};
	}

	get receiverSidebarCard(): ISidebarCard {
		const { store } = this.props;
		const { stats, user } = this;
		const state = store.getReceiverUserSeasonState();

		const baseCardProps: Pick<ISidebarCard, 'alternative' | 'image'> = {
			alternative: true,
			image: IllustratedEntryQuestionIcon,
		};

		if (state === ReceiverUserSeasonState.Awaiting) {
			return {
				...baseCardProps,
				header: user.pair_user.delivery_information.name,
				title: 'Время отправить подарок',
				description: 'Твой получатель определен. Постарайся учесть его пожелания к подарку!',
				action: {
					text: 'Подарок отправлен',
					onClick: this.handleGiftSentConfirmClick,
				},
			};
		}

		if (state === ReceiverUserSeasonState.Sent) {
			return {
				...baseCardProps,
				header: user.pair_user.delivery_information.name,
				title: 'Подарок отправлен',
				description: 'Мы попросим получателя подтвердить, что подарок дошел.',
			};
		}

		if (state === ReceiverUserSeasonState.Received) {
			return {
				...baseCardProps,
				header: user.pair_user.delivery_information.name,
				title: 'Подарок получен',
				description: 'Надеемся, мы вместе подарили кому-то новогоднее настроение!',
			};
		}

		// По-умолчанию и Initial
		const { shuffle } = stats.humanizedStats;

		return {
			...baseCardProps,
			header: 'Получатель',
			title: 'Твой получатель еще неизвестен',
			description: `${shuffle.title} пройдет ${shuffle.date}. Каждому будет назначен свой получатель.`,
		};
	}

	render() {
		const { store } = this.props;
		const { stats, tabs, user } = this;

		return (
			<div className="profile-view">
				<div className="profile-view__background" style={{ backgroundImage: `url("${BackgroundPattern}")` }} />

				<Header short store={store} />
				<div className="profile-view__content">
					<div className="profile-view__side-column">
						<div className="profile-view__side-column-item">
							<Schedule stats={stats} />
						</div>
						<div className="profile-view__side-column-item">
							<Stats stats={stats} />
						</div>
					</div>
					<div className="profile-view__main-column">
						<Tabs tabs={tabs} onTabClick={this.handleTabClick} />
						{ this.content }
					</div>
					<div className="profile-view__side-column">
						<SidebarCard {...this.currentUserSidebarCard} />
						{ user.pair_user && <SidebarCard {...this.receiverSidebarCard} /> }
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}

export default observer(ProfileView);
