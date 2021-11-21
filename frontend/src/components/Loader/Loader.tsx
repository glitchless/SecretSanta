import React from 'react';

import classNames from 'classnames';

import './Loader.scss';

export type LoaderType = 'regular' | 'small';

export interface Props {
	type?: LoaderType;
}

export function Loader(props: Props) {
	const { type } = props;

	return (
		<div className="loader">
			<div
				className={
					classNames('loader__spinner', {
						[`loader__spinner_${type}`]: type,
					})
				}
			/>
		</div>
	);
}
