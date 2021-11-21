// https://codemix.com/opaque-types-in-javascript
type Opaque<K, T> = T & { __TYPE__: K };

// TODO: use opaque type (modify functions that get config vars)
export type NavigationPath = Opaque<'NavigationPath', string>;

/**
 * Переходим по ссылке
 * @param path ссылка
 */
export function navigate(path: string) {
	window.location.href = path;
}
