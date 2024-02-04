import { createClass as cls } from "../../../../../commons/lib/css/create";
import { html as h } from "../../../../../commons/lib/dom/create";
import { DraggableSortedOrder } from "../../../../interactions/DraggableSortedOrder";
import { CommandAction } from "../../../../interactions/undo/CommandAction";
import { Outline } from "../../../../outline/Outline";
import { BottomInfoBar } from "../../../../previewWindow/bottomInfoBar/BottomInfoBar";
import { onfocusHighlight } from "../typography/TextGUI";
import { WidgetGUI } from "../WidgetGUI";

const _buttonStyle = cls({
    border: "none",
    width: "200px",
    height: "35px",
    backgroundColor: "var(--tone)",
    borderRadius: "3px",
    color: 'var(--fg)',
    fontSize: "18px",
    fontFamily: "Roboto",
    fontWeight: "normal",
    padding: "0px",
    cursor: "pointer",
    userSelect: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:focus": {
        outline: 'none',
    },
});

const _titleChange = cls({
    cursor: "pointer",
    fontFamily: "Lato",
    fontWeight: "bold",
    border: "none",
    backgroundColor: "var(--tone)",
    color: "var(--fg)",
    width: "100%",
    fontSize: "18px",
    textAlign: "center",
    "&:focus": {
        outline: 'none',
    },
});

const _textFieldStyle = cls({
    display: "flex",
    border: `0.1px solid transparent`,
    width: "100%",
    height: "100px",
    alignItems: "center",
    justifyContent: "center",
    backgroundPosition: "center",
    backgroundSize: "cover",
    "&:focus": {
        border: "0.1px solid var(--tone)",
    },
})

const _center = cls({
    marginTop: "85px",
    position: "absolute",
    display: "inline-flex",
    alignItems: "center",
    border: "1px solid var(--tone)",
})

const _buttonContentStyle = cls({
    userSelect: "none",
    border: `1px solid #4FA0FF`,
    width: "90px",
    height: "35px",
    backgroundColor: "var(--code-bg)",
    color: 'white',
    fontSize: "18px",
    fontFamily: "Lato",
    fontWeight: "normal",
    padding: "0px",
    cursor: "pointer",
    userSelectNone: "none",
    display: "flex",
    margin: "auto",
    justifyContent: "center",
    alignItems: "center",
    "&:focus": {
        outline: 'none',
    },
    "&:hover": {
        color: "#666",
    },
});

const _text = cls({
    userSelect: "none",
    fontWeight: "bold",
    cursor: "default",
    display: "flex",
    color: "white",
    margin: "0px",
    marginLeft: "10px",
    marginRight: "10px",
})

const _inputURL = cls({
    border: "0px solid var(--tone)",
    fontWeight: "bold",
    backgroundColor: "var(--code-bg)",
    color: "white",
    height: "35px"
})

const BUTTON = "button";

/* 
** The widget is to generate a button with a hyperlink for the content.
*/
export class ButtonGUI extends WidgetGUI {

    private _button: HTMLButtonElement;
    private _changeInput: HTMLInputElement;
    private _clickCount: number;
    private _layerCount: number;
    private _url: string | undefined;
    private _btnText: string | undefined;
    private inputURL: HTMLInputElement;
    private saveURLBtn: HTMLButtonElement;
    private popupFormURL: HTMLDivElement;
    private btnDiv: HTMLDivElement;

    constructor(name: string, type: string, layerCount: number) {
        super(name, type, layerCount);
        this._name = name;
        this._type = BUTTON;
        this._layerCount = layerCount;
        this._clickCount = 0;

        // wrapper
        this.btnDiv = h("div", { class: _textFieldStyle });

        // change button text
        this._button = h("button", { class: _buttonStyle });
        this._changeInput = h("input", { type: "text", class: _titleChange, value: "Change Me" });

        // create a popup form for editing the button text and link
        this.popupFormURL = h("div", { class: _center, style: "display: none" });
        let webAddress = h("p", { class: _text, style: "fontSize:12px" }, "url:");
        this.inputURL = h("input", { class: _inputURL, type: "text", placeholder: "https://" });
        this.saveURLBtn = h("button", { class: _buttonContentStyle }, "Save");

        this.saveURLBtn.onclick = () => this.saveBtnDisabledEffect();

        this._changeInput.onchange = () => {
            this._btnText = this._changeInput.value;
            this._changeInput.style.color = "var(--fg)";
        };

        this.btnDiv.ondblclick = () => {
            this.popupFormURL.style.display = "inline-flex";
            this._changeInput.focus();
        };

        this.inputURL.onclick = () => {
            this._el.onclick = null;
            this.inputURL.focus();
            this.inputURL.onmousedown = (event: { stopPropagation: () => void; }) => {
                event.stopPropagation();
            };
        }

        this.inputURL.oninput = () => {
            // TODO: read the value and save into the XML file (1. button print out URL + Text to XML

            // FIXME: All Text download not include content
            
            // this._url = this.inputURL.value;
        };

        this.inputURL.onkeyup = (e) => {
            if (e.key == "Enter") {
                this.saveBtnDisabledEffect();
            }
        }

        this._changeInput.onblur = () => {
            if (this._changeInput.value === "") {
                internalSystem.notification("Missing a description for the button.", { type: "error" });
            }
        };

        this._changeInput.onfocus = () => {
            this._changeInput.placeholder = " ";
            this._changeInput.setSelectionRange(0, this._changeInput.value.length);
        };

        h(this.popupFormURL, {}, webAddress, this.inputURL, this.saveURLBtn);

        h(this._button, {}, this._changeInput);

        h(this.btnDiv, {}, this._button, this.popupFormURL);

        h(this._el, {}, this.btnDiv);

    }

    handleOnClick() {
        let timeout = 250;
        this._clickCount++;
        if (this._clickCount == 1) {
            setTimeout(() => {
                if (this._clickCount == 1) {
                    this._el.focus();
                    this._el.onkeyup = (e) => {
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

                            } else {
                                CommandAction.delete(this._el, outlineEl, idx, idx, parent!, childrenIdx);
                            }

                            DraggableSortedOrder.getInstance().existOutline.forEach((el: HTMLElement) => {
                                Outline.getInstance().addToChild(el);
                            });
                        }
                    }
                } else {
                    // double click
                }

                // BottomInfoBar.getInstance().setName(this._name);
                // BottomInfoBar.getInstance().setType(this._type);
                // BottomInfoBar.getInstance().setEditable("true");
                BottomInfoBar.getInstance().setEachInfo(this._name, this._type, "true");
                BottomInfoBar.getInstance().clearWordCount();

                this._clickCount = 0;
            }, timeout);
        }
        onfocusHighlight(this._el);
    }
    saveBtnDisabledEffect() {
        this.popupFormURL.style.display = "none";
    }
}