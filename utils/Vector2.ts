
import { lerp } from "./Lerp";

/**
 * @typedef {{x: number, y: number}} Point2
 * An object which represents a 2D point.
 */


/**
 * A 2D vector.
 * @implements Point2
 */
export class Vector2 {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		/** @type {number} */
		this.x = x;
		/** @type {number} */
		this.y = y;
	}

	/**
	 * @returns {Vector2}
	 */
	clone() {
		return new Vector2(this.x, this.y);
	}

	/**
	 * @param {Point2} p
	 */
	assign(p: { x: number; y: number; }) {
		this.x = p.x;
		this.y = p.y;
	}

	/**
	 * @param {Vector2} point
	 * @returns {boolean}
	 */
	equals(point: this) {
		return (point === this) || (this.x === point.x && this.y === point.y);
	}

	/**
	 * The length of the vector.
	 * @returns {number}
	 */
	size() {
		return size(this);
	}

	/**
	 * The length of the vector squared.
	 * @returns {number}
	 */
	size2() {
		return size2(this);
	}

	/**
	 * @param {number} k
	 * @returns {Vector2} A new vectoring.
	 */
	times(k: number) {
		return new Vector2(this.x * k, this.y * k);
	}

	/**
	 * @param {number} k
	 * @returns {Vector2} A new vectoring.
	 */
	divide(k: number) {
		return new Vector2(this.x / k, this.y / k);
	}

	/**
	 * @param {Point2} p
	 * @returns {Vector2} A new vectoring.
	 */
	add(p: { x: number; y: number; }) {
		return new Vector2(this.x + p.x, this.y + p.y);
	}

	/**
	 * @param {Point2} p
	 * @returns {Vector2} A new vectoring.
	 */
	sub(p: { x: number; y: number; }) {
		return new Vector2(this.x - p.x, this.y - p.y);
	}
	
	/**
	 * Compute the dot product.
	 * @param {Point2} p
	 * @returns {number}
	 */
	dot(p: any) {
		return dot(this, p);
	}

	/**
	 * Compute this vector's unit vector.
	 * If this is the zero vector then returns another zero vector.
	 * @returns {Vector2}
	 */
	unit() {
		return this.scale(1);
	}

	/**
	 * Scales this vector to the given size.
	 * If this is the zero vector then returns another zero vector.
	 * @param {number} size
	 * @returns {Vector2}
	 */
	scale(size: number) {
		let currentSize = this.size();
		if (currentSize === 0) {
			return Vector2.zero();
		} else {
			return this.times(size / currentSize);
		}
	}

	/**
	 * @param {Point2} p The vector to project onto.
	 * @returns {number}
	 */
	scalarProjection(p: any) {
		return dot(this, p) / size(p);
	}

	/**
	 * @param {Point2} p The vector to project onto.
	 * @returns {Vector2}
	 */
	vectorProjection(p: { x: number; y: number; }) {
		// ((this * p) / (p * p)) * p
		let k = (dot(this, p) / size2(p));
		return new Vector2(p.x*k, p.y*k);
	}

	/**
	 * Get a vector perpendicular to this vector.
	 * @returns {Vector2}
	 */
	perp() {
		return new Vector2(-this.y, this.x);
	}

	/**
	 * @param {number} radians
	 * @returns {Vector2}
	 */
	rotate(radians: number) {
		const cos = Math.cos(radians);
		const sin = Math.sin(radians);
		return new Vector2(
			this.x*cos - this.y*sin,
			this.x*sin + this.y*cos
		);
	}

	/**
	 * @param {Point2} p
	 * @returns {number} Radians
	 */
	angleBetween(p: any) {
		return Math.acos(dot(this, p) / (size(p) * this.size()));
	}

	/**
	 * Create a zero length vector.
	 * @returns {Vector2}
	 */
	static zero() {
		return new Vector2(0, 0);
	}

	/**
	 * @param {Point2} point
	 * @returns {Vector2}
	 */
	static fromPoint(point: { x: number; y: number; }) {
		return new Vector2(point.x, point.y);
	}

	/**
	 * @param {MouseEvent} event
	 * @returns {Vector2}
	 */
	static fromMouseEvent(event: { clientX: number; clientY: number; }) {
		return new Vector2(event.clientX, event.clientY);
	}

	/**
	 * @param {Touch} touch
	 * @returns {Vector2}
	 */
	static fromTouch(touch: { clientX: number; clientY: number; }) {
		return new Vector2(touch.clientX, touch.clientY);
	}

	/**
	 * @param {number} t
	 * @param {Point2} p1
	 * @param {Point2} p2
	 */
	static lerp(t: number, p1: { x: number; y: number; }, p2: { x: number; y: number; }) {
		return new Vector2(lerp(t, p1.x, p2.x), lerp(t, p1.y, p2.y));
	}
}

/**
 * @param {Point2} p
 * @returns {number}
 */
function size2(p: any) {
	return p.x*p.x + p.y*p.y
}

/**
 * @param {Point2} p
 * @returns {number}
 */
function size(p: any) {
	return Math.sqrt(size2(p));
}

/**
 * @param {Point2} p1
 * @param {Point2} p2
 * @returns {number}
 */
function dot(p1: any, p2: { x: any; y: any; }) {
	return p1.x*p2.x + p1.y*p2.y;
}

// /**
//  * @param {Point2} p1
//  * @param {Point2} p2
//  * @returns {Vector2}
//  */
// function add(p1, p2) {
// 	return new Vector2(p1.x + p2.x, p1.y + p2.y);
// }
//
// /**
//  * @param {Point2} p1
//  * @param {Point2} p2
//  * @returns {Vector2}
//  */
// function sub(p1, p2) {
// 	return new Vector2(p1.x - p2.x, p1.y - p2.y);
// }
