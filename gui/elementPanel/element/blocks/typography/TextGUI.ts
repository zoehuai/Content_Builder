import { createClass as cls } from "../../../../../commons/lib/css/create";
import { html as h } from "../../../../../commons/lib/dom/create";
import { mdIcon, MD_TEXT_FIELDS } from "../../../../../commons/lib/icons/material-design-icons";
import { DraggableSortedOrder } from "../../../../interactions/DraggableSortedOrder";
import { WordCount } from "../../../../previewWindow/bottomInfoBar/WordCount";
import { Outline } from "../../../../outline/Outline";
import { BottomInfoBar } from "../../../../previewWindow/bottomInfoBar/BottomInfoBar";
import { WidgetGUI } from "../WidgetGUI";
import { CommandAction } from "../../../../interactions/undo/CommandAction";
import { ReturnNewText } from "./ReturnNewText";

const _textFieldStyle = cls({
    border: `0.1px solid transparent`,
    display: "flex",
    width: "100%",
    color: "var(--fg)",
    fontSize: "16px",
    fontFamily: "Lato",
    overflow: "hidden",
    minWidth: "150px",
    padding: "3px",
    lineHeight: "20px",
    backgroundColor: "var(--bg--dim)",
    resize: "none",
    "&:hover": {
        cursor: "pointer",
    },
    "&:focus": {
        height: "100%",
        outline: "none",
        border: "0.1px solid var(--tone)",
    },
})

const _icon = cls({
    color: "white",
    position: "relative",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    margin: "auto",
})

export class TextGUI extends WidgetGUI {

    private _contentText: string;
    private _editable: string;
    private _instruction: string;
    private _clickCount: number;
    private _selected: boolean;
    private checkElOnBlur: boolean | undefined;
    private checkInputOnBlur: boolean | undefined;
    private _textInput: HTMLTextAreaElement;

    constructor(content: string, editable: string, instruction: string, name: string, type: string, count: number) {
        super(name, type, count);
        this._type = type;
        this._contentText = content;
        this._name = name;
        this._editable = editable;
        this._instruction = instruction;

        this._clickCount = 0;
        this._selected = false;
        this._textInput = h("textarea", { class: _textFieldStyle, placeholder: this._instruction });
        this._el.style.outline = "none";
        this._el.style.height = "46px";

        if (this._contentText) {
            this._textInput.innerText = this._contentText;
        }

        switch (this._name) {
            case "h1":
                this._textInput.style.fontSize = "42px";
                this._textInput.style.height = "52px";
                this._textInput.style.lineHeight = "44px";
                this._textInput.style.marginBottom = "inherit";
                this._textInput.placeholder = "Heading 1";
                this._type = "Heading 1";
                break;
            case "h2":
                this._textInput.style.fontSize = "35px";
                this._textInput.style.height = "46px";
                this._textInput.style.lineHeight = "35px";
                this._textInput.style.margin = "inherit";
                this._textInput.placeholder = "Heading 2";
                this._type = "Heading 2";

                break;
            case "h3":
                this._textInput.style.fontSize = "29px";
                this._textInput.style.height = "46px";
                this._textInput.style.lineHeight = "29px";
                this._textInput.style.margin = "inherit";
                this._textInput.placeholder = "Heading 3";
                this._type = "Heading 3";

                break;
            case "h4":
                this._textInput.style.fontSize = "26px";
                this._textInput.style.height = "46px";
                this._textInput.style.lineHeight = "26px";
                this._textInput.style.margin = "inherit";
                this._textInput.placeholder = "Heading 4";
                this._type = "Heading 4";

                break;
            case "p":
                this._textInput.style.fontSize = "16px";
                this._textInput.style.height = "46px";
                this._textInput.style.lineHeight = "16px";
                this._textInput.style.margin = "inherit";
                this._textInput.placeholder = "Paragraph";
                this._type = "Paragraph";

            default:
                this._type = "Paragraph";
        }

        let textIcon = mdIcon(MD_TEXT_FIELDS);

        let icon = h("div", { class: _icon }, textIcon);

        h(this._textInput, {}, icon);

        this._el.onclick = () => {
            this.handleOnClick();
            this._el.style.borderColor = "var(--input-active)";
        }

        this._el.onblur = () => {
            this.handleOnBlur();
        }

        this._textInput.onblur = () => {
            this.handleOnBlur();
        }
        h(this._el, {}, this._textInput);

        this._textInput.onkeyup = (e) => {
            if (e.key == "Enter") {
                let parent = this._el.parentElement;
                ReturnNewText(this._type, parent!, this._el);
            }
        }
    }

