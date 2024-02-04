import { Command } from "./Command";

export const CmdManager = (() => {
    let redoStack: Command[] = [];
    let undoStack: Command[] = [];

    return {
        execute(cmd: Command) {
            cmd.execute();
            undoStack.push(cmd);
            redoStack = [];
        },

        undo() {
            if (undoStack.length == 0) {
                internalSystem.notification(`No more undo`, { type: "warning" });
                return;
            }
            const cmd = undoStack.pop();
            cmd!.undo();
            redoStack.push(cmd!);
        },

        redo() {
            if (redoStack.length == 0) {
                internalSystem.notification(`No more redo`, { type: "warning" });
                return;
            }
            const cmd = redoStack.pop();
            cmd!.redo();
            undoStack.push(cmd!);
        },
    }
})();