import React from 'react';

import { ChatInstance } from 'models/Chat';

import './Chat.scss';
import { observer } from 'mobx-react';
import { Input } from '@/components/Input/Input';
import { ChatMessage, From } from '@/components/ChatMessage/ChatMessage';
import { IUserInstance } from '@/models/UserData';
import { ChatMessageGreetings } from '@/components/ChatMessageGreetings/ChatMessageGreetings';
import { onPatch } from 'mobx-state-tree';

export enum Mode {
	withSender,
	withReceiver,
}

interface Props {
	model: ChatInstance;
	user: IUserInstance;
	mode?: Mode;
}

interface State {
	message: string;
}

class ChatComponent extends React.Component<Props, State> {
	state: State = {
		message: '',
	};

	containerRef: React.RefObject<HTMLDivElement> = React.createRef();

	disposer?: () => void;

	scrollScheduled = false;

	componentDidMount() {
		const { model } = this.props;

		this.disposer = onPatch(model.messages, ({ op }) => {
			if (op === 'add') {
				this.scheduleScrollToEnd();
			}
		});

		model.init();
		this.scheduleScrollToEnd();
	}

	scheduleScrollToEnd() {
		this.scrollScheduled = true;
	}

	componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
		if (this.scrollScheduled) {
			this.scrollToEnd();
			this.scrollScheduled = false;
		}
	}

	componentWillUnmount() {
		const { model } = this.props;

		model.destroy();

		this.disposer?.();
	}

	// TODO: При загрузке сообщений, при отправке новых, при получении новых
	scrollToEnd = (isSmooth?: boolean) => {
		const { current: container } = this.containerRef;

		if (container) {
			const { scrollHeight: top } = container;

			if (isSmooth) {
				container.scrollTo({
					top,
					behavior: 'smooth',
				});
			} else {
				container.scrollTop = top;
			}
		}
	};

	sendMessage = () => {
		const { model } = this.props;
		const { message } = this.state;

		this.setState({ message: '' }, () => {
			model.sendMessage(message);
		});
	};

	handleKeyDown = ({ key }: React.KeyboardEvent) => {
		if (key === 'Enter') {
			this.sendMessage();
		}
	};

	handleSendClick = () => {
		this.sendMessage();
	};

	handleMessageChange = (event: any) => {
		const { value: message } = event.target;

		this.setState({ message });
	};

	get messageGreetings() {
		const { mode, user } = this.props;

		if (mode === Mode.withReceiver) {
			const { index, address, comment } = user.pair_user.delivery_information;

			return <ChatMessageGreetings from={From.Companion} index={index} address={address} comment={comment} />;
		}

		if (mode === Mode.withSender) {
			const { index, address, comment } = user.delivery_information;

			return <ChatMessageGreetings from={From.Current} index={index} address={address} comment={comment} />;
		}

		return null;
	}

	render() {
		const { model } = this.props;
		const { message } = this.state;

		return (
			<div className="chat">
				<div className="chat__message-list" ref={this.containerRef}>
					{this.messageGreetings}
					{ model.messages.map(({ id, text, from }) => <ChatMessage key={id} text={text} from={from} />) }
				</div>
				<div className="chat__controls">
					<div className="chat__message-input">
						<Input
							placeholder="Напишите сообщение..."
							value={message}
							name="message"
							maxlength={256}
							grow
							onChange={this.handleMessageChange}
							onKeyDown={this.handleKeyDown}
						/>
					</div>
					<div className="chat__send-button" onClick={this.handleSendClick}>
						<i className="fas fa-paper-plane" />
					</div>
				</div>
			</div>
		);
	}
}

export const Chat = observer(ChatComponent);
