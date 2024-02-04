import { NotFoundError } from "../../error/NotFoundError";
import { StyleItems } from "./StyleItems";

/**
 * This is a class that apples style for the document.
*/
export class Style {

    private _styles: Map<string, string> = new Map<string, string>();

    /**
     * @param styles Use Map structure here to make style more flexible to be customization wherever possible and plausible.
     */
    constructor(styles: Map<string, string>) {
        this._styles = styles;
    }

    styles(): Map<string, string> | undefined {
        if (this._styles == null) {
            NotFoundError.message("Document Styles");
            return;
        }
        return this._styles;
    }

    styleIfExists(tag: string): string | undefined {
        if (!this._styles.has(tag)) {
            NotFoundError.message(`Style ${tag}`);
        }
        return this._styles.get(tag);
    }

    /**
     * @param tag 
     * @param style This style should come from @see {@link createClass} 
     */
    setStyle(tag: string, style: string) {
        if (!this._styles.has(tag)) {
            NotFoundError.message(`Style ${tag}`);
        }
        this._styles.set(tag, style);
    }

    static createFromXml(xml: xml.Element): Map<string, string> {
        let style: Map<string, string> = new Map<string, string>();

        xml.elements().forEach(tagEl => {
            let tag = tagEl.name();
            let tagStyle: any = {};
            let styleString = "";
            let styleArray: string[] = [];
            tagEl.elements().forEach(el => {

                if (el.name() === "selector") {
                    el.elements().forEach(s => {
                        let selector: any = {};
                        let selectorStyle: string = "";
                        selectorStyle = selectorStyle + `:${s.name()}` + "{";

                        s.elements().forEach(e => {
                            selector[e.name()] = e.value();
                            selectorStyle = selectorStyle + e.name() + ":" + e.value() + "}; ";
                            styleArray.push(selectorStyle);
                        })
                        tagStyle[`&:${s.name()}`] = selector;
                        // console.log(selector);

                    })
                } else {
                    tagStyle[el.name()] = el.value();
                    styleString = styleString + el.name() + ":" + el.value() + "; ";

                }
            })

            let array = new Map<string, string[]>();
            array.set(styleString, styleArray);
            // console.log(Object.keys(tagStyle) );
            // console.log(Object.values(tagStyle) );
            // Object.keys(tagStyle).forEach((item: any) => {
            //     console.log(item);
            // });

            StyleItems.getInstance().setStyle(tag, styleString, styleArray, array, tagStyle);
        })
        return style;
    }

    //     static createFromDocXml(xml: xml.Element): Style {
    //         let style: Map<string, string> = new Map<string, string>();

    //         xml.elements().forEach(tagEl => {
    //             let tag = tagEl.name();
    //             // fix any in the future
    //             let tagStyle: any = {};
    //             let styleString = "";
    //             let styleArray: string[] = [];
    //             tagEl.elements().forEach(el => {

    //                 if (el.name() === "selector") {

    //                     el.elements().forEach(s => {
    //                         let selector: any = {};
    //                         let selectorStyle: string = "";
    //                         selectorStyle = selectorStyle + `:${s.name()}` + "{";

    //                         s.elements().forEach(e => {
    //                             selector[e.name()] = e.value();
    //                             selectorStyle = selectorStyle + e.name() + ":" + e.value() + "}; ";
    //                             styleArray.push(selectorStyle);

    //                         })
    //                         tagStyle[`&:${s.name()}`] = selector;
    //                     })
    //                 } else {
    //                     tagStyle[el.name()] = el.value();
    //                     styleString = styleString + el.name() + ":" + el.value() + "; ";
    //                 }
    //             })
    //             let array = new Map<string, string[]>();
    //             array.set(styleString, styleArray);
    //             StyleItems.getInstance().setStyle(tag, styleString, styleArray, array);
    //         })

    //         return new Style(style);
    //     }
}