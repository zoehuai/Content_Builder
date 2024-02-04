import { DraggableSortedOrder } from "../DraggableSortedOrder";
import { SyncAllAry } from "../syncAry/SyncAllAry";
import { CommandAction } from "../undo/CommandAction";

// FIXME: This should reusable in iteration 
export function OutlineContextMenu(outlineEl: HTMLDivElement,targetEl: HTMLElement) {
    outlineEl!.oncontextmenu = (event) => {
        event.preventDefault();
        internalSystem.StandardContextMenu.handler(outlineEl, (menu) => {
            menu.add("Delete Block", () => {
                // outline.remove();
                let parent = targetEl.parentElement;
                let childrenIdx = [...targetEl.parentElement!.children].indexOf(targetEl);

                targetEl.remove();
                let idx = DraggableSortedOrder.getInstance().existOutline.indexOf(outlineEl);
                SyncAllAry.getInstance().deleteSyncAry(idx);

                //delete outline container when all of their children has been deleted
                if ((idx == DraggableSortedOrder.getInstance().existOutline.length) || (DraggableSortedOrder.getInstance().existOutline[idx - 1].title == "Horizontal" || DraggableSortedOrder.getInstance().existOutline[idx - 1].title == "Vertical") && (DraggableSortedOrder.getInstance().existOutline[idx - 1].id >= DraggableSortedOrder.getInstance().existOutline[idx].id)) {
                    SyncAllAry.getInstance().deleteSyncAry(idx - 1);
                }
                CommandAction.delete(DraggableSortedOrder.getInstance().existPwWidgets[idx], outlineEl, idx, idx, parent!, childrenIdx);
            });
        });
    }
}