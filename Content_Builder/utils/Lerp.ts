
/**
 * @param {number} t
 * @param {number} start
 * @param {number} end
 * @returns {number} value
 */
export function lerp(t: number, start: number, end: number) {
	return start + (end - start) * t;
}
