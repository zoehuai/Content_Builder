import { html as h, svg } from "../../../commons/lib/dom/create";
import { createClass as cls } from "../../../commons/lib/css/create";
import { clear } from "../../../commons/lib/dom/clear";
import { WidgetPickerGUI } from "./WidgetPickerGUI";
import { ElementsPanel } from "./ElementsPanel";
import { StyleItems } from "../../../model/template/document/StyleItems";


const _svgWrapperStyle = cls({
    display: "block",
    width: "100%",
    maxWidth: "400px",
    minWidth: "200px",
    marginRight: "0.5rem",
});

/**
 * This class is used to generate the SVG represent for the side bar content icon and style icon
 * */
export class ToolBarTabSvgGUI {

    private _contentBtn: SVGTextElement;
    private _svgContainer: SVGSVGElement;
    private _svgWrapper: HTMLAnchorElement;
    private _styleBtn: SVGTextElement;
    private static _toolBarTabSvgGUIInstance: ToolBarTabSvgGUI;
    styleTab: HTMLDivElement;

    constructor() {

        // content button svg
        this._contentBtn = svg("text", {
            x: 30,
            y: 32,
            fontFamily: "sans-serif",
            fontSize: "1px",
            fill: "var(--label)",
            textanchor: "middle",
            cursor: "pointer",
            fontWeight: "bolder",
        })

        this._contentBtn.style.userSelect = "none";
        this._contentBtn.innerHTML = "Blocks";

        // style button svg
        this._styleBtn = svg("text", {
            x: 150,
            y: 32,
            fontFamily: "sans-serif",
            userSelect: "none",
            cursor: "pointer",
            fontSize: "1px",
            fill: "var(--label)",
            textanchor: "middle",
            fontWeight: "bolder",
        })

        this._styleBtn.style.userSelect = "none";
        this._styleBtn.innerHTML = "Styles";

        //when style button is clicked, style window will display widget style status
        this.styleTab = h("div", { style: "height:95%;" });

        let styleBtn2 = svg("text", {
            x: 150,
            y: 32,
            cursor: "pointer",
            fontFamily: "sans-serif",
            fontSize: "1px",
            fill: "var(--label)",
            textanchor: "middle",
            fontWeight: "bolder",
        })

        styleBtn2.style.userSelect = "none";
        styleBtn2.innerHTML = "Styles";

        this._svgWrapper = h("a", { class: _svgWrapperStyle });

        this._svgContainer = svg(
            "svg",
            {
                viewBox: "0 0 250 42",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
            },

            this._contentBtn,
            this._styleBtn,
            svg("path", {
                d: "M0.5 10.5H111.5V40.5H0.5V10.5Z",
                stroke: "var(--label)",
            }),
            svg("line", {
                x1: 99,
                y1: 40.5,
                x2: 250,
                y2: 40.5,
                stroke: "var(--label)",
            }),
            svg("line", {
                x1: 96.3536,
                y1: 10.6464,
                x2: 111.496,
                y2: 25.7886,
                stroke: "var(--label)",
                "stroke-width": "2",
            }),
            svg("rect", {
                x: 95.2979,
                y: 8.89465,
                width: "12.5789",
                height: "25.1078",
                transform: "rotate(-45 95.2979 8.89465)",
                fill: "var(--bg)",
            }),
            svg("rect", {
                x: 0,
                y: 39,
                fill: "var(--bg)",
                width: "111",
                height: "5"
            }),
        );

        // substitute of the content button icon when user clicks "Style" button icon
        let contentBtnUpdate = svg("text", {
            x: 30,
            y: 32,
            cursor: "pointer",
            fontFamily: "sans-serif",
            fontSize: "1px",
            fill: "var(--label)",
            textanchor: "middle",
            fontWeight: "bolder",
        })

        contentBtnUpdate.innerHTML = "Blocks";
        contentBtnUpdate.style.userSelect = "none";

        this._styleBtn.onclick = () => {

            clear(ElementsPanel.getInstance().el());
            clear(this._svgWrapper);
            clear(this.styleTab);

            h(this.styleTab, {}, StyleItems.getInstance().styleWindowElements());

            h(this._svgWrapper, {}, svgStyleContainer);

            h(ElementsPanel.getInstance().el(), {}, this._svgWrapper, this.styleTab);

        }

        contentBtnUpdate.onclick = () => {

            clear(ElementsPanel.getInstance().el());

            clear(this._svgWrapper);

            h(this._svgWrapper, {}, this._svgContainer);

            h(ElementsPanel.getInstance().el(), {}, this._svgWrapper, WidgetPickerGUI.getInstance().getContentWidget());

        }

        let svgStyleContainer = svg(
            "svg",
            {
                viewBox: "0 0 250 42",
                fill: "none",
                xmlns: "http://www.w3.org/2000/svg",
            },
            contentBtnUpdate,
            styleBtn2,
            svg("path", {
                d: "M123.817 11.5H236.027V41.5H123.817V11.5Z",
                stroke: "var(--label)",
            }),
            svg("line", {
                // x1: 99,
                y1: 41.5,
                x2: 192.051,
                y2: 41.5,
                stroke: "var(--label)",
            }),
            svg("line", {
                // x1: 96.3536,
                y1: -0.5,
                x2: 21.5301,
                y2: -0.5,
                stroke: "var(--label)",
                transform: "matrix(0.710893 0.7033 -0.710893 0.7033 220.053 12)",
            }),
            svg("rect", {
                x: 0,
                y: 0,
                width: "12.647",
                height: "31.8998",
                transform: "matrix(0.710893 -0.7033 0.710893 0.7033 218.332 8.89465)",
                fill: "#202020",
            }),
            svg("line", {
                x1: 124.328,
                y1: 41,
                x2: 235.516,
                y2: 41,
                stroke: "#202020",
                "stroke-width": "2",
            }),
        );

        h(this._svgWrapper, {}, this._svgContainer);

    }

    getContentBtn() {
        return this._contentBtn;
    }

    getStyleBtn() {
        return this._styleBtn;
    }

    static getInstance(): ToolBarTabSvgGUI {
        if (ToolBarTabSvgGUI._toolBarTabSvgGUIInstance == null) {
            ToolBarTabSvgGUI._toolBarTabSvgGUIInstance = new ToolBarTabSvgGUI();
        }
        return ToolBarTabSvgGUI._toolBarTabSvgGUIInstance;
    }

    addSvgElement() {
        h(this._svgWrapper, {}, this._svgContainer);
    }

    addToParent(parent: HTMLElement) {
        h(parent, {}, this._svgWrapper);
    }
}