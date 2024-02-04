import { createClass as cls } from "../../../../../commons/lib/css/create";
import { html as h } from "../../../../../commons/lib/dom/create";
import { Blocks } from "../../../../../model/template/components/Blocks";
import { LayoutCompoundBlocks } from "../../../../../model/template/components/LayoutCompoundBlocks";
import { BottomInfoBar } from "../../../../previewWindow/bottomInfoBar/BottomInfoBar";
import { WordCount } from "../../../../previewWindow/bottomInfoBar/WordCount";
import { WidgetGUI } from "../WidgetGUI";
import { onfocusHighlight } from "./TextGUI";

const _elFieldStyle = cls({
    border: `0.1px solid var(--bg-dim)`,
    "&:focus": {
        outline: "none",
        borderColor: "var(--input-active)",
    },
})

const LAYOUT = "layout";

const _contentContainer = cls({
    border: `2px dotted pink`,
    cursor: "pointer",
    width: "100%",
    height: "50px",
    textAlign: "center",
    fontSize: "25px",
    color: "pink",
    "&:focus": {
        border: "1px solid var(--input-active)",
    }
})

/**
 * This class is used to set up a compound block which including several blocks with specific rules.
*/
export class LayoutGUI extends WidgetGUI {
    private _instruction: string;
    private _component: LayoutCompoundBlocks | Blocks | undefined;
    private _clickCount: number;
    private _selected: boolean;
    private _editable: string;

    constructor(name: string, type: string, count: number, instruction: string, component?: LayoutCompoundBlocks | Blocks) {
        super(name, type, count);
        this._type = LAYOUT;
        this._name = name;
        this._instruction = instruction;
        this._component = component;
        this._clickCount = 0;
        this._selected = false;
        this._editable = "true";
        this._el = h("div", { class: _elFieldStyle, id: "a" + count.toString(), title: "layout" });
        this._el.tabIndex = 0;

        if (name == "Horizontal" || name == "Vertical") {
            this._el = h("div", { class: _contentContainer, id: "a" + count.toString(), title: "empty layout" }, name);
        }

        this._el.ondragenter = (event) => {
            event.preventDefault();
        }

        this._el.onblur = () => {
            this.handleOnBlur();
        }
    }

    handleOnClick() {
        let timeout = 250;
        this._clickCount++;
        if (this._clickCount == 1) {
            setTimeout(() => {
                if (this._clickCount == 1) {
                    this._el.style.borderColor = "var(--input-active)";
                    this._el.focus();
                    this._selected = true;

                } else {
                    this._el.style.borderColor = "transparent";
                    this._el.style.pointerEvents = "auto";
                    this._selected = false;

                    // Disable dragging the box.

                }
                this._clickCount = 0;
            }, timeout);

            BottomInfoBar.getInstance().setEachInfo(this._name, this._type, this._editable);
            BottomInfoBar.getInstance().clearWordCount();
        }
        onfocusHighlight(this._el);
    }

    handleOnBlur() {
        this._el.onclick = () => this.handleOnClick();
        this._el.style.borderColor = "var(--bg-dim)";
        BottomInfoBar.getInstance().setEachInfo("-", "-", "-");
        BottomInfoBar.getInstance().clearWordCount();
        WordCount.getInstance().wordOverall();
    }

    instruction(): string {
        return this._instruction;
    }

    editable(): string {
        return this._editable;
    }

}