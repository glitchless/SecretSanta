import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import './TabsItem.scss';

export interface ITab {
	title: string;
	isActive?: boolean;
	isHidden?: boolean;
}

export interface Props extends ITab {
	onClick: () => void;
}

export const TabsItem: React.FC<Props> = ({
	title,
	isActive,
	isHidden,
	onClick,
}) => {
	if (isHidden) {
		return null;
	}

	const className = classNames('tabs-item', {
		'tabs-item_active': isActive,
	});

	return (
		<div className={className} onClick={onClick}>
			{title}
		</div>
	);
};
