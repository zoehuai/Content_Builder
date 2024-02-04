import { createClass as cls } from "../../../../commons/lib/css/create";
import { html as h } from "../../../../commons/lib/dom/create";

const _textFieldStyle = cls({
    display: "flex",
    cursor: "pointer",
    position: "relative",
    width: "100%",
    marginTop: "5px",
    border: "0.1px solid var(--bg-dim)",
    "&:hover": {
        border: "0.1px solid var(--input-active)",
    },
    "&:focus": {
        border: "0.1px solid var(--input-active)",
    },
})

/* 
 **   The widget is the parent of the different types of widgets.e.g.text, image, button, layout etc. 
 **   All the widgets inherit from this class.
*/
export class WidgetGUI {
    protected _el: HTMLDivElement;
    protected _type: string;
    protected _name: string;
    protected _count: number;

    constructor(name: string, type: string, count: number) {
        this._type = type;
        this._name = name;

        //count for define which layer the container are at
        this._count = count;
        this._el = h("div", { class: _textFieldStyle, id: "a" + this._count!.toString(), title: this._type.toString() });
        this._el.tabIndex = 0;

        this._el.ondragenter = (event) => {
            event.preventDefault();
        }

        this._el.onclick = () => {
            this.handleOnClick();
        }

    }

    el(): HTMLDivElement {
        return this._el;
    }

    focusEl() {
    }

    handleOnClick() {
    }

    handleOnBlur() {
    }

    contentText() {
    }

    editable() {
    }

    instruction() {
    }

    size() {
    }

    extension() {
    }

    typeName(): string {
        return this._type;
    }

    name(): string {
        return this._name;
    }
}