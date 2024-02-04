import { NotFoundError } from "../../error/NotFoundError";
import { LayoutContainer } from "../layout/LayoutContainer";
import { LayoutContainerFactory } from "../layout/LayoutContainerFactory";
import { Blocks } from "./Blocks";

/**
 * This is a class that implements layout options.
*/
export class LayoutCompoundBlocks extends Blocks {
    private _name: string;
    private _layoutContainer: LayoutContainer;
    private _label?: string | null;
    private _description?: string | null;

    /**
      * @param name
      * @param layoutContainer This is a set of children layout elements, e.g. layoutBlocks, vertical and horizontal.
      * @param label This is an optional element in the layout.
      * @param description This is an optional element in the layout.
      */
    constructor(name: string, layoutContainer: LayoutContainer, label?: string | null, description?: string | null) {
        super();
        this._name = name;
        this._layoutContainer = layoutContainer;
        this._label = label;
        this._description = description;
    }

    name(): string {
        return this._name;
    }

    setName(name: string) {
        this._name = name;
    }

    type() {
        return "layout";
    }

    label(): string | null {
        return this._label!;
    }

    setLabel(label: string) {
        this._label = label;
    }

    description(): string | null {
        return this._description!;
    }

    LayoutContainer(): LayoutContainer | undefined {
        if (this._layoutContainer == null) {
            NotFoundError.message("Layout Blocks");
            return;
        }
        return this._layoutContainer;
    }

    static createFromXml(el: xml.Element): LayoutCompoundBlocks {

        let name: string = el.attribute("name")!;
        let layoutContainer: LayoutContainer | undefined = LayoutContainerFactory.createFromXml(el);
        let label: string | null = el.value("label");
        let description: string | null = el.value("description");

        return new LayoutCompoundBlocks(name, layoutContainer!, label, description);
    };
}