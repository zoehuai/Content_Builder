import { html as h } from "../commons/lib/dom/create";
import { mdIcon, MD_WIDGETS } from "../commons/lib/icons/material-design-icons";
import { _block, _description, _iconStyle } from "./BlockStyle";
import { WidgetGUIModel } from "./WidgetGUIModel";

export class TextGUIModel extends WidgetGUIModel{
  private _type: string;
  private _label: string | undefined;

  constructor(name: string, type: string, label?: string) {
    super(name);
    this._name = name;
    this._type = type;
    this._label = label;
    let _icon = h("div", { class: _iconStyle }, mdIcon(MD_WIDGETS));
    let _caption = h("div", { class: _description }, this._name);
    h(this._el, {}, _icon, _caption);
  }

  type() {
    return this._type;
  }

  label() {
    return this._label;
  }

}
