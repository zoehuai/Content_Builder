import { html as h } from "../../../commons/lib/dom/create";
import { clear } from "../../../commons/lib/dom/clear";
import { WordCount } from "./WordCount";

export class BottomInfoBar {

    private _el: HTMLDivElement;
    private _name?: HTMLDivElement;
    private _type?: HTMLDivElement;
    private _editable?: HTMLDivElement;
    private _wordCount?: HTMLDivElement;
    private static _bib: BottomInfoBar;
    private _wordOverall: number;

    private constructor() {

        this._el = h("div", { style: { display: "grid", gridAutoFlow: "column", gridTemplateColumns: "1fr 1fr 1fr 1fr", border: "0.5px solid grey", borderTop: "0px", padding: "3px", } });
        this._name = h("div", { style: { marginRight: "0.5rem", color: "var(--icon)", userSelect: "none" }, title: "The name of the block or layout" });
        this._name.innerText = "Name: -";
        this._type = h("div", { style: { marginRight: "0.5rem", color: "var(--icon)", userSelect: "none" }, title: "The type of the block or layout" });
        this._type.innerText = "Type: -";
        this._editable = h("div", { style: { marginRight: "0.5rem", color: "var(--icon)", userSelect: "none" }, title: "The block or layout could be edited or not" });
        this._editable.innerText = "Editable: -";
        this._wordCount = h("div", { style: { marginRight: "0.5rem", color: "var(--icon)", userSelect: "none" }, title: "The number of words in the block" });
        this._wordCount.innerText = "Word Count: -";
        this._wordOverall = 0;

        h(this._el, {}, this._name, this._type, this._editable, this._wordCount,);
    }

    static getInstance(): BottomInfoBar {
        if (BottomInfoBar._bib == null) {
            BottomInfoBar._bib = new BottomInfoBar();
        }
        return BottomInfoBar._bib;
    }

    getBottomInfoBar() {
        return this._el;
    }

    setEachInfo(name: string, type: string, editable: string) {
        clear(this._name!);
        h(this._name!, {}, "Name: " + name);

        clear(this._type!);
        h(this._type!, {}, "Type: " + type);

        clear(this._editable!);
        if (editable == null) {
            h(this._editable!, {}, "Editable: -");

        } else if (editable == "false") {
            h(this._editable!, {}, "Editable: No");
        }
        else if (editable == "true") {
            h(this._editable!, {}, "Editable: Yes");
        }
        else {
            h(this._editable!, {}, "Editable: -");
        }
    }

    setName(name: string) {
        clear(this._name!);
        h(this._name!, {}, "Name: " + name);
    }

    setType(type: string) {
        clear(this._type!);
        h(this._type!, {}, "Type: " + type);
    }

    setEditable(editable: string) {
        clear(this._editable!);
        if (editable == null) {
            h(this._editable!, {}, "Editable: -");

        } else if (editable == "false") {
            h(this._editable!, {}, "Editable: No");
        }
        else if (editable == "true") {
            h(this._editable!, {}, "Editable: Yes");
        }
        else {
            h(this._editable!, {}, "Editable: -");
        }
    }

    setWordCount(count: string) {
        clear(this._wordCount!);
        if (count == null) {
            h(this._wordCount!, {}, "Word Count: -");
        } else if (count == "false") {
            h(this._wordCount!, {}, "Word Count:");
        }
        else {
            h(this._wordCount!, {}, `Word Count: ${count} words`);
        }
    }

    clearWordCount() {
        clear(this._wordCount!);
        h(this._wordCount!, {}, "Word Count: -");
    }

    addToParent(parent: HTMLElement) {
        h(parent, {}, this._el);
    }

    onWordChange(count: number) {
        clear(this._wordCount!);
        if (count > 0) {
            h(this._wordCount!, {}, `Word Count: ${count} words`);
        }
    }
    
    wordCountEl() {
        return this._wordCount;
    }
    
}