import { NotFoundError } from "../error/NotFoundError";
import { BlockType } from "./components/BlockType";

/**
 * This is a class that defines specific block's flow rules for the document.
*/
export class FlowRule {

    private _from: string;
    private _to: string;

    /**
     * @param from This block assigned with higher priority.
     * @param to   This block assigned with lower priority.
     */
    constructor(from: string, to: string) {
        this._from = from;
        this._to = to;
    }

    from(): string {
        return this._from;
    }

    to(): string {
        return this._to;
    }

    static createFromXml(el: xml.Element): FlowRule {
        let from: string = el.value("from")!;
        let to: string = el.value("to")!;

        let ifBothExists = BlockType.contains(from) && BlockType.contains(to);

        if (!ifBothExists) {
            if (!BlockType.contains(from)) {
                NotFoundError.message(`Block from ${from}`);
            }
            else if (!BlockType.contains(to)) {
                NotFoundError.message(`Block to ${to}`);
            } else
                NotFoundError.message(`Block from ${from} and to ${to} `);
        }
        return new FlowRule(from, to);
    }
}