import React from 'react';

import './StatsItem.scss';

const formatCount = (number: number) => number.toString().padStart(3, '0');

export interface Props {
	title: string;
	count: number;
	iconId: string;
}

export const StatsItem: React.FC<Props> = ({ title, count, iconId }) => (
	<div className="stats-item">
		<div className="stats-item__icon">
			<i className={iconId} />
		</div>
		<div className="stats-item__info">
			<div className="stats-item__title">
				{title}
			</div>
			<div className="stats-item__count">
				{formatCount(count)}
			</div>
		</div>
	</div>
);
