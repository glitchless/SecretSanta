import React from 'react';

import HeaderIllustration from '@/assets/images/illustration-header.svg';

import './HeaderLogoLarge.scss';

interface Props {
	title: string;
	year: string | number;
}

export const HeaderLogoLarge: React.FC<Props> = ({ title, year }) => (
	<div className="header-logo-large">
		<div className="header-logo-large__title">
			{title.split('\\n').join('\n')}
		</div>
		<div className="header-logo-large__year">
			{year}
		</div>
		<img className="header__illustration" alt={title} src={HeaderIllustration} />
	</div>
);
