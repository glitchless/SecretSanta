import React from 'react';
import { TabsItem, ITab } from '@/components/TabsItem/TabsItem';

import './Tabs.scss';

export interface Props {
	tabs: ITab[];
	onTabClick: (tabIndex: number) => void;
}

export const Tabs: React.FC<Props> = ({ tabs, onTabClick }) => {
	if (tabs.filter(({ isHidden }) => !isHidden).length <= 1) {
		return null;
	}

	return (
		<div className="tabs">
			{ tabs.map(({ title, isActive, isHidden }, idx) => (
				<TabsItem
					key={idx}
					title={title}
					isActive={isActive}
					isHidden={isHidden}
					onClick={() => onTabClick(idx)}
				/>
			)) }
		</div>
	);
};
