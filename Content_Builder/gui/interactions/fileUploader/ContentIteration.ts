import { createClass as cls } from "../../../commons/lib/css/create";
import { clear } from "../../../commons/lib/dom/clear";
import { html as h } from "../../../commons/lib/dom/create";
import { Blocks } from "../../../model/template/components/Blocks";
import { LayoutCompoundBlocks } from "../../../model/template/components/LayoutCompoundBlocks";
import { Horizontal } from "../../../model/template/layout/Horizontal";
import { LayoutBlock } from "../../../model/template/layout/LayoutBlock";
import { LayoutContainer } from "../../../model/template/layout/LayoutContainer";
import { Vertical } from "../../../model/template/layout/Vertical";
import { ButtonGUI } from "../../elementPanel/element/blocks/interaction/ButtonGUI";
import { ImageGUI } from "../../elementPanel/element/blocks/media/ImageGUI";
import { LayoutGUI } from "../../elementPanel/element/blocks/typography/LayoutGUI";
import { TextGUI } from "../../elementPanel/element/blocks/typography/TextGUI";
import { Outline } from "../../outline/Outline";
import { BottomInfoBar } from "../../previewWindow/bottomInfoBar/BottomInfoBar";
import { WordCount } from "../../previewWindow/bottomInfoBar/WordCount";
import { PreviewWindow } from "../../previewWindow/PreviewWindow";
import { DraggableSortedOrder } from "../DraggableSortedOrder";
import { HighlightSelectedOutline, OutlineContainerCollapse } from "../outlineActions/OutlineContainerCollapse";
import { CheckAcceptance } from "../prevention/CheckAcceptance";

const _contentContainer = cls({
    border: "0.1px solid transparent",
    "&:focus": {
        border: "0.1px solid var(--input-active)",
    }
})

const _outlineEl = cls({
    display: "flex",
    userSelect: "none",
    cursor: "pointer",
    padding: "0.25rem",
    "&:hover": {
        backgroundColor: "var(--input-active)",
    },
    "&:active": {
        backgroundColor: "var(--input-active)",
    }
})

