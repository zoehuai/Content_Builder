import { ContentIteration } from "../../../gui/interactions/fileUploader/ContentIteration";
import { FileUploader } from "../../../gui/interactions/fileUploader/FileUploader";

export class Doc {

    constructor() {

    }

    static createFromLocalXml(documentXml: xml.Element): Doc {
     
        ContentIteration(documentXml, true);

        return Doc;
    }
}