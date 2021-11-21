import type data from '@/config/base.json';

type Config = typeof data;
type Messages = Config['messages'];

let messageData: Messages | null = null;

export function initMessages(newMessages: Config['messages']) {
	messageData = newMessages;
}

class ConfigWrapper<Section extends keyof Messages> {
	private section: Section;

	constructor(section: Section) {
		this.section = section;
	}

	get<Key extends keyof Messages[Section]>(key: Key): Messages[Section][Key] {
		if (messageData === null) {
			throw new Error('Messages were not initialized');
		}

		return messageData[this.section][key];
	}
}

export function messages<T extends keyof Config['messages']>(key: T) {
	return new ConfigWrapper(key);
}
