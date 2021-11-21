import React from 'react';

import { StatusBarEntry, StatusBarEntryObject } from 'components/StatusBarEntry/StatusBarEntry';

import './StatusBar.scss';

interface Props {
	entries: {
		counters: StatusBarEntryObject[],
		roadmap: StatusBarEntryObject[]
	}
}

export const StatusBar: React.FC<Props> = (props) => {
	const { entries } = props;

	return (
		<div className="status-bar">
			<div className="status-bar__counters">
				{entries.counters.map((entry, idx) => <StatusBarEntry key={idx} entry={entry} />)}
			</div>
			<div className="status-bar__roadmap">
				{entries.roadmap.map((entry, idx) => <StatusBarEntry key={idx} entry={entry} />)}
			</div>
		</div>
	);
};
