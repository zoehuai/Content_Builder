import { LayoutBlockContent } from "./LayoutBlockContent";
import { LayoutContainer } from "./LayoutContainer";
/**
 * This is an abstract class that implements layout block elements.
*/
export class LayoutBlock extends LayoutContainer {
    protected _type: string;
    protected _name: string;
    protected _content?: LayoutBlockContent | null;
    protected _instruction?: string | null;
    protected _editable?: string;
    protected _size?: number;
    protected _extension?: string[];

    constructor(type: string, name: string, editable?: string, content?: LayoutBlockContent | null, instruction?: string | null, size?: number, extension?: string[]) {
        super();
        this._type = type;
        this._name = name;
        this._editable = editable;
        this._content = content;
        this._instruction = instruction;
        this._size = size;
        this._extension = extension;
    }

    type(): string {
        return this._type;
    }

    name(): string {
        return this._name;
    }

    editable(): string {
        return this._editable!;
    }

    content(): LayoutBlockContent | null {
        return this._content!;
    }

    instruction(): string | null {
        return this._instruction!;
    }

    setInstruction(instruction: string) {
        this._instruction = instruction;
    }

    size(): number {
        return this._size!;
    }

    extension(): string[] {
        return this._extension!;
    }

    static createFromLayoutContainer(el: xml.Element): LayoutBlock | undefined {
        let type = el.value("type")!;
        let name = el.attribute("name")!;
        let editable = el.value("editable")!;
        let size = el.value("size")!;
        let extension: string[] = [];
        let extensionString = el.value("extension")!;
        // extension = extensionString.split(",");
        let content: LayoutBlockContent = new LayoutBlockContent(el.value("content")!, el.booleanValue("content/@editable")!);
        let instruction = el.value("instruction");

        //FIXME： this extension has some issues
        return new LayoutBlock(type, name, editable, content, instruction, Number(size), extensionString);
    }
}