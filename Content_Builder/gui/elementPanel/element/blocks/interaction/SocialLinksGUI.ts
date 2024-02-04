import { WidgetGUI } from "../WidgetGUI";

const SOCIALLINKS = "sociallinks";

export class SociallinksGUI extends WidgetGUI {
    constructor(name: string, type: string, count: number) {
        super( name, type, count);
        this._type = SOCIALLINKS;
    }
}