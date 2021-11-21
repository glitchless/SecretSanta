import React from 'react';
import { ChatMessage, From } from '@/components/ChatMessage/ChatMessage';

export interface Props {
	from: From;
	index: string;
	address: string;
	comment: string;
}

export const ChatMessageGreetings: React.FC<Props> = ({
	from,
	index,
	address,
	comment,
}) => (
	<ChatMessage from={from}>
		<div>
			<div>
				<b>Адрес: {index}, {address}</b>
			</div>
			<div>
				{comment}
			</div>
		</div>
	</ChatMessage>
);
