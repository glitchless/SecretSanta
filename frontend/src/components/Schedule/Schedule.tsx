import React, { useMemo } from 'react';

import { ISeasonDataInstance } from '@/models/SeasonData';
import { Stepper } from '@/components/Stepper/Stepper';
import { IStep } from '@/components/StepperItem/StepperItem';

import './Schedule.scss';

export interface Props {
	stats: ISeasonDataInstance;
}

export const Schedule: React.FC<Props> = ({ stats }) => {
	const currentStepIndex = useMemo(() => {
		// Костыли, велосипеды. Переделать нормально!
		const currentDate = Date.now();

		if (stats.isExpired) {
			if (Number(stats.end_date) < currentDate) {
				return 2;
			}

			if (Number(stats.shuffle_date) < currentDate) {
				return 1;
			}
		}

		return 0;
	}, [
		stats.start_date,
		stats.shuffle_date,
		stats.end_date,
	]);

	const { humanizedStats } = stats;
	const steps: IStep[] = [
		humanizedStats.start,
		humanizedStats.shuffle,
		humanizedStats.end,
	];

	return (
		<div className="schedule">
			<div className="schedule__title">
				Расписание сезона
			</div>
			<div className="schedule__stepper">
				<Stepper steps={steps} currentStepIndex={currentStepIndex} />
			</div>
		</div>
	);
};
