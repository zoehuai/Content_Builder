import { AddNewWidgetCommand } from "./AddNewWidgetCommand";
import { CmdManager } from "./CmdManager";
import { DeleteWidgetCommand } from "./deleteWidgetCommand";
import { ReorderWidgetCommand } from "./reorderWidgetCommand";

/**
 * This class implemented various interactions.
 */
 export class CommandAction {

    constructor() {

    }

    static add(previewEl: HTMLElement, outlineEl: HTMLElement, previewIdx: number, outlineIdx: number, previewElParent: HTMLElement) {
        let cmd = new AddNewWidgetCommand(previewEl, outlineEl, previewIdx, outlineIdx, previewElParent);
        CmdManager.execute(cmd);
    }

    static delete(previewEl: HTMLElement, outlineEl: HTMLElement, previewIdx: number, outlineIdx: number, previewElParent: HTMLElement, childrenIdx: number, additionalPwEl?: HTMLElement, additionalOutlineEl?: HTMLElement) {
        let cmd = new DeleteWidgetCommand(previewEl, outlineEl, previewIdx, outlineIdx, previewElParent, childrenIdx, additionalPwEl, additionalOutlineEl);
        CmdManager.execute(cmd);
    }

    static reorder(previousIdx: number, newIdx: number, el: HTMLElement, previousParent: HTMLElement, childrenIdx: number, textIndent: string) {
        let cmd = new ReorderWidgetCommand(previousIdx, newIdx, el, previousParent, childrenIdx, textIndent);
        CmdManager.execute(cmd);
    }

    static undo() {
        CmdManager.undo();
    }

    static redo() {
        CmdManager.redo();
    }
}