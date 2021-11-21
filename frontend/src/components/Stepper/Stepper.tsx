import React, { useMemo } from 'react';

import { StepperItem, IStep, Mode as StepMode } from '@/components/StepperItem/StepperItem';

import './Stepper.scss';

export const getStepMode = (stepIndex: number, currentStepIndex: number): StepMode => {
	if (stepIndex < currentStepIndex) {
		return StepMode.Active;
	}

	if (stepIndex === currentStepIndex) {
		return StepMode.Current;
	}

	if (stepIndex === currentStepIndex + 1) {
		return StepMode.Next;
	}

	return StepMode.Regular;
};

export interface Props {
	steps: IStep[];
	currentStepIndex: number;
}

export const Stepper: React.FC<Props> = ({ steps, currentStepIndex }) => (
	<div className="stepper">
		{steps.map(({ title, date }, idx) => (
			<StepperItem key={idx} title={title} date={date} mode={getStepMode(idx, currentStepIndex)} />
		))}
	</div>
);
