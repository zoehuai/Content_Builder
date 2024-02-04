import { createClass as cls } from "../../../commons/lib/css/create";
import { html as h,  } from "../../../commons/lib/dom/create";
import { mdIcon, MD_FORMAT_ALIGN_LEFT, MD_FORMAT_ALIGN_CENTER, MD_FORMAT_ALIGN_RIGHT, MD_FORMAT_ALIGN_JUSTIFY, MD_FORMAT_UNDERLINED, MD_FORMAT_BOLD, MD_FORMAT_ITALIC, MD_KEYBOARD_ARROW_RIGHT, MD_KEYBOARD_ARROW_DOWN } from "../../../commons/lib/icons/material-design-icons";


const _dropListStyle = cls({
    border: "0px solid #4FA0FF",
    borderRadius: "3px",
    color: "white",
    minWidth: "137px",
    margin: "5px 5px 15px 5px",
    position: "absolute",
    overflow: "auto",
    zIndex: "1",
});

const _textMargin = cls({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
});

const _styleInput = cls({
    position: "relative",
    flexDirection: "row",
    paddingRight: "10px",
    border: `2px solid white`,
    color: "white",
    height: "30px",
    fontSize: 16,
    marginRight: "10px",
    fontFamily: "Roboto",
    fontWeight: "normal",
    padding: "5px",
    cursor: "pointer",
    userSelect: "none",
    backgroundColor: "#4D5053",
    borderRadius: 5,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",

    "&:focus": {
        outline: "none",
    },
    "&:hover": {

    },
    "&:active": {
        borderColor: "#f15d22",
    }
});

const _dropFontList = cls({
    border: "2px solid #ffffff",
    color: "white",
    borderRadius: 5,
    backgroundColor: "#4d4f53",
    minWidth: "100px",
    paddingLeft: "1px",
    justifyContent: "left",
    margin: "266px 40px 10px -1px",
    position: "absolute",
    overflow: "auto",
    zIndex: "1",
    cursor: "pointer",
});

const _chooseFont = cls({
    "&:hover": {
        textDecoration: "underline",
        color: "#a7beff",
    },
});

const _dropSizeList = cls({
    border: "2px solid #ffffff",
    color: "white",
    borderRadius: 5,
    backgroundColor: "#4d4f53",
    minWidth: "100px",
    height: "116px",
    paddingLeft: "1px",
    justifyContent: "left",
    top: "26px",
    position: "absolute",
    overflow: "auto",
    zIndex: "1",
    cursor: "pointer",
});

const _styleColorInput = cls({
    backgroundColor: "#4D5053",
    flexDirection: "row",
    paddingRight: "10px",
    border: `2px solid white`,
    color: "white",
    width: "36px",
    height: "33px",
    fontSize: 16,
    marginRight: "10px",
    fontFamily: "Roboto",
    fontWeight: "normal",
    padding: "3px",
    cursor: "pointer",
    userSelect: "none",
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:focus": {
        outline: "none",
    },
    "&:hover": {
        opacity: "75%",
    },
});

const _styleIconInput = cls({
    flexDirection: "row",
    paddingRight: "10px",
    color: "white",
    width: "100px",
    height: "33px",
    fontSize: 16,
    marginRight: "10px",
    fontFamily: "Roboto",
    fontWeight: "normal",
    padding: "3px",
    cursor: "pointer",
    userSelect: "none",
    borderRadius: 5,
    display: "flex",
    justifyContent: "right",
    alignItems: "center",

});

/**
 * This class is used to display style information for all elements in Style.xml.
 * */
export class StyleTabGUI {
    private _dropList: HTMLDivElement;
    private _alignDiv: HTMLDivElement | undefined;
    static _p: StyleTabGUI;

    constructor() {
        // dropList contains all the styling features for the content.
        this._dropList = h("div", { class: _dropListStyle });
        this._dropList.style.position = "relative";
        // this.components();
        // this.handleOnClick();
    }

