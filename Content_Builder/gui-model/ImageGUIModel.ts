import { html as h } from "../commons/lib/dom/create";
import { mdIcon, MD_WIDGETS } from "../commons/lib/icons/material-design-icons";
import { _block, _description, _iconStyle } from "./BlockStyle";
import { WidgetGUIModel } from "./WidgetGUIModel";

export class ImageGUIModel extends WidgetGUIModel {
    private _type: string;
    private _instruction: string;
    private _size?: number;
    private _extension?: string[];

    constructor(name: string, type: string, instruction: string, size?: number, extension?: string[]) {
        super(name);
        this._name = name;
        this._instruction = instruction;
        this._type = type;
        this._size = size;
        this._extension = extension;
        let _icon = h("div", { class: _iconStyle }, mdIcon(MD_WIDGETS));
        let _caption = h("div", { class: _description }, this._name);
        h(this._el, {}, _icon, _caption);
    }

    type() {
        return this._type;
    }

    instruction() {
        return this._instruction;
    }

    size() {
        return this._size;
    }

    extension() {
        return this._extension;
    }
}
