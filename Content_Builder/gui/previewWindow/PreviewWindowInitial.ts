import { createClass as cls } from "../../commons/lib/css/create";
import { html as h } from "../../commons/lib/dom/create";
import { FileUploader } from "../interactions/fileUploader/FileUploader";

const _body = cls({
    margin: `0px`,
    padding: `0px`,
    boxSizing: `border-box`,
    fontFamily: `Arial`,
});

const _formContainer = cls({
    width: `100%`,
    height: `75vh`,
    backgroundColor: `var(--bg)`,
    display: `flex`,
    justifyContent: `center`,
    alignItems: `center`,
});

const _card = cls({
    borderRadius: `10px`,
    padding: `10px 30px 40px`,
    width: `600px`,
    height: "260px",
    backgroundColor: `var(--code-bg)`,
    textAlign: `center`,
    boxShadow: `0 5px 10px 0 rgba(0, 0, 0, 0.3)`,
});

const _dropbox = cls({
    margin: `25px 0`,
    padding: `30px`,
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    flexDirection: `column`,
    border: "3px dotted #a3a3a3",
    borderRadius: "5px",
});

const _buttonStyle = cls({
    textDecoration: "none",
    backgroundColor: `var(--bg)`,
    cursor: "pointer",
    color: "var(--fg)",
    padding: "10px 20px",
    border: "none",
    outline: "none",
    transition: "0.3s",
    "&:hover": {
        backgroundColor: "var(--fg)",
        padding: "10px 20px",
        color: "var(--icon)",
        outline: "1px solid var(--input)",
    },
})

const _input = cls({
    margin: "10px 0",
    width: "100%",
    backgroundColor: "#e2e2e2",
    border: "none",
    outline: "none",
    padding: "12px 20px",
    borderRadius: "4px",
})


export class PreviewWindowInitial {
    dropbox: HTMLDivElement;
    p: HTMLHeadingElement;
    static _pi: PreviewWindowInitial;
    uploadEffect: HTMLDivElement;
    button: HTMLDivElement;
    input: HTMLInputElement;
    file: File | undefined;

    constructor() {
        this.uploadEffect = h("div", { class: _body });
        let formContainer = h("div", { class: _formContainer });
        let uploadFilesContainer = h("div", { class: _card });
        this.dropbox = h("div", { class: _dropbox });
        this.p = h("h3", { style: "user-select:none" }, h("span", {}, "To start, Please "), h("span", { style: "color:var(--meta-attribute-name);" }, "Drag and Drop "), h("span", {}, "or"), h("span", { style: "color:var(--meta-attribute-name);" }, " Choose File "), h("span", {}, "to upload a Template or Full Document XML file."));
        this.button = h("div", { class: _buttonStyle });
        this.input = h("input", { class: _input, type: "file", style: { display: "none" } });
        this.file;
        h(this.uploadEffect, {}, h(formContainer, {}, h(uploadFilesContainer, {}, this.p, h(this.dropbox, {}, h("p", { style: "user-select:none;  margin-top: 10px; margin-bottom: 20px;font-size: 12px; color: var(--icon);" }, "Files Supported: Arcitecta format XML file"), h(this.button, { style: "user-select:none" }, "Choose File")))));
        this.button.onclick = () => this.chooseFileStyle();
    }

    static getInstance(): PreviewWindowInitial {
        if (PreviewWindowInitial._pi == null) {
            PreviewWindowInitial._pi = new PreviewWindowInitial();
        }
        return PreviewWindowInitial._pi;
    }

    dragFileStyle() {
        let height = this.p.offsetHeight;
        this.dropbox.style.backgroundColor = "var(--icon)";
        this.p.innerHTML = "Drop Here";
        this.p.style.height = height + "px";
        this.button.style.backgroundColor = "var(--icon)";
        this.button.style.color = "var(--icon)";
    }

    dragFileLeaveStyle() {
        this.dropbox.style.backgroundColor = "var(--code-bg)";
        this.p.innerHTML = "";
        let string = h("p", { style: "user-select:none" }, h("span", {}, "To start, Please "), h("span", { style: "color:var(--meta-attribute-name);" }, "Drag and Drop "), h("span", {}, "or"), h("span", { style: "color:var(--meta-attribute-name);" }, " Choose File "), h("span", {}, "to upload a Template or Full Document XML file."));
        h(this.p, {}, string);
        this.button.style.backgroundColor = "var(--bg)";
        this.button.style.color = "var(--fg)";
    }

    chooseFileStyle() {
        this.input.click();
        this.input.onchange = (event: any) => {
            event.preventDefault();
            this.file = this.input.files![0];
            FileUploader.getInstance().uploadFile(this.file);
        };
    }

    cancelStyle() {
        this.input = h("input", { class: _input, type: "file", style: { display: "none" } });
    }
    
}