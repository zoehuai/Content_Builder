import { Outline } from "../../outline/Outline";
import { DraggableSortedOrder } from "../DraggableSortedOrder";
import { Command } from "./Command";

/**
 * This class implemented reordering and undo reordering commands.
 */
export class ReorderWidgetCommand extends Command {
    previousIdx: number;
    newIdx: number;
    el: HTMLElement;
    previousParent: HTMLElement;
    childrenIdx: number;
    textIndent: string;
    currentParent!: HTMLElement;
    currentChildrenIdx!: number;
    redoTextIndent: string | undefined;

    constructor(previousIdx: number, newIdx: number, el: HTMLElement, previousParent: HTMLElement, childrenIdx: number, textIndent: string) {
        super();
        this.previousIdx = previousIdx;
        this.newIdx = newIdx;
        this.el = el;
        this.previousParent = previousParent;
        this.childrenIdx = childrenIdx;
        this.textIndent = textIndent;
    }

    execute() {

    }

    // reorder before status
    undo() {

        console.log(this.previousParent);
        let newIdx: number;
        this.currentParent = this.el.parentElement!;
        this.currentChildrenIdx = [...this.currentParent.children].indexOf(this.el);

        //splice itself 
        newIdx = DraggableSortedOrder.getInstance().existPwWidgets.indexOf(this.el);

        DraggableSortedOrder.getInstance().existPwWidgets.splice(newIdx, 1);

        //insert before the previous node
        DraggableSortedOrder.getInstance().existPwWidgets.splice(this.previousIdx, 0, this.el);

        this.previousParent.insertBefore(this.el, this.previousParent.children[this.childrenIdx]);

        // adjust outline 
        let outline = DraggableSortedOrder.getInstance().existOutline[newIdx];
        DraggableSortedOrder.getInstance().existOutline.splice(newIdx, 1);
        DraggableSortedOrder.getInstance().existOutline.splice(this.previousIdx, 0, outline);
        Outline.getInstance().el().insertBefore(outline, Outline.getInstance().el().children[this.previousIdx + 1]);
        this.redoTextIndent = outline.style.textIndent;
        outline.style.textIndent = this.textIndent;

    }

    // reorder after status
    redo() {
        let oldIdx: number;

        //splice itself 
        oldIdx = DraggableSortedOrder.getInstance().existPwWidgets.indexOf(this.el);
        DraggableSortedOrder.getInstance().existPwWidgets.splice(oldIdx, 1);
        DraggableSortedOrder.getInstance().existPwWidgets.splice(this.newIdx, 0, this.el);

        this.currentParent.insertBefore(this.el, this.currentParent.children[this.currentChildrenIdx]);

        //adjust outline
        let outline = DraggableSortedOrder.getInstance().existOutline[oldIdx];
        DraggableSortedOrder.getInstance().existOutline.splice(oldIdx, 1);
        DraggableSortedOrder.getInstance().existOutline.splice(this.newIdx, 0, outline);
        Outline.getInstance().el().insertBefore(outline, Outline.getInstance().el().children[this.newIdx + 1]);

        outline.style.textIndent = this.redoTextIndent!;

    }

}