import React from 'react';

import './PromoLink.scss';

const icons = {
	vk: 'fab fa-vk',
};

interface Props {
	icon: keyof typeof icons;
	text: string;
	href: string;
}

export class PromoLink extends React.Component<Props> {
	getIcon() {
		const { icon } = this.props;

		return icons[icon];
	}

	render() {
		const icon = this.getIcon();

		const { text, href } = this.props;

		return (
			<a className="promo-link" href={href}>
				<i className={icon} />
				<div className="promo-link__text">{text}</div>
			</a>
		);
	}
}
