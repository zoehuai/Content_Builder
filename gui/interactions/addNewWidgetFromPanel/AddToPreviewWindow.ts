import { DraggableSortedOrder } from "../DraggableSortedOrder";
import { dragOver } from "../dragOver/DragOver";

export function AddToPreviewWindow(selectedOutline: HTMLElement, selectedEl: HTMLElement, addNewWidget: boolean) {

    DraggableSortedOrder.getInstance().existPwWidgets.forEach((el: HTMLElement) => {
        if (el.title == "text" || el.title == "image" || el.title == "button" || el.title == "video") {

            el.onmousemove = () => {
                // drag over is the function that makes the ghost element moving.
                // selectedEl.style.height = "";
                dragOver(el, selectedEl);
                let idx = DraggableSortedOrder.getInstance().existPwWidgets.indexOf(el);
                let lineEl = DraggableSortedOrder.getInstance().existOutline[idx];

                if (addNewWidget) {
                    dragOver(lineEl, selectedOutline);
                    selectedOutline.style.textIndent = lineEl.style.textIndent;
                }
            }

            el.onmouseleave = () => {
                el.style.backgroundColor = "var(--bg--dim)";
            }
        }

        let emptyInnerText: string;
        if (el.title == "empty layout") {
            el.onmousemove = () => {
                emptyInnerText = el.innerText;
                // when other empty layout has been added, it should warning and not allowed
                if (selectedEl.title == "empty layout") {
                    // internalSystem.notification(`Please drag a widget in this empty ${el.innerText} rather than another empty Vertical or Horizontal.`, { type: "warning" });
                    // selectedEl.innerHTML = "";
                    dragOver(el, selectedEl);
                }

                else {
                    el.title = "layout";
                    el.style.border = "0.1px solid var(--bg--dim)";
                    // el.style.color = "transparent";
                    // selectedEl.style.border = "2px dotted pink";
                    // el.innerHTML = "";
                    el.style.height = "100%";
                    let newIdx = Number(el.id.replace("a", "")) + 2;
                    selectedEl.id = "a" + newIdx;
                    dragOver(el, selectedEl);
                    el.appendChild(selectedEl);
                }
            }

            el.onmouseleave = () => {
                emptyInnerText = "";
                if (selectedEl != null) {
                    selectedEl.style.width = "100%";
                    el.title = "empty layout";
                    // el.style.color = "pink";
                    el.style.height = "50px";
                    el.innerHTML = emptyInnerText;
                    el.style.border = "2px dotted pink";
                }
            }
        }
    })
}