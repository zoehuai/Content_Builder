import { createClass as cls } from "../../../../../commons/lib/css/create";
import { html as h } from "../../../../../commons/lib/dom/create";
import { mdIcon, MD_IMAGE } from "../../../../../commons/lib/icons/material-design-icons";
import { DraggableSortedOrder } from "../../../../interactions/DraggableSortedOrder";
import { CommandAction } from "../../../../interactions/undo/CommandAction";
import { Outline } from "../../../../outline/Outline";
import { BottomInfoBar } from "../../../../previewWindow/bottomInfoBar/BottomInfoBar";
import { onfocusHighlight } from "../typography/TextGUI";
import { WidgetGUI } from "../WidgetGUI";

const _icon = cls({
    color: "var(--bg--dim)",
    position: "relative",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    margin: "auto",
    cursor: "pointer",
})

const IMAGE = "image";

/* 
**  The widget is to generate an image widget.
*/
export class ImageGUI extends WidgetGUI {

    private _imageDiv: HTMLDivElement;
    private _editable: string;
    private _clickCount: number;
    private _selected: boolean;
    private _checkElOnBlur: boolean | undefined;
    private _input: HTMLInputElement;
    private _checkInputOnBlur: boolean | undefined;
    private _dataURI!: string | null | ArrayBuffer;
    private _instruction: string;
    private _size: number | undefined;
    private _extension: string[] | undefined;

    constructor(editable: string, instruction: string, name: string, type: string, count: number, size?: number, extension?: string[]) {
        super(name, type, count);
        this._name = name;
        this._instruction = instruction;
        this._editable = editable;
        this._type = IMAGE;
        this._size = size;
        this._extension = extension;

        let imgIcon = mdIcon(MD_IMAGE);
        let icon = h("div", { class: _icon }, imgIcon);
        this._clickCount = 0;
        this._selected = false;
        this._el.style.width = "100%";
        this._el.style.height = "100px";
        this._el.style.display = "flex";
        this._el.style.backgroundColor = "var(--bg--dim)";
        this._el.style.outline = "none";

        this._el.onclick = () => {
            this.handleOnClick();
            this._el.style.borderColor = "var(--input-active)";
            onfocusHighlight(this._el);
        }

        //TODO: test image size uploading and how it will display when horizontal

        // Upload the image to the widget
        let getImage = () => {

            let file = this._input!.files![0];

            let reader = new FileReader();
            this._dataURI;

            reader.addEventListener("load", () => {
                this._dataURI = reader.result;
                var image = new Image();
                image.src = reader.result as string;
                image.onload = () => {
                    // this._imageDiv.style.height = image.height + "px";
                    this._imageDiv.style.height = "100px";
                    // this._imageDiv.style.width = image.width + "px";
                    this._el.style.height = "100%";
                    // this._el.style.height = image.height + "px";
                    this._imageDiv.style.width = "inherit";

                    // this._el.style.paddingTop = image.height + "px";
                    // this._imageDiv.style.aspectRatio = "1/1";
                }
                this._imageDiv.style.backgroundImage = `url(${this._dataURI})`;
                this._imageDiv.style.backgroundSize = "contain";
                this._imageDiv.style.backgroundRepeat = "no-repeat";
                this._imageDiv.style.backgroundPosition = "center";
                icon.style.display = "none";
            }
            );

            if (file) {
                reader.readAsDataURL(file);
            }
        };

        this._input = h("input", { accept: "image/*", type: "file", style: { display: "none" }, oninput: getImage });
        this._imageDiv = h("div", {}, h("label", {}, icon), this._input);
        this._imageDiv.style.margin = "auto";
        this._imageDiv.style.top = "0";
        this._imageDiv.style.bottom = "0";
        this._imageDiv.style.left = "0";
        this._imageDiv.style.right = "0";

        this._imageDiv.onmousedown = (event) => {
            event.stopPropagation();
        };

        h(this._el, {}, this._imageDiv);

        this._el.onblur = () => this.handleOnBlur();

        this._imageDiv.onblur = () => {
            this._checkElOnBlur = true;
            this._checkInputOnBlur = true;
            this.handleOnBlur();
        }
    }

    el(): HTMLDivElement {
        return this._el;
    }

    focusEl(): HTMLDivElement {
        return this._el;
    }

    editable(): string {
        return this._editable;
    }

    instruction(): string {
        return this._instruction;
    }

    size(): number {
        return this._size!;
    }

    extension(): string[] {
        return this._extension!;
    }

    // single click for selecting and reordering, double click for edit or upload the image
    handleOnClick() {

        let timeout = 250;
        this._clickCount++;
        if (this._clickCount == 1) {
            setTimeout(() => {
                if (this._clickCount == 1) {
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

                                    DraggableSortedOrder.getInstance().existOutline[idx - 1].remove();

                                    DraggableSortedOrder.getInstance().existPwWidgets[idx - 1].remove();

                                    CommandAction.delete(this._el, outlineEl, idx, idx, parent!, childrenIdx, DraggableSortedOrder.getInstance().existPwWidgets[idx - 1], DraggableSortedOrder.getInstance().existOutline[idx - 1]);

                                    DraggableSortedOrder.getInstance().existPwWidgets.splice(idx - 1, 1);

                                    DraggableSortedOrder.getInstance().existOutline.splice(idx - 1, 1);
                                }
                                else {
                                    CommandAction.delete(this._el, outlineEl, idx, idx, parent!, childrenIdx);
                                }

                                DraggableSortedOrder.getInstance().existOutline.forEach((el: HTMLElement) => {
                                    Outline.getInstance().addToChild(el);
                                });

                                this._selected = false;
                            }
                        }
                    }
                } else {
                    this._el.style.borderColor = "transparent";
                    this._input.click();
                    this._checkInputOnBlur = false;
                    this._selected = false;
                    this._imageDiv.focus();
                }
                this._clickCount = 0;
            }, timeout);
            BottomInfoBar.getInstance().setEachInfo(this._name, this._type, this._editable);
            BottomInfoBar.getInstance().clearWordCount();
        }
    }

    handleOnBlur() {
        this._imageDiv.onmousedown = null;
        this._el.onclick = () => this.handleOnClick();
        this._el.style.borderColor = "var(--bg-dim)";
        BottomInfoBar.getInstance().setEachInfo("-", "-", "-");
        BottomInfoBar.getInstance().clearWordCount();
    }

}