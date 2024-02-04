import { draggable } from "./Drag";

export function draggableEx(el: HTMLDivElement, onstart: { (data: any): { move: (data: any) => void; end: (data: any) => void; alwaysMove: boolean; }; (arg0: any): any; }) {
    let onMove: ((arg0: any) => void) | null = null;
    let onEnd: ((arg0: any) => void) | null = null;
    let alwaysMove = false;

    return draggable(el, {
        start: (data: any) => {
            const result = onstart(data);

            if (result != null) {
                onMove = result.move;
                onEnd = result.end;
                alwaysMove = result.alwaysMove;
                if (alwaysMove && onMove != null) {
                    onMove(data);
                }
            }
        },

        move: (data: any) => {
            if (onMove != null) {
                onMove(data);
            }
        },

        end: (data: any) => {
            if (alwaysMove && onMove != null) {
                onMove(data);
            }
            if (onEnd != null) {
                onEnd(data);
            }
            onEnd = null;
            onMove = null;
            alwaysMove = false;
        },
    });
}