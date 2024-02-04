import { ifNull } from "./Null";
import { Vector2 } from "./Vector2";

/** @typedef {{start: Vector2, current: Vector2, diff: Vector2, delta: Vector2, key: {ctrl: boolean, shift: boolean, meta: boolean, alt: boolean}, user: {}, event: PointerEvent|TouchEvent|MouseEvent}} DragHandlerData: any; */

/**
 * Create a "click and drag" handler for an element. The handler will call the three callbacks where appropriate.
 * @param {Element|Node} element
 * @param {object} [options] 
 * @param {(data: DragHandlerData) => (void|boolean)} [options.start]
 * @param {(data: DragHandlerData) => (void|boolean)} [options.move]
 * @param {(data: DragHandlerData) => (void|boolean)} [options.end]
 * @param {boolean} [options.alwaysMove=true] - If true, will call move when start and end are called.
 * @returns {function} Can be called to remove the handler.
 */
export function draggable(element: HTMLDivElement, options: {
     start: any; move: any; end: any; alwaysMove?: any; 
}) {
	let start = options.start;
	let move = options.move;
	let end = options.end;
	let alwaysMove = ifNull(options.alwaysMove, false);

	type DragHandlerData = {
		start: Vector2;
		current: Vector2;
		diff: Vector2;
		delta: Vector2;
		key: { ctrl: boolean, shift: boolean, meta: boolean, alt: boolean }
		user: {};
		event: PointerEvent | TouchEvent | MouseEvent;
	} | null

	let data: DragHandlerData = null;

	let initialTouch: { identifier: any; clientX: any; clientY: any; } | null = null;
	/** @param {TouchEvent} touchEvent */
	function getSameTouch(touchEvent: TouchEvent) {
		for (let i = 0, n = touchEvent.changedTouches.length; i < n; i++) {
			let otherTouch = touchEvent.changedTouches[i];
			if (otherTouch.identifier === initialTouch?.identifier) {
				return otherTouch;
			}
		}
	}

	// updating
	function update(x: number, y: number, event: MouseEvent | TouchEvent | PointerEvent) {
		if (data) {
			data.delta = new Vector2(x - data.current.x, y - data.current.y);
			data.diff = new Vector2(x - data.start.x, y - data.start.y);
			data.current.x = x;
			data.current.y = y;

			if (event != null) {
				data.key.alt = event.altKey;
				data.key.ctrl = event.ctrlKey;
				data.key.meta = event.metaKey;
				data.key.shift = event.shiftKey;
			}
		}
	}

	// start
	/** @param {MouseEvent} event */
	function onMouseDown(event: { button: number; clientX: number; clientY: number; ctrlKey: any; shiftKey: any; metaKey: any; altKey: any; preventDefault: () => void; stopPropagation: () => void; }) {
		
		if (event.button === 0) {
			// must be left click
			let result = startHandler(event.clientX, event.clientY, event.ctrlKey, event.shiftKey, event.metaKey, event.altKey, event);


			if (result === true) {
				// dont stop propagation and dont prevent default
			} else {
				event.preventDefault();
				event.stopPropagation();
				window.addEventListener("mousemove", mouseMoveHandler);
				window.addEventListener("mouseup", mouseEndHandler);
			}

		}
	}
	/** @param {TouchEvent} event */
	function onTouchStart(event: TouchEvent) {
		if (initialTouch == null) {
			// only allow one touch
			event.preventDefault();
			event.stopPropagation();

			initialTouch = event.changedTouches[0];
			startHandler(initialTouch.clientX, initialTouch.clientY, event.ctrlKey, event.shiftKey, event.metaKey, event.altKey, event);

			window.addEventListener("touchmove", touchMoveHandler, { passive: false });
			window.addEventListener("touchend", touchEndHandler, { passive: false });
			window.addEventListener("touchcancel", touchEndHandler, { passive: false });
		}
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {boolean} ctrl
	 * @param {boolean} shift
	 * @param {boolean} meta
	 * @param {boolean} alt
	 * @param {PointerEvent|MouseEvent|TouchEvent} event
	 */
	function startHandler(x: number, y: number, ctrl: any, shift: any, meta: any, alt: any, event: any) {
		data = {
			start: new Vector2(x, y),
			current: new Vector2(x, y),
			diff: Vector2.zero(),
			delta: Vector2.zero(),
			key: { ctrl, shift, meta, alt },
			user: {},
			event: event,
		};
		/** @type {boolean|void} */
		let callbackResult = false;
		if (start != null) {
			callbackResult = start(data);
		}
		if (alwaysMove) {
			moveHandler();
		}

		return callbackResult;
	}

	// move
	/** @param {MouseEvent} event */
	function mouseMoveHandler(event: MouseEvent) {
		update(event.clientX, event.clientY, event);

		let result = moveHandler();
		if (result) {

		} else {
			event.preventDefault();
			event.stopPropagation();
		}
	}
	/** @param {TouchEvent} event */
	function touchMoveHandler(event: TouchEvent) {
		event.preventDefault();
		event.stopPropagation();

		let moveTouch = getSameTouch(event);
		if (moveTouch) {
			update(moveTouch.clientX, moveTouch.clientY, event);
		}

		moveHandler();
	}

	function moveHandler() {
		/** @type {boolean|void} */
		let callBackResult = false;
		if (move != null) {
			callBackResult = move(data);
		}

		return callBackResult;
	}

	//end
	/** @param {MouseEvent} event */
	function mouseEndHandler(event: MouseEvent) {
		window.removeEventListener("mousemove", mouseMoveHandler);
		window.removeEventListener("mouseup", mouseEndHandler);
		update(event.clientX, event.clientY, event);
		let result = endHandler();
		if (result === true) {

		} else {
			event.preventDefault();
			event.stopPropagation();
		}
	}
	/** @param {TouchEvent} event */
	function touchEndHandler(event: TouchEvent) {
		window.removeEventListener("touchmove", touchMoveHandler);
		window.removeEventListener("touchend", touchEndHandler);
		window.removeEventListener("touchcancel", touchEndHandler);
		let finalTouch = getSameTouch(event);
		initialTouch = null;
		if (finalTouch) {
			update(finalTouch.clientX, finalTouch.clientY, event);
		}

		endHandler();
	}
	function endHandler() {
		/** @type {boolean|void} */
		let callbackResult = false;
		if (alwaysMove) {
			moveHandler();
		}
		if (end != null) {
			callbackResult = end(data);
		}
		data = null;

		return callbackResult;
	}

	// add initial start listeners
	element.addEventListener("mousedown", onMouseDown);
	// element.onmousedown = function () { onMouseDown };
	element.addEventListener("touchstart", onTouchStart, { passive: false });
	// element.ontouchstart = function () { onTouchStart };

	// remover
	return function () {
		element.removeEventListener("mousedown", onMouseDown);
		element.removeEventListener("touchstart", onTouchStart);
	};
}
