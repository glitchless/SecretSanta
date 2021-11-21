import React from 'react';

import './StatusBarEntry.scss';

export interface StatusBarEntryObject {
	topText: string;
	bottomText: string;
}
export interface StatusBarEntryProps {
	entry: StatusBarEntryObject;
}

export const StatusBarEntry: React.FC<StatusBarEntryProps> = (props) => {
	const { entry } = props;

	return (
		<div className="status-bar-entry">
			<div className="status-bar-entry__top">{entry.topText}</div>
			<div className="status-bar-entry__bottom">{entry.bottomText}</div>
		</div>
	);
};