    static getInstance(): StyleTabGUI {
        if (StyleTabGUI._p == null) {
            StyleTabGUI._p = new StyleTabGUI();
        }
        return StyleTabGUI._p;
    }

    dropList(): HTMLDivElement {
        return this._dropList;
    }

    appendList(styleEl: HTMLDivElement) {
        h(this._dropList, {}, styleEl);
    }

    components() {
        let font = h("p", { class: _textMargin }, "Font Family");
        let chosenFont = h("span", { style: "margin-right: 5px" }, "Roboto");
        // let fontSelectWrapper = h("div", { tabIndex: 0 });
        let fontSelectWrapper = h("div");
        let fontBtn = h("button", { class: _styleInput }, chosenFont, h("span", {}, "▾"));
        h(fontSelectWrapper, {}, fontBtn);
        let fontDropList = h("div", { class: _dropFontList, style: "display: none;" });
        let sansserif = h("p", { class: _chooseFont, style: "font-family: sans-serif;" }, "Sans-serif");
        let monospace = h("p", { class: _chooseFont, style: "font-family: Monospace;" }, "Monospace");
        let fantasy = h("p", { class: _chooseFont, style: "font-family: serif;" }, "Serif");
        let cursive = h("p", { class: _chooseFont, style: "font-family: fangsong;" }, "Fangsong");
        h(fontSelectWrapper, {}, h(fontDropList, {}, sansserif, monospace, fantasy, cursive));

        let isShown = false;

        sansserif.onclick = () => {
            chosenFont.innerText = "Sans-serif";
            chosenFont.style.fontFamily = "sans-serif";
            fontDropList.style.display = "none";
            isShown = false;
        }

        fontBtn.onclick = () => {
            isShown = !isShown
            fontDropList.style.display = isShown ? fontDropList.style.removeProperty("display") : "none";
            fontSelectWrapper.focus();
        }

        fontSelectWrapper.onblur = () => {
            fontDropList.style.display = "none";
            isShown = false;
        }

        let sizeBtn = h("button", { class: _styleInput }, h("span", { style: "margin-right: 9px" }, "16 px"), h("span", {}, "▾"));
        // let dropList = h("div", { style:"overflow: auto"});
        let sizeDropList = h("div", { class: _dropSizeList, style: "display: none;" });
        let sizeArray = ["10px", "11px", "12px", "13px", "14px", "16px", "18px", "24px", "30px", "36px", "48px", "60px", "72px"];
        for (var i = 0; i < sizeArray.length; i++) {
            let size = h("p", {}, sizeArray[i]);
            h(sizeDropList, {}, size);
        }

        h(sizeBtn, {}, sizeDropList);

        let isShownSize = false;

        sizeBtn.onclick = () => {
            isShownSize = !isShownSize
            fontDropList.style.display = isShownSize ? fontDropList.style.removeProperty("display") : "none";

            if (isShownSize === true) {
                sizeBtn.onblur = () => {
                    isShownSize = false;
                    sizeDropList.style.display = "none";
                }
            }
        }

        let colorBtn = h("button", { class: _styleColorInput });
        this.colorPicker(colorBtn);

        let bgColorBtn = h("button", { class: _styleColorInput });
        this.colorPicker(bgColorBtn);

        this.alignPicker();
        let styleDiv = h("div", { class: _styleIconInput });
        this.stylesPicker(styleDiv);
        let size = h("p", { class: _textMargin }, "Font Size");
        let color = h("p", { class: _textMargin }, "Font Color");
        let backgroundColor = h("p", { class: _textMargin }, "Background Color");
        let align = h("p", { class: _textMargin }, "Text Align");
        let styles = h("p", { class: _textMargin }, "Font Styles");

        h(
            this._dropList,
            {},
            h(font, {}, fontSelectWrapper),
            h(size, {}, sizeBtn),
            h(color, {}, colorBtn),
            h(backgroundColor, {}, bgColorBtn),
            h(align, {}, this._alignDiv),
            h(styles, {}, styleDiv)
        );
    }

