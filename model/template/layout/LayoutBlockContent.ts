/**
 * This is a class that implements layout block content elements.
*/
export class LayoutBlockContent {
    private _content: string;
    private _editable:boolean;

    constructor(content: string, editable: boolean) {
        this._content = content;
        this._editable = editable;
    }

    content(): string{
        return this._content;
    }
    
    setContent(content: string) {
        this._content = content;
    }

    editable(): boolean {
        return this._editable;
    }

    setEditable(editable: boolean) {
        this._editable = editable;
    }
}
