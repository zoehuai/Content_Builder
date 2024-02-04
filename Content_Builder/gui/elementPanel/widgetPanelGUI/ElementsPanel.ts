import { createClass as cls } from "../../../commons/lib/css/create";
import { html as h } from "../../../commons/lib/dom/create";

const _elementsPanel = cls({
    border: `none`,
    width: "15%",
    margin: "0",
    minHeight: "500px",
});

/**
 * This class is for generating the elements panel in the right side of the window.
 */
export class ElementsPanel {
    private static _ep: ElementsPanel;
    elementsPanel: HTMLDivElement;

    constructor() {
        this.elementsPanel = h("div", { class: _elementsPanel });
    }

    static getInstance(): ElementsPanel {
        if (ElementsPanel._ep == null) {
            ElementsPanel._ep = new ElementsPanel();
        }
        return ElementsPanel._ep;
    }

    el() {
        return this.elementsPanel;
    }
}