import React from 'react';
import classNames from 'classnames';

import './StepperItem.scss';

export enum Mode {
	Regular,
	Current,
	Active,
	Next,
}

export interface IStep {
	title: string;
	date: string;
}

export interface Props extends IStep {
	mode: Mode;
}

export const StepperItem: React.FC<Props> = ({ title, date, mode }) => {
	const className = classNames('stepper-item', {
		'stepper-item_active': mode === Mode.Active,
		'stepper-item_current': mode === Mode.Current,
		'stepper-item_next': mode === Mode.Next,
	});

	return (
		<div className={className}>
			<div className="stepper-item__marker">
				<div className="stepper-item__marker-pointer-container">
					<div className="stepper-item__marker-pointer" />
				</div>
			</div>
			<div className="stepper-item__info">
				<div className="stepper-item__title">
					{title}
				</div>
				<div className="stepper-item__date">
					{date}
				</div>
			</div>
		</div>
	);
};
