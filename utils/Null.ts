
/**
 * Provide a default value for a possible null value.
 * @param {?T} x
 * @param {T} v
 * @returns {T}
 * @template T
 */
export function ifn(x: null, v: boolean) {
	return x == null ? v : x;
}

/**
 * Transform a non-null value.
 * If `x` is null then null is returned.
 * @param {?T} x
 * @param {(x: T) => S} f
 * @returns {?S}
 * @template T
 * @template S
 */
export function inn(x: null, f: (arg0: any) => any) {
	return x == null ? null : f(x);
}

export {
	ifn as ifNull,
	inn as ifNotNull,
}
