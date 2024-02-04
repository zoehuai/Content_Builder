import { html as h } from "../../../commons/lib/dom/create";
import { createClass as cls } from "../../../commons/lib/css/create";
import { mdIcon, MD_CHECK_CIRCLE, MD_FILE_DOWNLOAD, MD_FORMAT_LIST_BULLETED, MD_REDO,MD_UNDO } from "../../../commons/lib/icons/material-design-icons";
import { Outline } from "../../outline/Outline";
import { PreviewWindow } from "../PreviewWindow";
import { CommandAction } from "../../interactions/undo/CommandAction";
import { Document } from "../../../model/template/document/Document";

const _el = cls({
    border: "0.5px solid grey",
    borderBottom: "0px",
    display: "flex",
    padding: "3px",
    flexDirection: "row-reverse",
})

const _sendBtn = cls({
    height: "20px",
    border: `0px solid var(--icon)`,
    color: "var(--icon)",
    marginRight: "10px",
    fontSize: 15,
    fontFamily: "Roboto",
    fontWeight: "normal",
    padding: "3px",
    cursor: "pointer",
    userSelect: "none",
    backgroundColor: "var(--bg)",
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:focus": {
        outline: "none",
    },
    "&:hover": {
        backgroundColor: "#202020",
    },
});

const _popup = cls({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    height: "100%",
    width: "100%"
})

const _btnSet = cls({
    display: "flex",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: "auto",
})

const _popupBtn = cls({
    backgroundColor: "var(--bg-active)",
    border: `2px solid var(--separator)`,
    borderRadius: "6px",
    color: 'var(--fg)',
    cursor: "pointer",
    width: "80px",
    height: "30px",
    textTransform: "capitalize",
    margin: "10px",
    fontWeight: "bold",
    "&:active": {
        opacity: 0.8,
    },
    "&:disabled": {
        opacity: 0.5,
        backgroundColor: 'var(--bg)',
    }
})


export class TopMenuBar {

    private _el: HTMLDivElement;
    private static _tmb: TopMenuBar;
    private _saveAsBtnIcon: SVGSVGElement;
    private _saveAsBtn: HTMLButtonElement;
    private _description: HTMLInputElement;

    private constructor() {
        this._el = h("div", { class: _el });
        this._saveAsBtn = h("button", { class: _sendBtn, title: "Download the document", disabled: true });
        this._saveAsBtnIcon = mdIcon(MD_FILE_DOWNLOAD);
        let outlineBtnIcon = h("div", { class: _sendBtn, title: "Outline Display" }, mdIcon(MD_FORMAT_LIST_BULLETED));
        let redo = h("button", { class: _sendBtn, title: "Redo" }, mdIcon(MD_REDO));
        let undo = h("button", { class: _sendBtn, title: "Undo" }, mdIcon(MD_UNDO));
        var current = new Date();
        let autoSaveIcon = mdIcon(MD_CHECK_CIRCLE);
        let autoSave = h("div", { class: _sendBtn, }, autoSaveIcon, " Last update " + current.toLocaleTimeString().slice(0, -3));
        autoSave.style.border = "0px";
        outlineBtnIcon.style.color = '#f0f0f0cc';

        this._description = h("input", { type: "text", style: { backgroundColor: "var(--bg)", borderColor: "grey", color: "var(--fg)" } });

        // control expend the outline and collapse the outline 
        let isShown = true;
        outlineBtnIcon.onclick = () => {
            // collapse 
            isShown = !isShown;
            Outline.getInstance().wrapper().style.width = isShown ? "10%" : "0px";
            Outline.getInstance().wrapper().style.borderColor = isShown ? "grey" : "transparent";
            Outline.getInstance().wrapper().style.transition = "all .35s ease-in-out";
            PreviewWindow.getInstance().previewWindowWrapper().style.width = isShown ? "75%" : "85%";
            PreviewWindow.getInstance().previewWindowWrapper().style.transition = "all .35s ease-in-out";
            outlineBtnIcon.style.color = isShown ? "var(--fg)" : "var(--icon)";
        }

        h(this._el, {}, h(this._saveAsBtn, {}, this._saveAsBtnIcon), autoSave, redo, undo, outlineBtnIcon);


        redo.onclick = () => {
            CommandAction.redo();
        }

        undo.onclick = () => {
            CommandAction.undo();
        }

        this._saveAsBtn.onclick = () => {

            let yesBtn = h("button", {
                class: _popupBtn,
                onclick: async () => {
                    // download the files
                    Document.saveToLocal();
                }
            }, "yes");


            let download: internalSystem.StandardResizableDialog = new internalSystem.StandardResizableDialog({
                title: "Download",
                content: h("div", { class: _popup },
                    h("h4", {}, "Do you want to download the document?"),
                    h("label", { style: { fontFamily: 'Lucida Grande', padding: "10px" } }, "Add Description (Optional)"),
                    this._description,
                    h("div", { class: _btnSet },
                        h("button", {
                            class: _popupBtn,
                            onclick: () => {
                                download.close();
                            }
                        }, "cancel"),
                        yesBtn,
                    )
                ),
                width: 400,
                height: 180,
            });
        }
    }

    static getInstance(): TopMenuBar {
        if (TopMenuBar._tmb == null) {
            TopMenuBar._tmb = new TopMenuBar();
        }
        return TopMenuBar._tmb;
    }

    addBlock() {

    }

    description(){
        return this._description.value;
    }

    add(node: HTMLElement) {
        h(this._el, {}, node);
    }

    addToParent(parent: HTMLElement) {
        h(parent, {}, this._el);
    }

    getTopMenuBar(): HTMLElement {
        return this._el;
    }

    saveBtnEnabled() {
        this._saveAsBtnIcon.style.color = "var(--fg)";
        this._saveAsBtn.disabled = false;
    }
}