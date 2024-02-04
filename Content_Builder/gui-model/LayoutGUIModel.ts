
import { html as h } from "../commons/lib/dom/create";
import { mdIcon, MD_VIEW_HEADLINE } from "../commons/lib/icons/material-design-icons";
import { Block } from "../model/template/components/Block";
import { LayoutCompoundBlocks } from "../model/template/components/LayoutCompoundBlocks";
import { _block, _description, _iconStyle } from "./BlockStyle";
import { WidgetGUIModel } from "./WidgetGUIModel";

export class LayoutGUIModel extends WidgetGUIModel {
  private _component: LayoutCompoundBlocks | Block | undefined;
  constructor(name: string, component?: LayoutCompoundBlocks | Block) {
    super(name);
    this._name = name;
    this._component = component;

    let _icon = h("div", { class: _iconStyle }, mdIcon(MD_VIEW_HEADLINE));
    let _caption = h("div", { class: _description }, this._name);

    h(this._el, {}, _icon, _caption);

  }

  component() {
    return this._component;
  }

}