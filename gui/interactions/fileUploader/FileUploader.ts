import { createClass as cls } from "../../../commons/lib/css/create";
import { html as h } from "../../../commons/lib/dom/create";
import { PreviewWindow } from "../../previewWindow/PreviewWindow";
import { ShowFile } from "./ShowFile";

const _button = cls({
    border: "none",
    width: "200px",
    height: "35px",
    backgroundColor: "var(--fg)",
    borderRadius: "3px",
    color: 'var(--bg)',
    fontSize: "18px",
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
})

export class FileUploader {
    private static _fu: FileUploader;
    styleXml: xml.DomElement | undefined;

    private constructor() {

    }

    static getInstance(): FileUploader {
        if (FileUploader._fu == null) {
            FileUploader._fu = new FileUploader();
        }
        return FileUploader._fu;
    }

    uploadXml() {
        PreviewWindow.getInstance().fileUploadStyle();
        let button = h("div", { class: _button }, "Browse Local File");
        let input = h("input", { type: "file", style: { display: "none" } });
        //this is a global variable and we'll use it inside multiple functions
        let file: any;

        button.onclick = () => {
            input.click(); //if user click on the button then the input also clicked
        }

        PreviewWindow.getInstance().el().ondrop = (event: any) => {
            event.preventDefault(); //preventing from default behavior
            // getting user select file and [0] this means if user select multiple files then we'll select only the first one
            file = event.dataTransfer?.files[0];
            this.uploadFile(file);
        };
    }

    uploadFile(file?: any) {
        ShowFile(file, this.styleXml!);
    };

    style() {
        return this.styleXml;
    }

    elNotHighlighted(el: HTMLElement) {
        el.childNodes.forEach((d: ChildNode) => {
            let div = d as HTMLElement;
            if (div.id == "layout preview") {
                div.onmouseover = () => {
                    div.style.border = "0.1px solid var(--accent-warning)";
                }
                div.onmouseout = () => {
                    div.style.border = "0.1px solid transparent";
                }
            }
        })
    }
}