import { html as h } from "../commons/lib/dom/create";
import { _block, _description, _iconStyle } from "./BlockStyle";

/**
 *  This gui-model is the bridge of the GUI and model, all the gui model widgets inherit from this class.
 * */
export class WidgetGUIModel {
    protected _name: string;
    protected _el: HTMLDivElement;

    constructor(name: string) {
        this._name = name;
        this._el = h("div", { class: _block });
    }

    el(): HTMLDivElement {
        return this._el;
    }

    name(): string{
        return this._name;
    }
}