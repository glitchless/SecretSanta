import React from 'react';

import { Card, CardEntry } from 'components/Card/Card';

import './CardList.scss';

interface Props {
	entries: CardEntry[];
}

export const CardList: React.FC<Props> = (props) => {
	const { entries } = props;

	return (
		<div className="card-list">
			{entries.map((entry, idx) => <Card key={idx} entry={entry} />)}
		</div>
	);
};
