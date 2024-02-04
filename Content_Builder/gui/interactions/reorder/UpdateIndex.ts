import { DraggableSortedOrder } from "../DraggableSortedOrder";
import { CommandAction } from "../undo/CommandAction";
import { SyncAry } from "./SyncAry";

// This function is used to update two arrays
export function UpdateIndex(el: HTMLElement, oidx: number, datas: Element[], previousParent: HTMLElement, childrenIdx: number, outlineTextIndent: string) {

    // todo new one (delete or refine)
    datas.splice(oidx, 1);

    // avoid edge case when dragging to a upper layer of the element

    // when dragging the preview window element
    if (el.id.includes("a")) {

        let idxBeforeEl = datas.indexOf(el.previousElementSibling!);

        if (el.previousElementSibling != null) {
            // console.log("before");

            // this one's previous node might be a text rather than a div
            el.id = datas[idxBeforeEl].id;

            // if dragged element is the last of the elements in array
            if (datas[idxBeforeEl + 1] == null) {
                datas.splice(idxBeforeEl, 0, el);
                SyncAry(oidx, idxBeforeEl);
            }
            else if (Number(datas[idxBeforeEl + 1].id.replace("a", "")) > Number(el.id.replace("a", ""))) {
                datas.splice((idxBeforeEl + 2), 0, el);
                SyncAry(oidx, idxBeforeEl + 2, true);
                // update outline & text indent

            }

            else {
                datas.splice((idxBeforeEl + 1), 0, el);
                SyncAry(oidx, idxBeforeEl + 1);
            }
            // todo:  updatePreviewWindowFromOutline after: idxBeforeEl+1 before: oidx

        }
        else {

            let idxAfterEl = datas.indexOf(el.nextElementSibling!);
            // console.log(idxAfterEl);
            // this scenario means drag into a empty container without any other child node, except this selected element.
            if (idxAfterEl == -1) {
                if (el.parentElement != null) {
                    let idxParentEl = datas.indexOf(el.parentElement!);
                    // console.log("el:");
                    // console.log(el);
                    // console.log("el pre:");
                    // console.log(el.previousSibling!);
                    // console.log("el next:");
                    // console.log(el.nextElementSibling);
                    // console.log("el parent:");
                    // console.log(el.parentElement);
                    // console.log(datas[idxParentEl]);
                    el.id = "a" + (Number(datas[idxParentEl].id.replace("a", "")) + 2);
                    datas.splice(idxParentEl + 1, 0, el);
                    SyncAry(oidx, idxParentEl + 1);
                }
                else {
                    console.log("updateIdx");
                    datas.splice(oidx, 0, el);
                    previousParent.insertBefore(el, previousParent.children[childrenIdx]);
                }
            } else {
                el.id = datas[idxAfterEl].id;
                datas.splice(idxAfterEl, 0, el);
                SyncAry(oidx, idxAfterEl);
            }
        }
        CommandAction.reorder(oidx, idxBeforeEl, el, previousParent, childrenIdx, outlineTextIndent);
    }

    //when dragging the outline element
    else {
        let idxBeforeEl = datas.indexOf(el.previousElementSibling!);
        if (el.previousElementSibling != null) {
            // if outline is the last element
            if (el.nextElementSibling == null) {
                datas.splice(idxBeforeEl + 1, 0, el);
                let pwEl = DraggableSortedOrder.getInstance().existPwWidgets[oidx];

                // adjust text indent for outline insertion
                if (DraggableSortedOrder.getInstance().existOutline[idxBeforeEl].title == "Vertical" || DraggableSortedOrder.getInstance().existOutline[idxBeforeEl].title == "Horizontal") {
                    el.id = (Number(DraggableSortedOrder.getInstance().existOutline[idxBeforeEl].id) + 1).toString();
                    pwEl.id = "a" + (Number(DraggableSortedOrder.getInstance().existPwWidgets[idxBeforeEl + 1].id.replace("a", "")) + 2).toString();
                    el.style.textIndent = (Number(DraggableSortedOrder.getInstance().existOutline[idxBeforeEl].style.textIndent.replace("rem", "")) + 0.7) + "rem";
                }

                else {
                    el.id = DraggableSortedOrder.getInstance().existOutline[idxBeforeEl].id;
                    pwEl.id = DraggableSortedOrder.getInstance().existPwWidgets[idxBeforeEl + 1].id;
                    el.style.textIndent = DraggableSortedOrder.getInstance().existOutline[idxBeforeEl].style.textIndent;
                }
                DraggableSortedOrder.getInstance().existPwWidgets.splice(oidx, 1);
                DraggableSortedOrder.getInstance().existPwWidgets.splice(idxBeforeEl + 1, 0, pwEl);
            }

            // if outline is not the last element
            else {

                datas.splice(idxBeforeEl + 1, 0, el);

                let pwEl = DraggableSortedOrder.getInstance().existPwWidgets[oidx];

                // adjust text indent for outline insertion
                if (DraggableSortedOrder.getInstance().existOutline[idxBeforeEl].title == "Vertical" || DraggableSortedOrder.getInstance().existOutline[idxBeforeEl].title == "Horizontal") {
                    el.id = (Number(DraggableSortedOrder.getInstance().existOutline[idxBeforeEl].id) + 1).toString();
                    pwEl.id = "a" + (Number(DraggableSortedOrder.getInstance().existPwWidgets[idxBeforeEl].id.replace("a", "")) + 2).toString();
                    el.style.textIndent = (Number(DraggableSortedOrder.getInstance().existOutline[idxBeforeEl].style.textIndent.replace("rem", "")) + 0.7) + "rem";
                }

                else {
                    el.id = DraggableSortedOrder.getInstance().existOutline[idxBeforeEl].id;
                    pwEl.id = DraggableSortedOrder.getInstance().existPwWidgets[idxBeforeEl + 1].id;
                    el.style.textIndent = DraggableSortedOrder.getInstance().existOutline[idxBeforeEl].style.textIndent;
                }
                
                DraggableSortedOrder.getInstance().existPwWidgets.splice(oidx, 1);
                DraggableSortedOrder.getInstance().existPwWidgets.splice(idxBeforeEl + 1, 0, pwEl);
                
            }
        }
        else {
            console.log("last outline not null");
        }

        //todo bugs here (whether change the before or after part)
        CommandAction.reorder(oidx, idxBeforeEl + 1, el, previousParent, childrenIdx, outlineTextIndent);

    }
}