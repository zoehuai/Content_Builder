import { Blocks } from "./Blocks";

/**
 * This is a class that implements normal block options.
*/
export class Block extends Blocks {
    protected _type: string;
    protected _name: string;
    protected _label?: string | null;
    protected _description?: string | null;
    protected _size?: string | null;
    protected _extension?: string[] | null;

    constructor(type: string, name: string, label?: string, description?: string, size?: string, extension?: string[]) {
        super();
        this._type = type;
        this._name = name;
        this._label = label;
        this._description = description;
        this._size = size;
        this._extension = extension;
    }

    type(): string {
        return this._type;
    }

    name(): string {
        return this._name;
    }

    setName(name: string) {
        this._name = name;
    }

    label(): string | null {
        return this._label!;
    }

    description(): string | null {
        return this._description!;
    }

    size(): string | null {
        return this._size!;
    }

    LayoutContainer(): null {
        return null;
    }

    extension(): string[] | null {
        return this._extension!;
    }

    static createFromXml(el: xml.Element): Block {
        let type = el.value("type")!;
        let name = el.attribute("name")!;
        let label = el.value("label")!;
        let description = el.value("description")!;
        let size = el.value("size")!;
        let extensions: string[] = [];
        el.elements("extension").forEach(e => {
            extensions.push(e.value("extension")!);
        })
        return new Block(type, name, label, description, size, extensions);
    }
}