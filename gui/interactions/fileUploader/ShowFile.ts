import { createClass as cls } from "../../../commons/lib/css/create";
import { clear } from "../../../commons/lib/dom/clear";
import { html as h } from "../../../commons/lib/dom/create";
import { Document } from "../../../model/template/document/Document";
import { Style } from "../../../model/template/document/Style";
import { StyleItems } from "../../../model/template/document/StyleItems";
import { Template } from "../../../model/template/document/Template";
import { ElementsPanel } from "../../elementPanel/widgetPanelGUI/ElementsPanel";
import { ToolBarTabSvgGUI } from "../../elementPanel/widgetPanelGUI/ToolBarTabSvgGUI";
import { WidgetPickerGUI } from "../../elementPanel/widgetPanelGUI/WidgetPickerGUI";
import { Outline } from "../../outline/Outline";
import { PreviewWindow } from "../../previewWindow/PreviewWindow";
import { PreviewWindowInitial } from "../../previewWindow/PreviewWindowInitial";
import { TopMenuBar } from "../../previewWindow/topMenuBar/TopMenuBar";
import { DropToOutline } from "../addNewWidgetFromPanel/DropToOutline";
import { ApplyDocumentLayouts } from "./ApplyDocumentLayouts";
import { ApplyStyle } from "./ApplyStyle";

const _popupBtn = cls({
    backgroundColor: "var(--bg-active)",
    border: `2px solid var(--separator)`,
    borderRadius: "6px",
    color: 'var(--fg)',
    cursor: "pointer",
    width: "100%",
    height: "30px",
    textTransform: "capitalize",
    fontWeight: "bold",
    "&:active": {
        opacity: 0.8,
    },
    "&:disabled": {
        opacity: 0.5,
        backgroundColor: 'var(--bg)',
    }
})

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
    cursor: "pointer",
    userSelect: "none",
})

