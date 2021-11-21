type QueryParams = Record<string, string>;

export const getQueryParams = (location: Location): QueryParams => {
	const { search } = location;
	const params = search.slice(1).split('&');

	return params.reduce((acc: QueryParams, pair: string) => {
		const [key, value] = pair.split('=');

		acc[key] = value;

		return acc;
	}, {});
};

export const getDebugParam = (param: string): string | null => {
	const queryParams = getQueryParams(window.location);
	const { debug } = queryParams;

	if (!debug) {
		return null;
	}

	const debugParams: Record<string, string> = debug.split('_').reduce((acc, pair) => {
		const [key, value] = pair.split(':');

		return { ...acc, [key]: value };
	}, {});

	return debugParams[param];
};
