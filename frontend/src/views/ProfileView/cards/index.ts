import { CardEntry } from '@/components/Card/Card';
import { getLeftCardLayout, IGetLeftCardLayoutParams } from '@/views/ProfileView/cards/left';
import { getRightCardLayout, IGetRightCardLayoutParams } from '@/views/ProfileView/cards/right';

export type IGetCardListEntriesParams = IGetLeftCardLayoutParams & IGetRightCardLayoutParams;

export const getCardListEntries = (params: IGetCardListEntriesParams): [CardEntry, CardEntry] => {
	const leftLayout = getLeftCardLayout(params);
	const rightLayout = getRightCardLayout(params);

	return [leftLayout, rightLayout];
};