export function ContentIteration(l: LayoutCompoundBlocks | Blocks | undefined, withConvention: boolean, layout?: HTMLElement, selected?: boolean, type?: string, outlineContainer?: HTMLElement) {

    if (l instanceof LayoutCompoundBlocks) {

        if (l.LayoutContainer() instanceof Vertical || l.LayoutContainer() instanceof Horizontal) {
            let direction = l.LayoutContainer()!.constructor.name;
            let contentWrapper = h("div", { id: direction + "1", class: _contentContainer, title: "layout" });
            contentWrapper.tabIndex = 0;
            // contentWrapper.style.border = "0.1px solid transparent";
            if (withConvention == true) {
                contentWrapper.title = "with convention";
            }

            PreviewWindow.getInstance().addToChild(contentWrapper);

            let count: number = 1;
            let outlineWrapper = h("div", { id: "1", title: direction, class: _outlineEl, style: { userSelect: "none", cursor: "pointer", textIndent: "0rem" } });
            let outlineWrapperHeader = h("div", {}, direction);

            h(outlineWrapper, {}, outlineWrapperHeader);

            if (layout != null) {
                h(layout!, {}, contentWrapper);
                PreviewWindow.getInstance().addToChild(layout);
                Outline.getInstance().addToChild(outlineWrapper);
            }

            //selected is for choosing layout from document layouts, if it selected, then choose this layout
            if (selected == true) {
                // WordCount.getInstance().wordCountAry().clear();
                DraggableSortedOrder.getInstance().existOutline.splice(0, DraggableSortedOrder.getInstance().existOutline.length);
                DraggableSortedOrder.getInstance().existPwWidgets.splice(0, DraggableSortedOrder.getInstance().existPwWidgets.length);
            }

            if (type != null) {
                outlineWrapperHeader.innerText = "V {" + type + "}";
                clear(outlineWrapper);
            }

            outlineWrapper.onclick = () => {
                contentWrapper.focus();
                BottomInfoBar.getInstance().setEachInfo(outlineWrapper.title.replace("{", "").replace("}", "").split(` `)[0], direction, "true");
                BottomInfoBar.getInstance().clearWordCount();
                WordCount.getInstance().wordOverall();
                HighlightSelectedOutline(outlineWrapper);
                outlineWrapperHeader.style.backgroundColor = "var(--input-active)";
            }

            let container = new LayoutGUI(direction, "", 0, "");
            DraggableSortedOrder.getInstance().addPreviewWindowEl(contentWrapper, container);
            DraggableSortedOrder.getInstance().addOutline(outlineWrapper);

            CheckAcceptance.getInstance().checkAll(l.LayoutContainer()!, contentWrapper);
            createChildrenHTML(l.LayoutContainer()!, contentWrapper, outlineWrapper, count);
        }

        function createChildrenHTML(layoutContainer: LayoutContainer, contentWrapper: HTMLElement, outlineWrapper: HTMLElement, count: number) {
            //todo: change all colors to be not highlighted
            if (layoutContainer.children) {
                layoutContainer.children.forEach((c: LayoutContainer) => {

                    if (c instanceof Vertical || c instanceof Horizontal) {
                        let direction = c.constructor.name;

                        let contentContainer = h("div", { class: _contentContainer, id: "a" + count.toString(), title: "layout" });
                        contentContainer.tabIndex = 0;

                        if (direction == "Horizontal") {
                            contentContainer.style.display = "flex";
                        }

                        h(contentWrapper, {}, contentContainer);

                        let verticalWrapper = h("div");
                        let verticalWrapperHeader = h("div", { class: _outlineEl });
                        let verticalTitle = h("div", { style: { userSelect: "none" } }, direction);

                        let collapseBtn = h("div", { style: { width: "10px" } }, h("span", { style: { marginRight: "3px", width: "10px" } }, "-"));
                        h(verticalWrapperHeader, {}, collapseBtn, verticalTitle);

                        let outlineContainer = h("div", { id: (count + 1).toString(), title: direction }, verticalWrapperHeader, verticalWrapper);
                        outlineContainer.style.textIndent = (count).toString() + `rem`;

                        let isShown = true;

                        verticalWrapperHeader.onclick = () => {
                            isShown = !isShown;
                            OutlineContainerCollapse(isShown, verticalWrapper, collapseBtn, contentContainer, verticalWrapperHeader, outlineContainer);
                        }

                        verticalWrapperHeader.oncontextmenu = (event) => {
                            event.preventDefault();
                            internalSystem.StandardContextMenu.handler(verticalWrapperHeader, (menu) => {
                                menu.add("Delete " + direction, () => {
                                    // update exist els and array
                                    outlineContainer.remove();
                                    let parent = contentContainer.parentElement;
                                    let childrenIdx = [...contentContainer.parentElement!.children].indexOf(contentContainer);
                                    // CommandAction.delete(contentContainer, outlineContainer, wrapperIdx, wrapperIdx, parent!, childrenIdx);
                                });
                            });
                        }

                        let container = new LayoutGUI(direction, "", 0, "");

                        DraggableSortedOrder.getInstance().addPreviewWindowEl(contentContainer, container);
                        DraggableSortedOrder.getInstance().reorderPreviewWindow(contentContainer);
                        DraggableSortedOrder.getInstance().reorderOutline(outlineContainer);

                        h(outlineWrapper, {}, outlineContainer);

                        DraggableSortedOrder.getInstance().addOutline(outlineContainer);

                        CheckAcceptance.getInstance().checkAll(c, contentContainer);

                        createChildrenHTML(c, contentContainer, verticalWrapper, count + 1);

                    }

                    else if (c instanceof LayoutBlock) {

                        switch (c.type()) {

                            case "text":
                                let editable = true;
                                if (c.editable() == "false") {
                                    editable = false;
                                }

                                let text = new TextGUI(c.content()!.content(), editable.toString(), c.instruction()!, c.name(), "text", count + 1);

                                WordCount.getInstance().wordCountAry().set(text.el(), 0);

                                h(contentWrapper, {}, text.el());

                                DraggableSortedOrder.getInstance().addPreviewWindowEl(text.el(), text);

                                DraggableSortedOrder.getInstance().reorderPreviewWindow(text.el());

                                let textOutline = Outline.getInstance().createSingleOutline(c.name()!, count + 1, text);

                                DraggableSortedOrder.getInstance().reorderOutline(textOutline);

                                DraggableSortedOrder.getInstance().addOutline(textOutline);

                                h(outlineWrapper, {}, textOutline);

                                Outline.getInstance().scrollToView(text.el());

                                break;

                            case "image":

                                let image = new ImageGUI("true", c.instruction()!, c.name()!, "image", count + 1, c.size(), c.extension());

                                h(contentWrapper, {}, image.el());

                                DraggableSortedOrder.getInstance().addPreviewWindowEl(image.el(), image);

                                DraggableSortedOrder.getInstance().reorderPreviewWindow(image.el());

                                let imgOutline = Outline.getInstance().createSingleOutline(c.name()!, count + 1, image);

                                DraggableSortedOrder.getInstance().addOutline(imgOutline);

                                h(outlineWrapper, {}, imgOutline);

                                DraggableSortedOrder.getInstance().reorderOutline(imgOutline);

                                Outline.getInstance().scrollToView(image.el());

                                break;

                            case "button":

                                let button = new ButtonGUI("button", "button", 0);

                                h(contentWrapper, {}, button.el());

                                DraggableSortedOrder.getInstance().addPreviewWindowEl(button.el(), button);

                                DraggableSortedOrder.getInstance().reorderPreviewWindow(button.el());

                                let buttonOutline = Outline.getInstance().createSingleOutline(c.name()!, count + 1, button);

                                DraggableSortedOrder.getInstance().addOutline(buttonOutline);

                                h(outlineWrapper, {}, buttonOutline);

                                DraggableSortedOrder.getInstance().reorderOutline(buttonOutline);

                                Outline.getInstance().scrollToView(button.el());

                                break;
                        }
                    }
                });
            }
        }
    }

    // when choose the empty layout
    else if (l = "none") {
        // clear the exist array since there is nothing in the array
        DraggableSortedOrder.getInstance().existOutline.splice(0, DraggableSortedOrder.getInstance().existOutline.length);
        DraggableSortedOrder.getInstance().existPwWidgets.splice(0, DraggableSortedOrder.getInstance().existPwWidgets.length);
        // DropToOutline.getInstance().dragFromPanel(WidgetPickerGUI.getInstance().getExistWidgetsTypes());
    }
}