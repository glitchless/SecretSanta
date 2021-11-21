import { internalFlag } from '@/store/features';

interface GetParams {
	headers?: Record<string, string>;
	external?: boolean;
}

interface PostParams {
	payload?: Record<string, any>;
	headers?: Record<string, string>;
	external?: boolean;
}

interface BackendResponse {
	code: number;
	message: any;
}

function getBackendUrl(url: string) {
	return `${internalFlag('backendUrl')}${url}`;
}

function post(url: string, params: PostParams = {}): Promise<BackendResponse> {
	const {
		payload: data,
		headers = {},
		external = false,
	} = params;

	const apiUrl = external ? url : getBackendUrl(url);

	headers['Content-Type'] = 'application/json';

	return fetch(apiUrl, {
		method: 'POST',
		credentials: 'include',
		mode: 'cors',
		headers,
		body: JSON.stringify({ ...data }),
	}).then((response) => response.json());
}

function get(url: string, params: GetParams = {}): Promise<BackendResponse> {
	const { headers = {}, external = false } = params; // TODO: query params

	const apiUrl = external ? url : getBackendUrl(url);
	// const CSRFToken = this.getCSRFToken();

	return fetch(apiUrl, {
		method: 'GET',
		credentials: 'include',
		mode: 'cors',
		headers,
	}).then((response) => response.json());
}

export default class Carrier {
	/**
	 * @deprecated
	 */
	static get = get;

	/**
	 * @deprecated
	 */
	static post = post;

	static postWithValidation(...args: Parameters<typeof post>) {
		return Carrier.post(...args).then((response) => {
			if (response.code !== 200) {
				return Promise.reject(response);
			}

			return response;
		});
	}

	static getWithValidation(...args: Parameters<typeof get>) {
		return Carrier.get(...args).then((response) => {
			if (response.code !== 200) {
				return Promise.reject(response);
			}

			return response;
		});
	}
}
