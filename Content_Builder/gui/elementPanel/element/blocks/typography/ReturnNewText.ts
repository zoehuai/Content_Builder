import { DraggableSortedOrder } from "../../../../interactions/DraggableSortedOrder";
import { CommandAction } from "../../../../interactions/undo/CommandAction";
import { Outline } from "../../../../outline/Outline";
import { TextGUI } from "./TextGUI";

export function ReturnNewText(type: string, parentOfEl: HTMLElement, el: HTMLElement) {

    // check next text should be on flow rules 
    let newText;
    switch (type) {
        case "Heading 1":
            newText = new TextGUI("", "true", "", "h2", "Heading 2", 0);
            break;
        case "Heading 2":
            newText = new TextGUI("", "true", "", "h3", "Heading 3", 0);
            break;
        case "Heading 3":
            newText = new TextGUI("", "true", "", "h4", "Heading 4", 0);
            break;
        case "Heading 4":
            newText = new TextGUI("", "true", "", "h5", "Heading 5", 0);
            break;
        case "Heading 5":
            newText = new TextGUI("", "true", "", "p", "Paragraph", 0);
            break;
        case "Paragraph":
            newText = new TextGUI("", "true", "", "p", "Paragraph", 0);
            break;
        default:
            newText = new TextGUI("", "true", "", "p", "Paragraph", 0);
    }

    // check acceptance / first (no need because already have first)/ last (no need because in the end would have check)


    // update gui
    parentOfEl.insertBefore(newText.el(), el.nextSibling);
    newText.focusEl().focus();


    // update two array
    let idx = DraggableSortedOrder.getInstance().existPwWidgets.indexOf(el);

    DraggableSortedOrder.getInstance().existPwWidgets.splice(idx, 0, newText.el());

    let outline = DraggableSortedOrder.getInstance().existOutline[idx];
    let newOutlineEl = Outline.getInstance().createSingleOutline(newText.name(), 1, newText);
    newOutlineEl.id = outline.id;
    newOutlineEl.style.textIndent = outline.style.textIndent;

    DraggableSortedOrder.getInstance().existOutline.splice(idx, 0, newOutlineEl);

    DraggableSortedOrder.getInstance().existOutline.forEach((el: HTMLElement) => {
        Outline.getInstance().addToChild(el);
    });

    // update command
    CommandAction.add(newText.el(), newOutlineEl, idx, idx, parentOfEl);

} 