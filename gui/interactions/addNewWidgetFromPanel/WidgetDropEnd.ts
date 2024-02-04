import { StyleItems } from "../../../model/template/document/StyleItems";
import { Outline } from "../../outline/Outline";
import { DraggableSortedOrder } from "../DraggableSortedOrder";
import { CommandAction } from "../undo/CommandAction";

export function WidgetDropEnd(widgetElement: HTMLDivElement, newOutline: HTMLDivElement, outlineLayoutAry: HTMLDivElement[], pwLayoutAry: HTMLDivElement[]) {
    let previousSibling = widgetElement.previousSibling as HTMLElement;
    let insertIdx = DraggableSortedOrder.getInstance().existPwWidgets.indexOf(previousSibling);

    CommandAction.add(widgetElement, newOutline, insertIdx, insertIdx, widgetElement.parentElement!);
    widgetElement.id = previousSibling.id;

    if (insertIdx == -1) {

    } else {
        StyleItems.getInstance().setDropStyle(widgetElement);
        DraggableSortedOrder.getInstance().reorderPreviewWindow(widgetElement);
        DraggableSortedOrder.getInstance().reorderOutline(newOutline);

        // if drag a layout it should generate multiple outline
        if (outlineLayoutAry != null) {
            for (var i = 0; i < outlineLayoutAry.length; i++) {
                outlineLayoutAry[i].id = newOutline.id;
                DraggableSortedOrder.getInstance().existOutline.splice((insertIdx + 1 + i), 0, outlineLayoutAry[i]);
            }
        }

        DraggableSortedOrder.getInstance().existOutline.splice(insertIdx + 1, 0, newOutline);

        if (pwLayoutAry != null) {
            for (var i = 0; i < pwLayoutAry.length; i++) {
                pwLayoutAry[i].id = widgetElement.id;
                DraggableSortedOrder.getInstance().existPwWidgets.splice((insertIdx + 1 + i), 0, pwLayoutAry[i]);
            }
        }
        DraggableSortedOrder.getInstance().existPwWidgets.splice(insertIdx + 1, 0, widgetElement);
    }

    if (pwLayoutAry != null) {
        for (var i = 0; i < pwLayoutAry.length; i++) {
            let id = Number(widgetElement.id) + 1;
            pwLayoutAry[i].id = "a" + id;
        }
    }

    let outlineId = widgetElement.id.replace("a", "");
    newOutline.id = outlineId;

    if (outlineLayoutAry != null) {
        for (var i = 0; i < outlineLayoutAry.length; i++) {
            outlineLayoutAry[i].id = (Number(newOutline.id) + 1).toString();
        }
    }

    newOutline.style.textIndent = (Number(outlineId) - 2) + 0.7 + `rem`;

    for (var i = 0; i < outlineLayoutAry.length; i++) {
        outlineLayoutAry[i].style.textIndent = newOutline.style.textIndent;
    }

    // todo: testing for other scenarios
    DraggableSortedOrder.getInstance().existOutline.forEach((el: HTMLElement) => {
        Outline.getInstance().addToChild(el);
    });

    // record the action on the command stack
    // let cmd = new addNewWidgetCommand(widget.el());
    // cmdManager.execute(cmd);
    
}