    handleOnClick() {
        // Our Timeout, modify it if you need
        let timeout = 250;
        this._clickCount++;
        if (this._clickCount == 1) {
            setTimeout(() => {
                if (this._clickCount == 1) {

                    this._textInput.disabled = true;
                    this._el.style.borderColor = "var(--input-active)";
                    this._el.focus();
                    this._selected = true;
                    this._el.onkeyup = (e) => {
                        if (this._selected) {
                            if (e.key == "Backspace") {
                                let parent = this._el.parentElement;
                                let childrenIdx = [...parent!.children].indexOf(this._el);

                                this._el.remove();

                                let idx = DraggableSortedOrder.getInstance().existPwWidgets.indexOf(this._el);

                                DraggableSortedOrder.getInstance().existOutline[idx].remove();

                                DraggableSortedOrder.getInstance().existPwWidgets.splice(idx, 1);

                                let outlineEl = DraggableSortedOrder.getInstance().existOutline[idx];

                                DraggableSortedOrder.getInstance().existOutline.splice(idx, 1);

                                if ((idx == DraggableSortedOrder.getInstance().existOutline.length) || (DraggableSortedOrder.getInstance().existOutline[idx - 1].title == "Horizontal" || DraggableSortedOrder.getInstance().existOutline[idx - 1].title == "Vertical") && (DraggableSortedOrder.getInstance().existOutline[idx - 1].id >= DraggableSortedOrder.getInstance().existOutline[idx].id)) {

                                    // console.log("compound delete case:");

                                    // console.log(DraggableSortedOrder.getInstance().existOutline[idx - 1]);

                                    // console.log(DraggableSortedOrder.getInstance().existPwWidgets[idx - 1]);

                                    DraggableSortedOrder.getInstance().existOutline[idx - 1].remove();

                                    DraggableSortedOrder.getInstance().existPwWidgets[idx - 1].remove();

                                    CommandAction.delete(this._el, outlineEl, idx, idx, parent!, childrenIdx, DraggableSortedOrder.getInstance().existPwWidgets[idx - 1], DraggableSortedOrder.getInstance().existOutline[idx - 1]);

                                    DraggableSortedOrder.getInstance().existPwWidgets.splice(idx - 1, 1);

                                    DraggableSortedOrder.getInstance().existOutline.splice(idx - 1, 1);

                                } else {
                                    CommandAction.delete(this._el, outlineEl, idx, idx, parent!, childrenIdx);
                                }

                                DraggableSortedOrder.getInstance().existOutline.forEach((el: HTMLElement) => {
                                    Outline.getInstance().addToChild(el);
                                });
                                this._selected = false;
                            }
                        }
                    }

                    BottomInfoBar.getInstance().setEachInfo(this._name, this._type, this._editable);
                    if (this._editable == "true") {
                        BottomInfoBar.getInstance().setWordCount(WordCount.getInstance().countWord(this._textInput.value, this._el).toString());
                    } else {
                        BottomInfoBar.getInstance().clearWordCount();
                    }

                } else {

                    this._textInput.disabled = false;
                    if (this._editable == "false") {
                        this._textInput.style.userSelect = "none";
                        this._textInput.disabled = true;
                        this._el.style.userSelect = "none";
                        internalSystem.notification(`This block is not editable`, { type: "warning" });
                    }

                    this._el.style.borderColor = "transparent";
                    this._selected = false;
                    this._textInput.focus();

                    BottomInfoBar.getInstance().setEachInfo(this._name, this._type, this._editable);

                    if (this._editable == "true") {
                        BottomInfoBar.getInstance().setWordCount(WordCount.getInstance().countWord(this._textInput.value, this._el).toString());
                    }

                    this._textInput.oninput = () => {
                        this._el.onclick = null;
                        this._textInput.onmousedown = (event: { stopPropagation: () => void; }) => {
                            event.stopPropagation();
                        };

                        BottomInfoBar.getInstance().onWordChange(WordCount.getInstance().countWord(this._textInput.value, this._el));
                        this._el.style.removeProperty("height");
                        this._textInput.style.removeProperty("height");
                        this._el.style.height = this._textInput.scrollHeight + "px";
                        this._textInput.style.height = this._el.style.height + "px";
                        this._textInput.style.overflowY = "hidden";
                    }
                }
                this._clickCount = 0;
            }, timeout);
        }
        onfocusHighlight(this._el);
    }

    handleOnBlur() {
        this._textInput.onmousedown = null;
        this._el.onclick = () => this.handleOnClick();
        this._el.style.borderColor = "var(--bg-dim)";
        BottomInfoBar.getInstance().setEachInfo("-", "-", "-");
        BottomInfoBar.getInstance().clearWordCount();
        WordCount.getInstance().wordOverall();
    }

    el(): HTMLDivElement {
        return this._el;
    }

    focusEl(): HTMLTextAreaElement {
        return this._textInput;
    }

    contentText(): string {
        return this._contentText;
    }

    editable(): string {
        return this._editable;
    }

    instruction(): string {
        return this._instruction;
    }
}

export function onfocusHighlight(highlightEl: HTMLElement): void {
    let idx = DraggableSortedOrder.getInstance().existPwWidgets.indexOf(highlightEl);
    // DraggableSortedOrder.getInstance().existOutline[idx].focus();
    DraggableSortedOrder.getInstance().existOutline.forEach((el: HTMLElement) => {
        el.style.backgroundColor = "var(--bg)";
    })
    DraggableSortedOrder.getInstance().existOutline[idx].style.backgroundColor = "var(--input-active)";

}