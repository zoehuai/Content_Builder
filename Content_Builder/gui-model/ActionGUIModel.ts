import { html as h } from "../commons/lib/dom/create";
import { mdIcon, MD_WIDGETS } from "../commons/lib/icons/material-design-icons";
import { _block, _description, _iconStyle } from "./BlockStyle";
import { WidgetGUIModel } from "./WidgetGUIModel";

export class ActionGUIModel extends WidgetGUIModel {

  constructor(name: string) {
    super(name);
    this._name = name;
    let _icon = h("div", { class: _iconStyle }, mdIcon(MD_WIDGETS));
    let _caption = h("div", { class: _description }, this._name);
    h(this._el, {}, _icon, _caption);
  }
}