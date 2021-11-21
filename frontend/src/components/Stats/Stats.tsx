import React from 'react';

import { ISeasonDataInstance } from '@/models/SeasonData';
import { StatsItem } from '@/components/StatsItem/StatsItem';

import './Stats.scss';

export interface Props {
	stats: ISeasonDataInstance
}

export const Stats: React.FC<Props> = ({ stats }) => (
	<div className="stats">
		<StatsItem title="Участники" count={stats.users.active} iconId="fas fa-users" />
		<StatsItem title="Отправили" count={stats.users.sent} iconId="fas fa-mail-bulk" />
		<StatsItem title="Получили" count={stats.users.received} iconId="fas fa-gift" />
	</div>
);
