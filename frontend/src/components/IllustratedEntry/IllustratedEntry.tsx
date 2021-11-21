import React from 'react';

import './IllustratedEntry.scss';

interface Entry {
	title: string;
	icon: string;
	description: string;
}

interface Props {
	entry: Entry;
}

export const IllustratedEntry: React.FC<Props> = (props) => {
	const { entry } = props;

	return (
		<div className="illustrated-entry">
			<div className="illustrated-entry__icon-container">
				<img className="illustrated-entry__icon" alt={entry.title} src={entry.icon} />
			</div>
			<div className="illustrated-entry__info">
				<div className="illustrated-entry__title">{entry.title}</div>
				<div className="illustrated-entry__description">{entry.description}</div>
			</div>
		</div>
	);
};
