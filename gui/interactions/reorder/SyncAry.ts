import { Outline } from "../../outline/Outline";
import { DraggableSortedOrder } from "../DraggableSortedOrder";

export function SyncAry(oidx: number, newIdx: number, isUpperLayer?: boolean) {
        Outline.getInstance().clearOutline();
        let outlineEl = DraggableSortedOrder.getInstance().existOutline[oidx];
        // adjust text indent for outline insertion
        if (DraggableSortedOrder.getInstance().existOutline[newIdx - 1].title == "Vertical" || DraggableSortedOrder.getInstance().existOutline[newIdx - 1].title == "Horizontal") {
            outlineEl.id = (Number(DraggableSortedOrder.getInstance().existOutline[newIdx - 1].id) + 1).toString();
            outlineEl.style.textIndent = DraggableSortedOrder.getInstance().existOutline[newIdx].style.textIndent;

            if (DraggableSortedOrder.getInstance().existPwWidgets[newIdx - 1].title == "empty layout") {
                outlineEl.style.textIndent = (Number(DraggableSortedOrder.getInstance().existOutline[newIdx - 1].style.textIndent.replace("rem", "")) + 0.7) + "rem";
            }
        }
        else {
            if (isUpperLayer) {
                outlineEl.id = (Number(DraggableSortedOrder.getInstance().existOutline[newIdx - 1].id) - 1).toString();
                outlineEl.style.textIndent = (Number(DraggableSortedOrder.getInstance().existOutline[newIdx - 1].style.textIndent.replace("rem", "")) - 0.7) + "rem";
            }
            else {
                outlineEl.id = DraggableSortedOrder.getInstance().existOutline[newIdx - 1].id;
                outlineEl.style.textIndent = DraggableSortedOrder.getInstance().existOutline[newIdx - 1].style.textIndent;
            }
        }

        DraggableSortedOrder.getInstance().existOutline.splice(oidx, 1);

        DraggableSortedOrder.getInstance().existOutline.splice(newIdx, 0, outlineEl);

        DraggableSortedOrder.getInstance().existOutline.forEach((el: HTMLElement) => {
            Outline.getInstance().addToChild(el);
        });
}