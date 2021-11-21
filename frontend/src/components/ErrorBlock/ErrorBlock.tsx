import React from 'react';

import './ErrorBlock.scss';

interface Props {
	error: {
		message: string;
	}
}

export const ErrorBlock: React.FC<Props> = (props) => {
	const { error } = props;

	return (
		<div className="error-block">
			{error.message}
		</div>
	);
};
