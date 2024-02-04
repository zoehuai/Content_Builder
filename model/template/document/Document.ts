
import { DraggableSortedOrder } from "../../../gui/interactions/DraggableSortedOrder";
import { FileUploader } from "../../../gui/interactions/fileUploader/FileUploader";
import { TopMenuBar } from "../../../gui/previewWindow/topMenuBar/TopMenuBar";
import { TopTitleEditorGUI } from "../../../gui/topTitleEditor/TopTitleEditorGUI";
import { NotFoundError } from "../../error/NotFoundError";
import { Doc } from "./Doc";
import { Style } from "./Style";
import { StyleItems } from "./StyleItems";
import { Template } from "./Template";

/**
 * This is a class that build document model, which includes the template and style.
*/
export class Document {
    private _id: number | null = null;
    private _title: string;
    private _description: string;
    private _template: Template;
    private _style: Style | undefined;

    constructor(title: string, desc: string, template: Template, style?: Style) {
        this._title = title;
        this._description = desc;
        this._template = template;
        this._style = style;
    }

    /**
     * The unique identifier of the Arcitecta XML document. 
     * This id only exists for Arcitecta XML document restored from server @see {@link restoreFromServer}
     * @returns {Number | null}
     */
    id(): number | null {
        return this._id;
    }

    setId(id: number): void {
        this._id = id;
    }

    title() {
        return this._title;
    }

    setTitle(title: string): void {
        this._title = title;
    }

    description(): string {
        return this._description;
    }

    setDescription(description: string): void {
        this._description = description;
    }

    template(): Template {
        return this._template;
    }

    setTemplate(template: Template): void {
        this._template = template;
    }

    style(): Style {
        return this._style!;
    }

    setStyle(style: Style): Style | undefined {
        if (this._style == null) {
            NotFoundError.message(`Style`);
            return;
        }
        this._style = style;
        return this._style;
    }

    static saveToLocal() {
        let dw = new xml.StringWriter();
        
        dw.push("full-document");
        // if style not exists

        //add template to document xml
        dw.push("template");
        dw.add("name", TopTitleEditorGUI.getInstance().title());
        dw.add("description", TopMenuBar.getInstance().description());
        dw.addXml(Template.optionalString!);

        dw.push("document");
        dw.push("layout", { name: "document" });
        dw.push("vertical")

        for (let i = 0; i < DraggableSortedOrder.getInstance().existOutline.length; i++) {
            let textIndent = DraggableSortedOrder.getInstance().existOutline[i].style.textIndent.replace("rem", "");

            if (textIndent.indexOf(".") == -1) {
                dw.push(DraggableSortedOrder.getInstance().existOutline[i].title.toLowerCase());
            }

            if (textIndent.indexOf(".") != -1) {
                dw.push("block", { name: DraggableSortedOrder.getInstance().existOutline[i].title });

                if (DraggableSortedOrder.getInstance().existObjectWidgets[i].typeName() != null) {
                    dw.add("type", DraggableSortedOrder.getInstance().existObjectWidgets[i].typeName());
                }
                if (DraggableSortedOrder.getInstance().existObjectWidgets[i].contentText() != null) {
                    dw.add("content", DraggableSortedOrder.getInstance().existObjectWidgets[i].contentText());
                }
                if (DraggableSortedOrder.getInstance().existObjectWidgets[i].editable() != null) {
                    dw.add("editable", DraggableSortedOrder.getInstance().existObjectWidgets[i].editable());
                }
                if (DraggableSortedOrder.getInstance().existObjectWidgets[i].instruction() != null) {
                    dw.add("instruction", DraggableSortedOrder.getInstance().existObjectWidgets[i].instruction());
                }

                if (DraggableSortedOrder.getInstance().existObjectWidgets[i].size() != null) {
                    dw.add("size", DraggableSortedOrder.getInstance().existObjectWidgets[i].size());
                }
                if (DraggableSortedOrder.getInstance().existObjectWidgets[i].extension() != null) {
                    dw.add("extension", DraggableSortedOrder.getInstance().existObjectWidgets[i].extension());
                }

                dw.pop();

                if ((i < DraggableSortedOrder.getInstance().existOutline.length - 1) && (DraggableSortedOrder.getInstance().existOutline[i].style.textIndent != (DraggableSortedOrder.getInstance().existOutline[i + 1].style.textIndent))) {
                    dw.pop();
                }
            }
        }
        dw.pop();
        dw.pop();
        dw.pop();
        dw.pop();
        dw.pop();

        // if style exists
        if (StyleItems.getInstance().arrayMap.size > 0) {
            dw.addXml(FileUploader.getInstance().style()!.toString());
        }

        let xmlDoc = dw.document();

        let filename = TopTitleEditorGUI.getInstance().title() + ".xml";
        let pom = document.createElement('a');
        let bb = new Blob([xmlDoc], { type: 'text/plain' });

        pom.setAttribute('href', window.URL.createObjectURL(bb));
        pom.setAttribute('download', filename);
        pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
        pom.draggable = true;
        pom.classList.add('dragout');
        pom.click();
    }

    static createFromLocalXml(documentXml: xml.Element): Document {
        let title: string = documentXml.value("name")!;
        let desc: string = documentXml.value("description")!;

        // template contains document content
        let template = documentXml.element("template")!;
        return new Document(title, desc, Template.createFromXml(template!));

    }

    saveToServer() {

    }

    /**
     * Destroys the Arcitecta XML document from database.
     */
    destroyFromServer(id: number): void {

    }

    restoreFromServer() {

    }

}