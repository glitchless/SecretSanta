import React from 'react';

import { IllustratedEntry } from 'components/IllustratedEntry/IllustratedEntry';

import './IllustratedEntryList.scss';

interface Entry {
	title: string;
	icon: string;
	description: string;
}

interface Props {
	entries: Entry[];
}

export const IllustratedEntryList: React.FC<Props> = (props) => {
	const { entries } = props;

	return (
		<div className="illustrated-entry-list">
			{entries.map((entry, idx) => <IllustratedEntry key={idx} entry={entry} />)}
		</div>
	);
};
