import React from 'react';
import { Announcer, AnnouncerTypes } from '@/components/Announcer/Announcer';
import { Reminder } from '@/components/Reminder/Reminder';
import { reminderEntries } from '@/views/ProfileView/utils/reminder';
import { ISeasonDataInstance } from '@/models/SeasonData';
import { getStartTimeText } from '@/utils/dates';

import './SeasonInformation.scss';
import { observer } from 'mobx-react';

export interface Props {
	stats: ISeasonDataInstance;
}

export const SeasonInformation: React.FC<Props> = observer(({ stats }) => {
	const isSeasonEnded = Date.now() > Number(stats.end_date);
	const { isExpired: isSeasonExpired } = stats;
	const startTimeText = getStartTimeText(stats);

	const status = isSeasonExpired ? 'Событие началось. Время дарить подарки!' : `До старта осталось ${startTimeText}`;

	if (isSeasonEnded) {
		return <Announcer type={AnnouncerTypes.SeasonEnded} />;
	}

	return (
		<div className="season-information">
			<div className="season-information__status">
				{status}
			</div>
			{isSeasonExpired && (
				<div className="season-information__reminder">
					<Reminder entries={reminderEntries} />
				</div>
			)}
		</div>
	);
});
