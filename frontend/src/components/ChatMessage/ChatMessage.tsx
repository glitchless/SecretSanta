import React from 'react';
import classNames from 'classnames';

import './ChatMessage.scss';

export enum From {
	Current = 'current',
	Companion = 'companion',
}

export interface Props {
	text?: string;
	from: string; // TODO: Strong types
}

export const ChatMessage: React.FC<Props> = ({ children, text, from }) => {
	const className = classNames('chat-message', {
		'chat-message_from-current': from === From.Current,
		'chat-message_from-companion': from === From.Companion,
	});

	return (
		<div className={className}>
			{children || text}
		</div>
	);
};
