import { createClass as cls } from "../commons/lib/css/create";
import { html as h } from "../commons/lib/dom/create";
import { ToolBarTabSvgGUI } from "./elementPanel/widgetPanelGUI/ToolBarTabSvgGUI";
import { TopTitleEditorGUI } from "./topTitleEditor/TopTitleEditorGUI";
import { Outline } from "./outline/Outline";
import { PreviewWindow } from "./previewWindow/PreviewWindow";
import { ElementsPanel } from "./elementPanel/widgetPanelGUI/ElementsPanel";

const _outerContainer = cls({
    height: "100%",
    backgroundColor: "var(--bg)",
});

const _bodyContainer = cls({
    display: "flex",
    flexDirection: "row",
    height: "95%",
});

/**
 *  This method is used to generate all the elements shows in web page that allows the user to manage different types of the widgets for the content. e.g. ordering and deleting.
 */
export class ContentBuilderGUI {
    private _el: HTMLDivElement;

    constructor() {

        this._el = h("div", { class: _outerContainer });

        //this container wrapper includes preview window, top menu bar and bottom information bar cling to the preview window.
        ToolBarTabSvgGUI.getInstance().addToParent(ElementsPanel.getInstance().el());

        //this container wrapper includes outline, preview window and elements panel.
        let bodyContainer = h("div", { class: _bodyContainer });

        Outline.getInstance().addToParent(bodyContainer);

        h(
            bodyContainer,
            {},
            PreviewWindow.getInstance().previewWindowWrapper(),
            ElementsPanel.getInstance().el(),
        );

        TopTitleEditorGUI.getInstance().addToParent(this._el);

        PreviewWindow.getInstance().checkOndragenter();

        h(this._el, {}, bodyContainer);
     
        window.onbeforeunload = () => {
            // let confirmationMessage = 'If you leave before saving, your changes will be lost.';
            return 'If you leave before saving, your changes will be lost.';
        };
    }

    render(outmostEl: HTMLElement): HTMLElement {
        return h(outmostEl, {}, this._el);
    }
}