import { NotFoundError } from "../../error/NotFoundError";
import { BlockType } from "../components/BlockType";

/**
 * This is a class that implements acceptance of layout blocks.
*/
export class ContainerAcceptance {
    protected _blockRef: string;
    constructor(type: string) {
        this._blockRef = type;
    }
    type(): string {
        return this._blockRef;
    }
    static createFromXml(el: xml.Element): ContainerAcceptance | undefined {
        let type = el.value()!;
        if (BlockType.contains(type)) {
            return new ContainerAcceptance(type);
        }
        NotFoundError.message(`Block Type ${type}`)
    }

    blockRef(): string {
        return this._blockRef;
    }
}