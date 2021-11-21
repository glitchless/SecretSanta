import React from 'react';
import classNames from 'classnames';

import IllustratedEntryWithHeadphonesIcon from '@/assets/images/illustrated-entry-with-headphones.svg';
import IllustratedEntryQuestionIcon from '@/assets/images/illustrated-entry-question.svg';

import './Summary.scss';

export enum Mode {
	Current,
	Receiver,
}

const getImage = (mode: Mode) => {
	if (mode === Mode.Current) {
		return IllustratedEntryWithHeadphonesIcon;
	}

	if (mode === Mode.Receiver) {
		return IllustratedEntryQuestionIcon;
	}

	return null;
};

export interface Props {
	title: string;
	url: string;
	index: string;
	address: string;
	comment: string;
	mode: Mode,
}

export const Summary: React.FC<Props> = ({
	title,
	url,
	index,
	address,
	comment,
	mode,
}) => {
	const className = classNames('summary', {
		summary_current: mode === Mode.Current,
		summary_receiver: mode === Mode.Receiver,
	});

	const image = getImage(mode);

	return (
		<div className={className}>
			<div className="summary__title">
				<a href={url}>{ title }</a>
			</div>
			<div className="summary__content">
				{ image && (
					<div className="summary__image">
						<img src={image} alt={title} />
					</div>
				) }
				<div className="summary__plate">
					<div className="summary__address">
						Адрес: {index}, {address}
					</div>
					<div className="summary__comment">
						{comment}
					</div>
				</div>
			</div>
		</div>
	);
};
