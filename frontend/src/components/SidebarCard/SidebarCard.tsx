import React from 'react';

import './SidebarCard.scss';
import classNames from 'classnames';

export interface SidebarCardAction {
	onClick: (event?: React.MouseEvent) => void;
	text: string;
}

export interface Props {
	image: string;
	header?: string;
	title?: string;
	description?: string;
	alternative?: boolean;
	action?: SidebarCardAction;
}

export const SidebarCard: React.FC<Props> = ({
	header,
	image,
	title,
	description,
	action,
	alternative,
}) => (
	<div className="sidebar-card">
		{ header && <div className="sidebar-card__header">{header}</div> }
		<div className={classNames({ 'sidebar-card__image': true, 'sidebar-card__image_alt': alternative })}>
			<img src={image} alt={header || title} />
		</div>
		{ title && <div className="sidebar-card__title">{title}</div> }
		{ description && <div className="sidebar-card__description">{description}</div> }
		{ action && (
			<div className="sidebar-card__action" onClick={action.onClick}>
				{action.text}
			</div>
		) }
	</div>
);
