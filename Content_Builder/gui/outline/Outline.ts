import { html as h } from "../../commons/lib/dom/create";
import { createClass as cls } from "../../commons/lib/css/create";
import { TextGUI } from "../elementPanel/element/blocks/typography/TextGUI";
import { ImageGUI } from "../elementPanel/element/blocks/media/ImageGUI";
import { clear } from "../../commons/lib/dom/clear";
import { LayoutGUI } from "../elementPanel/element/blocks/typography/LayoutGUI";
import { DraggableSortedOrder } from "../interactions/DraggableSortedOrder";
import { ButtonGUI } from "../elementPanel/element/blocks/interaction/ButtonGUI";
import { WidgetGUI } from "../elementPanel/element/blocks/WidgetGUI";
import { HighlightSelectedOutline } from "../interactions/outlineActions/OutlineContainerCollapse";
import { OutlineContextMenu } from "../interactions/outlineActions/OutlineContextMenu";

const _el = cls({
    backgroundColor: "var(--bg)",
    textAlign: "left",
    border: "0.5px solid grey",
    width: "10%",
    margin: "0.5rem",
    fontSize: "12px",
    overflowX: "scroll",
    overflowY: "scroll",

})

const _outline = cls({
    userSelect: "none",
    cursor: "pointer",
    padding: "0.25rem",
    "&:hover": {
        backgroundColor: "var(--input-active)",
    },
})

const _outlineEl = cls({
    display: "flex",
    userSelect: "none",
    cursor: "pointer",
    padding: "0.25rem",
})

export class Outline {
    private _el: HTMLDivElement;
    private static _outline: Outline;
    private _outlineOrder: HTMLElement[];
    private _title: HTMLDivElement;
    _wrapper: HTMLDivElement;

    constructor() {
        this._wrapper = h("div", { class: _el });
        this._title = h("div", { style: { color: "var(--label)", textAlign: "center", padding: "0.25rem", fontStyle: "normal", fontSize: "15px", userSelect: "none" } }, "Outline");
        this._el = h("div", { style: { marginTop: "0.5rem", marginLeft: "0.5rem" } });
        h(this._wrapper, {}, this._title, this._el);
        this._outlineOrder = [];
    }

    static getInstance(): Outline {
        if (Outline._outline == null) {
            Outline._outline = new Outline();
        }
        return Outline._outline;
    }

    addToParent(parent: HTMLElement) {
        h(parent, {}, this._wrapper);
    }

    addToChild(child: HTMLElement) {
        h(this._el, {}, child);
    }

    clearOutline() {
        clear(this._el);
    }

    el(): HTMLDivElement {
        return this._el;
    }

    wrapper(): HTMLDivElement {
        return this._wrapper;
    }

    createSingleOutline(fieldTitle: string, count: number, target?: WidgetGUI): HTMLDivElement {

        // when target is a compound/layout element
        if (target instanceof LayoutGUI) {

            let verticalWrapper = h("div");
            let verticalWrapperHeader = h("div", { class: _outlineEl });
            let verticalTitle = h("div", { style: { userSelect: "none" } }, fieldTitle);
            let collapseBtn = h("div", { style: { width: "10px" } }, h("span", { style: { marginRight: "3px", width: "10px" } }, "-"));

            h(verticalWrapperHeader, {}, collapseBtn, verticalTitle);

            let outlineContainer = h("div", { id: (count + 1).toString(), title: fieldTitle }, verticalWrapperHeader, verticalWrapper);

            let indent = (count - 2) + 0.7;
            outlineContainer.style.textIndent = indent + `rem`;

            let isShown = true;
            outlineContainer!.onclick = () => {
                console.log("outlineContainer.onclick");

                isShown = !isShown;
                verticalWrapper.style.display = isShown ? "block" : "none";
                collapseBtn.innerText = isShown ? "-" : "+";

                target!.el().focus();
                target!.el().style.borderColor = "var(--input-active)";

                //display on the bottom info bar (bug on blink)
                HighlightSelectedOutline(verticalWrapperHeader);

                let wrapperIdx = DraggableSortedOrder.getInstance().existOutline.indexOf(outlineContainer);
                let checkShown = true;
                if (isShown) {
                    for (let i = wrapperIdx + 1; i < DraggableSortedOrder.getInstance().existOutline.length; i++) {
                        if (DraggableSortedOrder.getInstance().existOutline[i].id > outlineContainer.id) {
                            if (checkShown) {
                                DraggableSortedOrder.getInstance().existOutline[i].style.display = "block";
                                if (DraggableSortedOrder.getInstance().existOutline[i].innerText.includes("+")) {
                                    checkShown = false;
                                    DraggableSortedOrder.getInstance().existOutline[i].style.display = "block";
                                }
                                if (DraggableSortedOrder.getInstance().existOutline[i].innerText.includes("-")) {
                                    DraggableSortedOrder.getInstance().existOutline[i].style.display = "block";
                                    checkShown = true;
                                }
                            } else {
                                if (DraggableSortedOrder.getInstance().existOutline[i].innerText.includes("-")) {
                                    DraggableSortedOrder.getInstance().existOutline[i].style.display = "block";
                                    checkShown = true;
                                }
                                if (DraggableSortedOrder.getInstance().existOutline[i].innerText.includes("+")) {
                                    DraggableSortedOrder.getInstance().existOutline[i].style.display = "block";
                                    checkShown = false;
                                }
                            }
                        }
                        else {
                            break;
                        }
                    }
                } else {
                    for (let i = wrapperIdx + 1; i < DraggableSortedOrder.getInstance().existOutline.length; i++) {
                        if (DraggableSortedOrder.getInstance().existOutline[i].id > outlineContainer.id) {
                            DraggableSortedOrder.getInstance().existOutline[i].style.display = "none";
                        }
                        else {
                            break;
                        }
                    }
                }

                if (target instanceof TextGUI || ImageGUI || LayoutGUI) {
                    target!.el().scrollIntoView({ behavior: "smooth", block: "start" });
                    target!.handleOnClick();
                }
            }
            return outlineContainer;
        }

        // when target is a single element
        else {
            let outline: HTMLDivElement = h("div", { class: _outline, id: count.toString(), title: fieldTitle }, fieldTitle);
            
            let indent = (count - 2) + 0.7;
            outline!.style.textIndent = indent + `rem`;

            outline!.onclick = () => {
                target!.el().focus();
                target!.el().style.borderColor = "var(--input-active)";

                // ? display on the bottom info bar (bug on blink)

                HighlightSelectedOutline(outline);
                if (target instanceof TextGUI || ImageGUI || LayoutGUI || ButtonGUI) {
                    target!.el().scrollIntoView({ behavior: "smooth", block: "start" });
                    target!.handleOnClick();
                }
            }
            OutlineContextMenu(outline!, target!.el());
            return outline!;
        }
    }

    scrollToView(el: HTMLElement) {
        for (var i = 0; i < this._outlineOrder.length; i++) {
            this._outlineOrder[i].onclick = () => {
                el.scrollIntoView({ block: "end" });
                // scroll(PreviewWindow.getInstance());
            }
        }
    }

    clearPointerEvents(el: HTMLElement) {
        el.style.pointerEvents = "none";
    }

}