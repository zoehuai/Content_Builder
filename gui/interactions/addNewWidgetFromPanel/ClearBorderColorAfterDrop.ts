import { PreviewWindow } from "../../previewWindow/PreviewWindow";
import { DraggableSortedOrder } from "../DraggableSortedOrder";

export function ClearBorderColorAfterDrop(widgetElement: HTMLElement) {

    let y = PreviewWindow.getInstance().el().querySelectorAll("div");

    let j;
    for (j = 0; j < y.length; j++) {
        y[j].parentElement!.onmouseover = null;
        y[j].parentElement!.onmouseleave = null;
        y[j].parentElement!.onmousemove = null;
        // y[j].parentElement!.style.border = "0.1px solid transparent";
    }
    if (widgetElement.parentElement != null) {
        widgetElement.parentElement!.style.border = "0.1px solid transparent";
    }
    
    PreviewWindow.getInstance().el().style.border = "0.5px solid grey";


    DraggableSortedOrder.getInstance().existPwWidgets.forEach((el: HTMLElement) => {
        el.onmouseover = null;
    })

    DraggableSortedOrder.getInstance().existOutline.forEach((el: HTMLElement) => {
        el.onmouseover = null;
    })
}