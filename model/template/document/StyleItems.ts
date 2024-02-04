import { createClass } from "../../../commons/lib/css/create";
import { clear } from "../../../commons/lib/dom/clear";
import { html as h } from "../../../commons/lib/dom/create";
import { WidgetGUI } from "../../../gui/elementPanel/element/blocks/WidgetGUI";
import { StyleFileUploadGUI } from "../../../gui/elementPanel/widgetPanelGUI/StyleFileUploadGUI";
import { StyleInfoElementGUI } from "../../../gui/elementPanel/widgetPanelGUI/StyleInfoElementGUI";
import { StyleTabGUI } from "../../../gui/elementPanel/widgetPanelGUI/StyleTabGUI";
import { DraggableSortedOrder } from "../../../gui/interactions/DraggableSortedOrder";

/**
 * This is a class that applies style for each style properties.
*/
export class StyleItems {

    private static _s: StyleItems;
    arrayMap: Map<string, Map<string, string[]>>;
    tagStyle: any;

    constructor() {
        this.arrayMap = new Map<string, Map<string, string[]>>();
    }

    static getInstance(): StyleItems {
        if (StyleItems._s == null) {
            StyleItems._s = new StyleItems();
        }
        return StyleItems._s;
    }

    setStyle(name: string, styleItems: string, selector: string[] | null, array: Map<string, string[]>, tagStyle: any) {

        this.arrayMap.set(name, array);

        // this.arrayObject = [name, tagStyle];
        //instantiate the style information
        let styleEl = new StyleInfoElementGUI();
        // console.log(tagStyle);
        let card = styleEl.card(name, tagStyle);
        // console.log(card);
        h(StyleTabGUI.getInstance().dropList(), {}, card);
        // StyleTabGUI.getInstance().appendList(styleEl.cardHTML());

        DraggableSortedOrder.getInstance().existObjectWidgets.forEach((object: WidgetGUI) => {

            if (object.name() != "Vertical" && object.name() != "Horizontal") {
                // which means this is a vertical or horizontal container 
                // this is an object and have their own methods
                let typeName: string;
                switch (object.typeName()) {
                    case "Paragraph": {
                        typeName = "p";
                        break;
                    }
                    case "Heading 1": {
                        typeName = "h1";
                        break;

                    }
                    case "Heading 2": {
                        typeName = "h2";
                        break;

                    }
                    case "Heading 3": {
                        typeName = "h3";
                        break;

                    }
                    case "Heading 4": {
                        typeName = "h4";
                        break;

                    }
                    case "Heading 5": {
                        typeName = "h5";
                        break;

                    }
                    case "Image": {
                        typeName = "img";
                        break;

                    }
                    case "Button": {
                        typeName = "button";
                        break;

                    }
                    default: {
                        typeName = "p";
                        break;
                    }
                }

                if (typeName == name) {

                    const newStyle = createClass(styleItems);

                    object.el().classList.add(newStyle);

                    if (selector != null) {
                        selector.forEach((s: string) => {

                            let a = document.createElement("style");

                            a.appendChild(document.createTextNode(`.${newStyle}` + s));

                            object.el().appendChild(a);

                        })
                    }
                }
            }
        })
    }

    //this style should apply to the class rather than inline style properties
    setDropStyle(el: HTMLElement) {
        let style = this.arrayMap.get(el.title);
        if (style != null) {

            const iterator1 = style!.keys();

            const newStyle = createClass(iterator1.next().value);

            el.classList.add(newStyle);

            if (style?.values().next().value != null) {

                style?.values().next().value.forEach((s: string) => {

                    let a = document.createElement("style");

                    a.appendChild(document.createTextNode(`.${newStyle}` + s));

                    el.appendChild(a);

                })
            }
        }
    }

    styleWindowElements(): HTMLElement {
        //display style elements
        let styleWindow = h("div",{style:"height:100%;overflow-y:auto;"});

        this.arrayMap.forEach((value, key) => {

            let iterator1 = value.keys();

            let el = h("div", {}, key + ` \n ` + iterator1.next().value);

            h(styleWindow, {}, el);

        })

        //not upload the style document
        // let notUpload = h("div", { style: "margin-top:10px; margin-left:5px; user-select: none;" }, "Not apply style XML file yet.");
      
        if (styleWindow.childNodes.length == 0) {
            
            // h(styleWindow, {}, notUpload);
            h(styleWindow, {}, StyleFileUploadGUI.getInstance().uploadEffect);


        } else {
            
            clear(styleWindow);

            h(styleWindow, {}, StyleTabGUI.getInstance().dropList());
        }
        return styleWindow;
    }
}