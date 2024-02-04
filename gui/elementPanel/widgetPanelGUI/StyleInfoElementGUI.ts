import { createClass as cls } from "../../../commons/lib/css/create";
import { html as h } from "../../../commons/lib/dom/create";

const _card = cls({
    borderRadius: `10px`,
    padding: `10px 10px 10px`,
    margin: "inherit",
    width: `95%`,
    height: "100%",
    backgroundColor: `var(--code-bg)`,
    textAlign: `center`,
    boxShadow: `0 5px 10px 0 rgba(0, 0, 0, 0.3)`,
    userSelect: "none",
});


/**
 * This class is used to display each element in Style.xml.
 * */
export class StyleInfoElementGUI {
    // private _dropList: HTMLDivElement;
    public _card: HTMLDivElement;

    constructor() {
        // this._dropList = h("div", { class: _dropListStyle });
        // this._dropList.style.position = "relative";
        this._card = h("div", { class: _card });
    }

    card(title: string, tagStyle: any): HTMLElement {
        let p = h("h3", { style: "user-select:none;margin-top:5px" }, title);
        let items = h("div", { style: "text-align:left" });
        let itemsValues = h("div", { style: "text-align:right" });
        let itemContainer = h("div", {});
        h(itemContainer, { style: "display:flex;flex-direction:row;justify-content:space-between" }, items, itemsValues);
        this.items(items, itemsValues, tagStyle);
        h(this._card!, {}, p, itemContainer);
        return this._card!;
    }

    items(items: HTMLElement, itemsValues: HTMLElement, tagStyle: any) {

        Object.keys(tagStyle).forEach((item: any) => {
            let title = item.toString();
            if (title.includes("background-color")) {
                title = "background";
            }
            let itemTitle = h("div", { style: "width:max-content;" }, title);
            h(items, {}, itemTitle);
        });

        Object.values(tagStyle).forEach((item: any) => {

            if (item instanceof Object) {
                let value = Object.keys(item);
                let itemValue;
                if (Object.values(item).toString().includes("#")) {
                    let color = h("input", { type: "color", value: Object.values(item).toString(), style: "padding:0px" },);
                    let valueStr = value.toString();
                    itemValue = h("div", { style: "width:max-content;" }, valueStr + " : ");
                    if (valueStr.includes("background-color")) {
                        itemValue.innerText = "";
                    }
                    color.style.pointerEvents = "none";
                    color.style.height = "20px";
                    h(itemValue, {}, color);
                } else {
                    // itemValue= h("div", { style: "width:max-content;" }, value.toString() + " : " + Object.values(item).toString());
                    itemValue= h("div", {}, value.toString() + " : " + Object.values(item).toString());
                }
                h(itemsValues, {}, itemValue);
            } else {
                let value = item.toString();
                let itemValue;

                if (value.includes("#")) {
                    itemValue = h("div");
                    let color = h("input", { type: "color", value: value, style: "padding:0px" });
                    color.style.pointerEvents = "none";
                    color.style.height = "20px";
                    h(itemValue, {}, color);
                    h(itemsValues, {}, itemValue);

                } else {
                    itemValue = h("div", {}, value);
                    h(itemsValues, {}, itemValue);
                }
            }
        });
    }

    colorPicker(colorBtn: HTMLButtonElement) {
        let color = h("input", { type: "color", value: "#000000" });
        color.style.backgroundColor = "#4D5053";
        color.style.border = "none";
        color.style.cursor = "pointer";
        h(colorBtn, {}, color);
    }
}