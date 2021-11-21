import React from 'react';

import './Blink.scss';

interface Props {
	to: string;
	blank?: boolean;
	children: React.ReactNode;
}

export const Blink: React.FC<Props> = (props) => {
	const { to, blank, children } = props;

	return (
		<>
			{blank ? (
				<a className="blink" href={to} target="_blank" rel="noopener noreferrer">
					{children}
				</a>
			) : (
				<a className="blink" href={to}>
					{children}
				</a>
			)}
		</>
	);
};
