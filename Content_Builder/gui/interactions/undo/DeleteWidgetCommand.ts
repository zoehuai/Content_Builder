import { Outline } from "../../outline/Outline";
import { DraggableSortedOrder } from "../DraggableSortedOrder";
import { Command } from "./Command";

/**
 * This class implemented deleting and undo deleting commands.
 */
export class DeleteWidgetCommand extends Command {
    previewEl: HTMLElement;
    outlineEl: HTMLElement;
    previewIdx: number;
    outlineIdx: number;
    previewElParent: HTMLElement;
    childrenIdx!: number;
    additionalPwEl?: HTMLElement;
    additionalOutlineEl?: HTMLElement;

    // additional els is the index of the outline wrapper that also should be add on when delete the last widget in this container
    constructor(previewEl: HTMLElement, outlineEl: HTMLElement, previewIdx: number, outlineIdx: number, previewElParent: HTMLElement, childrenIdx: number, additionalPwEl?: HTMLElement, additionalOutlineEl?: HTMLElement) {
        super();
        this.previewEl = previewEl;
        this.outlineEl = outlineEl;
        this.previewIdx = previewIdx;
        this.outlineIdx = outlineIdx;
        this.previewElParent = previewElParent;
        this.childrenIdx = childrenIdx;
        this.additionalPwEl = additionalPwEl;
        this.additionalOutlineEl = additionalOutlineEl;
    }

    execute() {

    }

    undo() {

        // create new block

        // need to add back two elements if additional idx exists (including the deleted horizontal or vertical container)
        if (this.additionalPwEl) {

            console.log("ad Idx not null");

            this.previewElParent.insertBefore(this.previewEl, this.previewElParent.children[this.childrenIdx]);

            DraggableSortedOrder.getInstance().existPwWidgets.splice(this.previewIdx, 0, this.previewEl);

            Outline.getInstance().el().insertBefore(this.outlineEl, DraggableSortedOrder.getInstance().existOutline[this.outlineIdx]);

            DraggableSortedOrder.getInstance().existOutline.splice(this.outlineIdx, 0, this.outlineEl);

            this.previewElParent.insertBefore(this.additionalPwEl, this.previewEl);

            DraggableSortedOrder.getInstance().existPwWidgets.splice(this.previewIdx, 0, this.additionalPwEl);

            Outline.getInstance().el().insertBefore(this.additionalOutlineEl!, this.outlineEl);

            DraggableSortedOrder.getInstance().existOutline.splice(this.outlineIdx, 0, this.additionalOutlineEl!);

        }

        else {

            this.previewElParent.insertBefore(this.previewEl, this.previewElParent.children[this.childrenIdx]);

            DraggableSortedOrder.getInstance().existPwWidgets.splice(this.previewIdx, 0, this.previewEl);

            Outline.getInstance().el().insertBefore(this.outlineEl, DraggableSortedOrder.getInstance().existOutline[this.outlineIdx]);

            DraggableSortedOrder.getInstance().existOutline.splice(this.outlineIdx, 0, this.outlineEl);
        }

    }

    redo() {

        // todo: add two blocks
        DraggableSortedOrder.getInstance().existPwWidgets.splice(this.previewIdx, 1);
        this.previewEl.remove();

        DraggableSortedOrder.getInstance().existOutline.splice(this.outlineIdx, 1);
        this.outlineEl.remove();

    }

}
