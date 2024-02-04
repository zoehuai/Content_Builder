import { Block } from "./Block";
import { Blocks } from "./Blocks";
import { LayoutCompoundBlocks, } from "./LayoutCompoundBlocks";

/**
 * This is a class that parses the xml and returns one type of blocks or null if it doesn't exist.
*/
export class BlocksFactory {

    constructor() {

    }

    static createFromXml(el: xml.Element): Blocks | null {

        switch (el.name()) {
            case "layout": return LayoutCompoundBlocks.createFromXml(el);
            case "block": return Block.createFromXml(el);
            default: {
                // NotFoundError.message(`Blocks ${el.name()}`);
                return null;
            }
        }
    }
}
