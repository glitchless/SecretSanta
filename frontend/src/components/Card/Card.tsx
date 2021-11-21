import React from 'react';

import './Card.scss';

export interface CardEntry {
	title: string;
	icon?: string | null;
	subtitle?: string;
	description: (string | JSX.Element)[];
	markup?: JSX.Element | null;
}

interface Props {
	entry: CardEntry;
}

export const Card: React.FC<Props> = (props) => {
	const { entry } = props;

	return (
		<>
			{entry && (
				<div className="card">
					<div className="card__title">{entry.title}</div>
					<div className="card__content">
						<>
							{entry.icon && (
								<div className="card__icon-container">
									<img className="card__icon" alt={entry.title} src={entry.icon} />
								</div>
							)}
							{entry.subtitle && (
								<div className="card__subtitle">
									<div className="card__subtitle-text">{entry.subtitle}</div>
								</div>
							)}
							{entry.description && entry.description.map((description, idx: any) => (
								<div key={idx} className="card__description">
									{description}
								</div>
							))}
							{entry.markup}
						</>
					</div>
				</div>
			)}
		</>
	);
};