    alignPicker() {
        // this.alignDiv = h("div", { class: _styleIconInput, disabled: "false" });
        this._alignDiv = h("div", { class: _styleIconInput });
        let left = h("button", { style: { backgroundColor: "rgb(35 98 171)", color: "white", border: "0.1px solid", borderRadius: "1px", cursor: "pointer" } }, mdIcon(MD_FORMAT_ALIGN_LEFT));
        let center = h("button", { style: { backgroundColor: "#4D5054", color: "white", border: "0.1px solid", borderRadius: "1px", cursor: "pointer" } }, mdIcon(MD_FORMAT_ALIGN_CENTER));
        let right = h("button", { style: { backgroundColor: "#4D5054", color: "white", border: "0.1px solid", borderRadius: "1px", cursor: "pointer" } }, mdIcon(MD_FORMAT_ALIGN_RIGHT));
        let justify = h("button", { style: { backgroundColor: "#4D5054", color: "white", border: "0.1px solid", borderRadius: "1px", cursor: "pointer" } }, mdIcon(MD_FORMAT_ALIGN_JUSTIFY));
        let alignArray = [left, center, right, justify];

        left.onclick = () => {

            for (let i = 0; i < alignArray.length; i++) {
                alignArray[i].style.backgroundColor = "#4D5054";
            }
            left.style.backgroundColor = "rgb(35 98 171)";
        }

        center.onclick = () => {

            for (let i = 0; i < alignArray.length; i++) {
                alignArray[i].style.backgroundColor = "#4D5054";
            }
            center.style.backgroundColor = "rgb(35 98 171)";

        }
        right.onclick = () => {
            for (let i = 0; i < alignArray.length; i++) {
                alignArray[i].style.backgroundColor = "#4D5054";
            }
            right.style.backgroundColor = "rgb(35 98 171)";
        }
        justify.onclick = () => {
            for (let i = 0; i < alignArray.length; i++) {
                alignArray[i].style.backgroundColor = "#4D5054";
            }
            justify.style.backgroundColor = "rgb(35 98 171)";
        }
        h(this._alignDiv, {}, left, center, right, justify);
    }

    stylesPicker(styleBtn: HTMLDivElement) {
        let underline = h("button", { style: { backgroundColor: "#4D5054", color: "white", border: "0.1px solid", borderRadius: "1px", cursor: "pointer" } }, mdIcon(MD_FORMAT_UNDERLINED));
        let bold = h("button", { style: { backgroundColor: "#4D5054", color: "white", border: "0.1px solid", borderRadius: "1px", cursor: "pointer" } }, mdIcon(MD_FORMAT_BOLD));
        let italic = h("button", { style: { backgroundColor: "#4D5054", color: "white", border: "0.1px solid", borderRadius: "1px", cursor: "pointer" } }, mdIcon(MD_FORMAT_ITALIC));

        let flag = true;
        bold.onclick = () => {
            bold.style.backgroundColor = flag ? "rgb(35 98 171)" : "rgb(77, 80, 84)";
            flag = !flag;
        }

        let bool = true;
        underline.onclick = () => {
            underline.style.backgroundColor = bool ? "rgb(35 98 171)" : "rgb(77, 80, 84)";
            bool = !bool;
        }

        let change = true;
        italic.onclick = () => {
            italic.style.backgroundColor = change ? "rgb(35 98 171)" : "rgb(77, 80, 84)";
            change = !change;
        }

        h(styleBtn, {}, underline, bold, italic);
    }

    colorPicker(colorBtn: HTMLButtonElement) {
        // let colorTitle= h("label","Text");
        let color = h("input", { type: "color", value: "#000000" });
        color.style.backgroundColor = "#4D5053";
        color.style.border = "none";
        color.style.cursor = "pointer";
        h(colorBtn, {}, color);
    }
}