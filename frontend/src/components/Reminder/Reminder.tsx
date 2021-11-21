import React from 'react';

import './Reminder.scss';

interface Props {
	entries: string[];
}

export const Reminder: React.FC<Props> = (props) => {
	const { entries } = props;

	if (!entries) {
		return null;
	}

	return (
		<div className="reminder">
			<div className="reminder__title">Памятка «Тайного Санты»</div>
			<div className="reminder__entry-list">
				{entries.map((entry, idx) => (
					<div key={idx} className="reminder__entry">
						{idx + 1}. {entry}
					</div>
				))}
			</div>
		</div>
	);
};