export function ShowFile(file: File, styleXml: xml.DomElement) {
    if (file == undefined) {
        internalSystem.notification(`This is not an Arcitecta XML file, please upload a Template or Full Document format file instead.`, { type: "warning" });
        PreviewWindow.getInstance().removeClassList();

    } else {

        let fileType = file.type; //getting selected file type
        let validExtensions = ["text/xml", "application/xml", "text/adxml"];
        let tem: xml.DomElement | undefined;
        let styleDoc: Map<string, string> | undefined;

        if (validExtensions.includes(fileType)) {

            /**
            * Parse a file's contents to a string using a {@link FileReader}.
            */
            const parseFileToString = (file: Blob): Promise<string> => {
                return new Promise((resolve, reject) => {
                    let fr = new FileReader();
                    fr.onload = () => {
                        resolve(fr.result as string);
                        const xmlToStr = fr.result;
                        // parse string to html
                        // const parser = new DOMParser();
                        // convert html string into DOM
                        return xmlToStr;
                    };
                    fr.onerror = () => {
                        reject(fr.error);
                    };
                    fr.readAsText(file);
                });
            }
            let fileReader = new FileReader();
            fileReader.onload = async () => {
                // let fileURL = fileReader.result;

                let result = parseFileToString(file);
                let doc = xml.parse(await result);

                if (doc.element()?.name() == "template") {

                    let yesBtn = h("button", {
                        class: _popupBtn,
                        onclick: async () => {
                            PreviewWindow.getInstance().clearPreviewWindow();

                            // todo clear all rather than stay there ???
                            clear(WidgetPickerGUI.getInstance().getContentWidget());

                            replaceTemplate.close();

                            let template = Template.createFromXml(doc);

                            tem = doc;

                            WidgetPickerGUI.getInstance().createWidgets(template, ElementsPanel.getInstance().el());

                            ApplyDocumentLayouts(template, file.name);

                            // console.log(FlowRuleGUIModel.getInstance().flowRulesArray());

                            Outline.getInstance().clearOutline();

                            TopMenuBar.getInstance().saveBtnEnabled();

                            // enable drag for existing widget type
                            DropToOutline.getInstance().dragFromPanel(WidgetPickerGUI.getInstance().getExistWidgetsTypes());

                        }
                    }, "yes");


                    let replaceWarning = h("h4", { style: "user-select: none" }, "Do you want to apply the template <" + file.name + "> into your document? ")

                    if (Outline.getInstance().el().childNodes.length != 0) {
                        replaceWarning.innerHTML = replaceWarning.innerHTML + "It will discard your previous changes on the document."
                    }

                    let replaceTemplate: internalSystem.StandardResizableDialog = new internalSystem.StandardResizableDialog({
                        title: "Content Builder",
                        content: h("div", { class: _popup },
                            replaceWarning,
                            h("div", { class: _btnSet },
                                h("button", {
                                    class: _popupBtn,
                                    onclick: () => {
                                        replaceTemplate.close(),
                                            PreviewWindow.getInstance().fileUploadCancelStyle();
                                        PreviewWindowInitial.getInstance().dragFileLeaveStyle();
                                    }
                                }, "cancel"),
                                yesBtn,
                            )
                        ),
                        width: 400,
                        height: 180,
                    });
                }

                // upload style xml file
                else if (doc.element()?.name() == "style") {

                    // if a template not exists, give a notification letting user to upload template first (check the panel length and widgets to determine whether there has a template or not)
                    if (ElementsPanel.getInstance().el().childNodes.length == 1) {
                        internalSystem.notification(`Document content is empty, please upload a template xml first.`, { type: "warning" });
                        PreviewWindow.getInstance().fileUploadCancelStyle();
                    }
                    // template exist 
                    else if (ElementsPanel.getInstance().el().childNodes.length > 1) {

                        let notification = h("h4", { style: "user-select: none" }, "Do you want to apply style <" + file.name + "> to the document?");
                        let yesChangeStyleBtn = h("button", {
                            class: _popupBtn,
                            onclick: async () => {

                                style.close();

                                let result = parseFileToString(file);

                                let doc = xml.parse(await result);

                                styleXml = doc;

                                styleDoc = Style.createFromXml(doc);

                                ApplyStyle(styleDoc);

                                PreviewWindow.getInstance().fileUploadCancelStyle();

                                internalSystem.notification(`Upload Style <` + file.name + `>  Successfully!`, { type: "info" });

                                // update style information gui tab

                                clear(ToolBarTabSvgGUI.getInstance().styleTab);

                                h(ToolBarTabSvgGUI.getInstance().styleTab, {}, StyleItems.getInstance().styleWindowElements());

                            }
                        }, "yes");

                        let style: internalSystem.StandardResizableDialog = new internalSystem.StandardResizableDialog({
                            title: "Content Builder",
                            content: h("div", { class: _popup },
                                notification,
                                h("div", { class: _btnSet },
                                    h("button", {
                                        class: _popupBtn,
                                        onclick: () => {
                                            style.close(),
                                                PreviewWindow.getInstance().fileUploadCancelStyle();
                                        }
                                    }, "cancel"),
                                    yesChangeStyleBtn,
                                )
                            ),
                            width: 400,
                            height: 180,
                        });
                    }
                }

                else if (doc.element()?.name() == "full-document") {
                    let yesUploadDocBtn = h("button", {
                        class: _popupBtn,
                        onclick: async () => {
                            PreviewWindow.getInstance().clearPreviewWindow();

                            clear(WidgetPickerGUI.getInstance().getContentWidget());

                            replaceToDoc.close();

                            let document = Document.createFromLocalXml(doc);

                            WidgetPickerGUI.getInstance().createWidgets(document.template(), ElementsPanel.getInstance().el());

                            ApplyDocumentLayouts(document.template(), file.name);

                            Outline.getInstance().clearOutline();

                            TopMenuBar.getInstance().saveBtnEnabled();

                            // enable drag for existing widget type
                            DropToOutline.getInstance().dragFromPanel(WidgetPickerGUI.getInstance().getExistWidgetsTypes());

                        }
                    }, "yes");

                    let warning;
                    if (ElementsPanel.getInstance().el().childNodes.length == 1) {
                        warning = h("h4", {}, "Do you want to upload full document <" + file.name + "> into the document?");
                    } else {
                        warning = h("h4", {}, "Do you want to upload document <" + file.name + "> ? It will discard your previous changes on the document.");
                    }
                    let replaceToDoc: internalSystem.StandardResizableDialog = new internalSystem.StandardResizableDialog({
                        title: "Upload Document",
                        content: h("div", { class: _popup },
                            warning,
                            h("div", { class: _btnSet },
                                h("button", {
                                    class: _popupBtn,
                                    onclick: () => {
                                        replaceToDoc.close(),
                                            PreviewWindow.getInstance().fileUploadCancelStyle();
                                    }
                                }, "cancel"),
                                yesUploadDocBtn,
                            )
                        ),
                        width: 400,
                        height: 180,
                    });
                }

                else {
                    internalSystem.notification(`Please upload a valid template or style file!`, { type: "warning" });
                }

            }
            fileReader.readAsDataURL(file);
        }
        else {
            internalSystem.notification(`This is not an Arcitecta XML file, please upload a Template or Full Document format file instead.`, { type: "warning" });
            PreviewWindow.getInstance().removeClassList();
        }
    }
}