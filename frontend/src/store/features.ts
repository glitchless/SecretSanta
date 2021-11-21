import type data from '@/config/base.json';

type OptionalFeatures = Partial<typeof data['optionalFeatures']>;
type InternalFlagsFromJSON = typeof data['internal'];

export interface OauthProvider {
	externalUrl: string;
	name: string;
}

export interface InternalFlags extends InternalFlagsFromJSON {
	oauth: InternalFlagsFromJSON['oauth'] & {
		providers: OauthProvider[];
	}
}

let featureData: OptionalFeatures = {};
let internalFlagsData: InternalFlags | null = null;

const initCallbacks: InitCallback[] = [];

type InitCallback = (arg: Parameters<typeof initFeatures>[0]) => void;

export function initFeatures(config: {optionalFeatures: OptionalFeatures, internal: InternalFlags}) {
	const { optionalFeatures, internal } = config;

	featureData = optionalFeatures;
	internalFlagsData = internal;

	initCallbacks.forEach((initCallback) => initCallback(config));
}

export function feature<T extends keyof OptionalFeatures>(key: T): OptionalFeatures[T] {
	return featureData[key];
}

export function internalFlag<T extends keyof InternalFlags>(key: T): InternalFlags[T] {
	if (!internalFlagsData) {
		throw new Error(`Internal flags were not initialized. Could not get key "${key}"`);
	}

	return internalFlagsData[key];
}

export function onInit(callback: InitCallback) {
	initCallbacks.push(callback);
}
