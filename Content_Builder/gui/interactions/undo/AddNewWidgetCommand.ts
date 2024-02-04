import { Outline } from "../../outline/Outline";
import { DraggableSortedOrder } from "../DraggableSortedOrder";
import { Command } from "./Command";

/**
 * This class implemented adding and undo adding commands.
 */
 export class AddNewWidgetCommand extends Command {
    previewEl: HTMLElement;
    outlineEl: HTMLElement;
    previewIdx: number;
    outlineIdx: number;
    previewElParent: HTMLElement;
    childrenIdx!: number;

    constructor(previewEl: HTMLElement, outlineEl: HTMLElement, previewIdx: number, outlineIdx: number, previewElParent: HTMLElement) {
        super();
        this.previewEl = previewEl;
        this.outlineEl = outlineEl;
        this.previewIdx = previewIdx;
        this.outlineIdx = outlineIdx;
        this.previewElParent = previewElParent;
    }

    execute() {
    }

    undo() {
        this.childrenIdx = [...this.previewElParent.children].indexOf(this.previewEl);
        // console.log(this.previewIdx);
        this.previewEl.remove();

        DraggableSortedOrder.getInstance().existPwWidgets.splice(this.previewIdx, 1);

        this.outlineEl.remove();

        DraggableSortedOrder.getInstance().existOutline.splice(this.outlineIdx, 1);
    }

    redo() {

        // return back the block

        // insert previous node before the previous node ahead of this node

        this.previewElParent.insertBefore(this.previewEl, this.previewElParent.children[this.childrenIdx]);

        DraggableSortedOrder.getInstance().existPwWidgets.splice(this.previewIdx, 0, this.previewEl);
        
        //todo for testing about the children of the outline el 
        Outline.getInstance().el().insertBefore(this.outlineEl, Outline.getInstance().el().children[this.outlineIdx - 1]);

        DraggableSortedOrder.getInstance().existOutline.splice(this.outlineIdx, 0, this.outlineEl);

    }
}