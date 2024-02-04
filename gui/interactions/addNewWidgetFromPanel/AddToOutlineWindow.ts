
import { DraggableSortedOrder } from "../DraggableSortedOrder";
import { dragOver } from "../dragOver/DragOver";

export function AddToOutlineWindow(selectedOutline: HTMLElement, selectedEl: HTMLElement) {

    DraggableSortedOrder.getInstance().existOutline.forEach((el: HTMLElement) => {
        if (el.title != "") {

            el.onmouseover = () => {
                dragOver(el, selectedOutline);
                // let ghost outline have the same text indent
                selectedOutline.style.textIndent = el.style.textIndent;
                let idx = DraggableSortedOrder.getInstance().existOutline.indexOf(el);
                let pwEl = DraggableSortedOrder.getInstance().existPwWidgets[idx];

                if (pwEl.parentNode != null) {
                    dragOver(pwEl, selectedEl);
                }
            }
            el.onmouseleave = () => {

            }
        }
    })
}