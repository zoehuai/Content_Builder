import { createClass as cls } from "../../commons/lib/css/create";
import { html as h } from "../../commons/lib/dom/create";
import { FileUploader } from "../interactions/fileUploader/FileUploader";
import { clear } from "../../commons/lib/dom/clear";
import { TopMenuBar } from "./topMenuBar/TopMenuBar";
import { BottomInfoBar } from "./bottomInfoBar/BottomInfoBar";
import { PreviewWindowInitial } from "./PreviewWindowInitial";

const _previewWindow = cls({
    border: `0.5px solid grey`,
    width: "100%",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    overflowY: "auto",
});

export class PreviewWindow {

    private _previewWindow: HTMLDivElement;
    private static _pw: PreviewWindow;
    private _previewWindowWrapper: HTMLDivElement;

    private constructor() {
        this._previewWindow = h("div", { class: _previewWindow });

        this._previewWindowWrapper = h("div", { style: { display: "flex", flexDirection: "column", width: "75%", margin: "0.5rem" } });

        TopMenuBar.getInstance().addToParent(this._previewWindowWrapper);

        h(this._previewWindow, {}, PreviewWindowInitial.getInstance().uploadEffect);
        h(this._previewWindowWrapper, {}, this._previewWindow);

        BottomInfoBar.getInstance().addToParent(this._previewWindowWrapper);

    }

    static getInstance(): PreviewWindow {
        if (PreviewWindow._pw == null) {
            PreviewWindow._pw = new PreviewWindow();
        }
        return PreviewWindow._pw;
    }

    previewWindowWrapper() {
        return this._previewWindowWrapper;
    }

    el() {
        return this._previewWindow;
    }

    addToParent(parent: HTMLElement) {
        h(parent, {}, this._previewWindow);
    }

    addToChild(child: HTMLElement) {
        h(this._previewWindow, {}, child);
    }

    fileUploadStyle() {
        this._previewWindow.style.border = "2px dotted var(--accent-success-active)";
    }

    fileUploadCancelStyle() {
        this._previewWindow.style.border = "1px solid grey";
        PreviewWindowInitial.getInstance().cancelStyle();
    }
    
    // todo: add comment for usage
    removeClassList() {
        this._previewWindow.classList.remove("active");
    }

    clearPreviewWindow() {
        clear(this._previewWindow);
        this._previewWindow.style.border = "0.5px solid grey";
    }

    checkOndragenter() {
        this._previewWindow.ondragover = (event) => {
            //preventing from default behavior
            event.preventDefault();
            FileUploader.getInstance().uploadXml();
            PreviewWindowInitial.getInstance().dragFileStyle();
        }
        
        this._previewWindow.ondragleave = (event) => {
            event.preventDefault();
            this.fileUploadCancelStyle();
            PreviewWindowInitial.getInstance().dragFileLeaveStyle();
        }
    }
}