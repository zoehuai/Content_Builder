
/**
 * This class implemented Redo and Undo functions.
 */
export class Command {
    constructor() {

    }

    execute() {
        console.error('not override execute')
    }

    undo() {
        console.error('not override undo')
    }

    redo() {
        console.error('not override undo')
    }
}



/**
 * This class implemented adding to Empty Container and undo adding to Empty Container commands.
 */
export class addedInEmptyContainerCommand extends Command {

}
