import { BottomInfoBar } from "../../previewWindow/bottomInfoBar/BottomInfoBar";
import { DraggableSortedOrder } from "../DraggableSortedOrder";

export function OutlineContainerCollapse(isShown: boolean, wrapper: HTMLDivElement, collapseBtn: HTMLDivElement, contentContainer: HTMLDivElement, WrapperHeader: HTMLDivElement, outlineContainer: HTMLDivElement) {
    wrapper.style.display = isShown ? "block" : "none";
    collapseBtn.innerText = isShown ? "-" : "+";
    contentContainer.focus();

    BottomInfoBar.getInstance().setEachInfo(outlineContainer.title, outlineContainer.title, "Editable: Yes");

    BottomInfoBar.getInstance().clearWordCount();

    HighlightSelectedOutline(WrapperHeader);

    // find vertical or horizontal's children and hidden them when collapse btn been clicked
    let checkShown = true;
    let wrapperIdx = DraggableSortedOrder.getInstance().existOutline.indexOf(outlineContainer);

    if (isShown) {
        for (let i = wrapperIdx + 1; i < DraggableSortedOrder.getInstance().existOutline.length; i++) {

            if (DraggableSortedOrder.getInstance().existOutline[i].id > outlineContainer.id) {
                
                if (checkShown) {
                    DraggableSortedOrder.getInstance().existOutline[i].style.display = "block";
                    if (DraggableSortedOrder.getInstance().existOutline[i].innerText.includes("+")) {
                        checkShown = false;
                        DraggableSortedOrder.getInstance().existOutline[i].style.display = "block";
                    }
                    if (DraggableSortedOrder.getInstance().existOutline[i].innerText.includes("-")) {
                        DraggableSortedOrder.getInstance().existOutline[i].style.display = "block";
                        checkShown = true;
                    }
                } else {
                    if (DraggableSortedOrder.getInstance().existOutline[i].innerText.includes("-")) {
                        DraggableSortedOrder.getInstance().existOutline[i].style.display = "block";
                        checkShown = true;
                    }
                    if (DraggableSortedOrder.getInstance().existOutline[i].innerText.includes("+")) {
                        DraggableSortedOrder.getInstance().existOutline[i].style.display = "block";
                        checkShown = false;
                    }
                }
            }
            else {
                break;
            }
        }

    } else {
        for (let i = wrapperIdx + 1; i < DraggableSortedOrder.getInstance().existOutline.length; i++) {
            if (DraggableSortedOrder.getInstance().existOutline[i].id > outlineContainer.id) {
                DraggableSortedOrder.getInstance().existOutline[i].style.display = "none";
            }
            else {
                break;
            }
        }
    }
}

//highlight specific clicked element
export function HighlightSelectedOutline(highlightEl: HTMLDivElement) {
    DraggableSortedOrder.getInstance().existOutline.forEach((outline: HTMLElement) => {
        outline.style.backgroundColor = "var(--bg)";
        if (outline.children.length > 0) {
            for (let i = 0; i < outline.children.length; i++) {
                let outlineChildren = outline.children[i] as HTMLElement;
                outlineChildren.style.backgroundColor = "var(--bg)";
            }
        }
    })
    highlightEl.style.backgroundColor = "var(--input-active)";
}