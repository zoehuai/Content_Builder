import { createClass as cls } from "../../../commons/lib/css/create";
import { html as h } from "../../../commons/lib/dom/create";
import { Horizontal } from "../../../model/template/layout/Horizontal";
import { LayoutBlock } from "../../../model/template/layout/LayoutBlock";
import { LayoutContainer } from "../../../model/template/layout/LayoutContainer";
import { Vertical } from "../../../model/template/layout/Vertical";
import { ButtonGUI } from "../../elementPanel/element/blocks/interaction/ButtonGUI";
import { ImageGUI } from "../../elementPanel/element/blocks/media/ImageGUI";
import { TextGUI } from "../../elementPanel/element/blocks/typography/TextGUI";
import { Outline } from "../../outline/Outline";
import { BottomInfoBar } from "../../previewWindow/bottomInfoBar/BottomInfoBar";
import { WordCount } from "../../previewWindow/bottomInfoBar/WordCount";
import { DraggableSortedOrder } from "../DraggableSortedOrder";
import { CheckAcceptance } from "../prevention/CheckAcceptance";

const _contentContainer = cls({
    border: "1px solid transparent",
    "&:focus": {
        border: "1px solid var(--input-active)",
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

export function ParseLayoutCompoundBlockXml(layoutContainer: LayoutContainer, contentWrapper: HTMLElement, outlineWrapper: HTMLElement, count: number, outlineLayoutAry: HTMLDivElement[], pwLayoutAry: HTMLDivElement[]) {

    if (layoutContainer.children) {
        layoutContainer.children.forEach(function (c) {
            if (c instanceof Vertical || c instanceof Horizontal) {
                let direction = c.constructor.name;

                let contentContainer = h("div", { class: _contentContainer, id: "a" + count.toString() });
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

                    verticalWrapper.style.display = isShown ? "block" : "none";
                    collapseBtn.innerText = isShown ? "-" : "+";

                    BottomInfoBar.getInstance().setEachInfo(direction, direction, "true");

                    BottomInfoBar.getInstance().clearWordCount();

                    contentContainer.focus();

                    DraggableSortedOrder.getInstance().existOutline.forEach((outline: HTMLElement) => {
                        outline.style.backgroundColor = "var(--bg)";
                        if (outline.children.length > 0) {
                            for (let i = 0; i < outline.children.length; i++) {
                                let outlineChildren = outline.children[i] as HTMLElement;
                                outlineChildren.style.backgroundColor = "var(--bg)";
                            }
                        }
                    })

                    verticalWrapperHeader.style.backgroundColor = "var(--input-active)";
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
                }

                verticalWrapperHeader.oncontextmenu = (event) => {
                    event.preventDefault();
                    internalSystem.StandardContextMenu.handler(verticalWrapperHeader, (menu) => {
                        menu.add("Delete " + direction, () => {
                            // update exist array
                            outlineContainer.remove();
                        });
                    });
                }

                collapseBtn.onclick = () => {

                }

                DraggableSortedOrder.getInstance().reorderPreviewWindow(contentContainer);

                outlineLayoutAry!.push(outlineContainer);
                pwLayoutAry.push(contentContainer);

                // FIXME: might have some issues there, dunno which line below should be considered
                DraggableSortedOrder.getInstance().addOutline(outlineContainer);
                DraggableSortedOrder.getInstance().reorderOutline(outlineContainer);

                CheckAcceptance.getInstance().checkAll(c, contentContainer);
                ParseLayoutCompoundBlockXml(c, contentContainer, verticalWrapper, count + 1, outlineLayoutAry, pwLayoutAry);

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

                        DraggableSortedOrder.getInstance().reorderPreviewWindow(text.el());

                        let textOutline = Outline.getInstance().createSingleOutline(c.name()!, count + 1, text);

                        DraggableSortedOrder.getInstance().addOutline(textOutline);

                        outlineLayoutAry!.push(textOutline);
                        pwLayoutAry.push(text.el());

                        Outline.getInstance().scrollToView(text.el());

                        break;

                    case "image":

                        let image = new ImageGUI("true", c.instruction()!, c.name()!, "image", count + 1, c.size(), c.extension());

                        h(contentWrapper, {}, image.el());

                        DraggableSortedOrder.getInstance().reorderPreviewWindow(image.el());

                        let imgOutline = Outline.getInstance().createSingleOutline(c.name()!, count + 1, image);

                        DraggableSortedOrder.getInstance().addOutline(imgOutline);

                        outlineLayoutAry!.push(imgOutline);

                        pwLayoutAry.push(image.el());

                        Outline.getInstance().scrollToView(image.el());

                        break;

                    case "button":

                        let button = new ButtonGUI("button", "button", 0);

                        WordCount.getInstance().wordCountAry().set(button.el(), 0);

                        h(contentWrapper, {}, button.el());

                        DraggableSortedOrder.getInstance().reorderPreviewWindow(button.el());

                        let buttonOutline = Outline.getInstance().createSingleOutline(c.name()!, count + 1, button);

                        DraggableSortedOrder.getInstance().addOutline(buttonOutline);

                        outlineLayoutAry!.push(buttonOutline);

                        pwLayoutAry.push(button.el());

                        Outline.getInstance().scrollToView(button.el());

                        break;
                }
            }
        });
    }
}