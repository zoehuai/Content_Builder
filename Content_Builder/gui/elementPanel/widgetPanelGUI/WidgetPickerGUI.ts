import { mdIcon, MD_VIEW_DAY, MD_TEXT_FIELDS, MD_IMAGE, MD_VIDEOCAM, MD_CROP_16_9, MD_ART_TRACK, MD_VIEW_LIST } from "../../../commons/lib/icons/material-design-icons";
import { html as h } from "../../../commons/lib/dom/create";
import { createClass as cls } from "../../../commons/lib/css/create";
import { Blocks } from "../../../model/template/components/Blocks";
import { TextGUIModel } from "../../../gui-model/TextGUIModel";
import { ActionGUIModel } from "../../../gui-model/ActionGUIModel";
import { ImageGUIModel } from "../../../gui-model/ImageGUIModel";
import { LayoutGUIModel } from "../../../gui-model/LayoutGUIModel";
import { DropToOutline } from "../../interactions/addNewWidgetFromPanel/DropToOutline";
import { clear } from "../../../commons/lib/dom/clear";
import { Template } from "../../../model/template/document/Template";
import { WidgetGUIModel } from "../../../gui-model/WidgetGUIModel";

const _blockWindowStyle = cls({
    userSelect: "none",
    display: "flex",
    maxWidth: "400px",
    flexWrap: "wrap",
    margin: "0.5rem",
    justifyContent: "center",
});

const _block = cls({
    display: "flex",
    flexDirection: "column",
    padding: "0.5rem",
    "&:hover": {
        color: "#252717",
    },
});

const _description = cls({
    textAlign: "center",
    display: "flex",
    color: "var(--label)",
    flexDirection: "column",
    fontSize: 13,
    width: "100px",
});

const MD_HEADING1 = "<path d='M20.182 5.017A1.001 1.001 0 0 1 21 6.033V18a1 1 0 1 1-2 0V9.611a5.663 5.663 0 0 1-2.183 1.338a1 1 0 0 1-.633-1.897c1.129-.377 2.182-1.333 2.858-3.339a.996.996 0 0 1 .278-.446a1 1 0 0 1 .862-.25ZM3 5a1 1 0 0 1 1 1v5h6V6a1 1 0 1 1 2 0v12a1 1 0 1 1-2 0v-5H4v5a1 1 0 1 1-2 0V6a1 1 0 0 1 1-1Z'/>";
const MD_HEADING2 = "<path d='M15.394 7.947c.196-.39.8-1.197 2.356-1.197c.79 0 1.342.244 1.688.57c.343.324.562.802.562 1.43c0 1.829-1.137 2.806-2.73 4.016l-.215.163c-1.44 1.088-3.305 2.496-3.305 5.071a1 1 0 0 0 1 1h6.5a1 1 0 1 0 0-2h-5.324c.367-.967 1.288-1.679 2.554-2.641C20.012 13.194 22 11.67 22 8.75c0-1.122-.406-2.144-1.188-2.883c-.779-.736-1.852-1.117-3.062-1.117c-2.445 0-3.673 1.36-4.144 2.303a1 1 0 1 0 1.788.894ZM4 6a1 1 0 0 0-2 0v12a1 1 0 1 0 2 0v-5h6v5a1 1 0 1 0 2 0V6a1 1 0 1 0-2 0v5H4V6Z'/>";
const MD_HEADING3 = "<path d='M15.394 7.947c.196-.39.8-1.197 2.356-1.197c.79 0 1.342.244 1.688.57c.343.324.562.802.562 1.43c0 .575-.14.953-.317 1.214c-.18.268-.44.476-.772.636c-.692.336-1.559.4-2.13.4a1 1 0 1 0 0 2c.571 0 1.438.064 2.13.4c.331.16.592.368.772.636c.176.26.317.639.317 1.214c0 .948-.802 2-2.25 2c-1.636 0-2.158-.707-2.32-1.118a1 1 0 0 0-1.86.736c.498 1.256 1.816 2.382 4.18 2.382c2.552 0 4.25-1.948 4.25-4c0-.925-.234-1.703-.659-2.333a3.693 3.693 0 0 0-.889-.917c.33-.24.636-.541.89-.917c.424-.63.658-1.408.658-2.333c0-1.122-.406-2.144-1.188-2.883c-.779-.736-1.852-1.117-3.062-1.117c-2.445 0-3.673 1.36-4.144 2.303a1 1 0 1 0 1.788.894ZM4 6a1 1 0 0 0-2 0v12a1 1 0 1 0 2 0v-5h6v5a1 1 0 1 0 2 0V6a1 1 0 1 0-2 0v5H4V6Z'/>";

/**
 * This class is used to set the style for the widgets.
 * */
export class WidgetPickerGUI {

    private _contentWidget: HTMLDivElement;
    private _image: HTMLDivElement;
    private _text: HTMLDivElement;
    private _button: HTMLDivElement;
    private _video: HTMLDivElement;
    private _divider: HTMLDivElement;
    private _heading1: HTMLDivElement;
    private _heading2: HTMLDivElement;
    private _heading3: HTMLDivElement;
    private _thumbnail: HTMLDivElement;
    private _layout: HTMLDivElement;
    private _layoutDescription: HTMLDivElement;
    private static _wp: WidgetPickerGUI;
    private _existWidgetsTypes: WidgetGUIModel[];
    constructor() {
        this._existWidgetsTypes = [];
        //content widgets
        this._contentWidget = h("div", { class: _blockWindowStyle });
        this._text = h("div", { class: _block });
        let textIcon = h("button", {}, mdIcon(MD_TEXT_FIELDS));
        let textDescription = h("div", { class: _description }, "Text");
        this._image = h("div", { class: _block });
        let imgIcon = h("button", {}, mdIcon(MD_IMAGE));
        let imgDescription = h("div", { class: _description }, "Image");
        this._video = h("div", { class: _block });
        let videoIcon = h("button", {}, mdIcon(MD_VIDEOCAM));
        let videoDescription = h("div", { class: _description }, "Video");
        this._divider = h("div", { class: _block });
        let dividerIcon = h("button", {}, mdIcon(MD_VIEW_DAY));
        let docDescription = h("div", { class: _description }, "Divider");
        // this.socialFollow = h("div", { class: _block });
        // let socialFollowIcon = h("button", {}, mdIcon(MD_SHARE));
        // let sfDescription = h("div", { class: _description }, "Share Links");
        // this.files = h("div", { class: _block });
        // let filesIcon = h("button", {}, mdIcon(MD_FOLDER_OPEN));
        // let filesDescription = h("div", { class: _description }, "Files");
        this._button = h("div", { class: _block });
        let buttonIcon = h("button", {}, mdIcon(MD_CROP_16_9));
        let buttonDescription = h("div", { class: _description }, "Button");
        this._thumbnail = h("div", { class: _block });
        let thumbnailIcon = h("button", {}, mdIcon(MD_ART_TRACK));
        let thumbnailDescription = h("div", { class: _description }, "Thumbnail");
        this._heading1 = h("div", { class: _block });
        let heading1Icon = h("button", {}, mdIcon(MD_HEADING1));
        let h1Description = h("div", { class: _description }, "Heading 1");
        this._heading2 = h("div", { class: _block });
        let heading2Icon = h("button", {}, mdIcon(MD_HEADING2));
        let h2Description = h("div", { class: _description }, "Heading 2");
        this._heading3 = h("div", { class: _block });
        let heading3Icon = h("button", {}, mdIcon(MD_HEADING3));
        let h3Description = h("div", { class: _description }, "Heading 3");

        //Layout widgets
        this._layout = h("div", { class: _block });
        let layoutIcon = h("button", {}, mdIcon(MD_VIEW_LIST));
        this._layoutDescription = h("div", { class: _description }, "Layout");

        //change icon style
        let iconList = [
            textIcon,
            heading1Icon,
            heading2Icon,
            heading3Icon,
            imgIcon,
            videoIcon,
            dividerIcon,
            buttonIcon,
            thumbnailIcon,
            layoutIcon,
            // socialFollowIcon,
            // filesIcon,
            // imgTextIcon,
        ];

        for (var i = 0; i < iconList.length; i++) {
            iconList[i].style.cursor = "pointer",
                iconList[i].style.backgroundColor = "var(--bg-dim)";
            iconList[i].style.fontSize = "30px";
            iconList[i].style.height = "55px";
            iconList[i].style.maxWidth = "100px";
            iconList[i].style.color = "var(--icon)";
            iconList[i].style.border = "0.5px solid var(--icon)";
        }

        h(this._text, {}, textIcon, textDescription);
        h(this._heading1, {}, heading1Icon, h1Description);
        h(this._heading2, {}, heading2Icon, h2Description);
        h(this._heading3, {}, heading3Icon, h3Description);
        h(this._image, {}, imgIcon, imgDescription);
        h(this._video, {}, videoIcon, videoDescription);
        h(this._divider, {}, dividerIcon, docDescription);
        h(this._button, {}, buttonIcon, buttonDescription);
        h(this._thumbnail, {}, thumbnailIcon, thumbnailDescription);
        h(this._layout, {}, layoutIcon, this._layoutDescription);
        h(
            this._contentWidget,
            {},
            // h(this.socialFollow, _{}, socialFollowIcon, sfDescription),
            // h(this.files, {}, filesIcon, filesDescription),
            // h(this.imgText, {}, imgTextIcon, itDescription),
        );
    }

    // This method used to allow user create widgets from template as well as users themselves.
    createWidgets(template: Template, widgetWindow: HTMLElement) {
        let components: Blocks[] | undefined = template.blocks();

        //create vertical and horizontal compound blocks
        let vertical = new LayoutGUIModel("Vertical");
        let horizontal = new LayoutGUIModel("Horizontal");
        h(this._contentWidget!, {}, vertical.el(), horizontal.el());

        this._existWidgetsTypes.push(vertical);
        this._existWidgetsTypes.push(horizontal);
        // in the future fix any
        components!.forEach((component: any) => {

            switch (component.type()) {
                case "text":
                    let text = new TextGUIModel(component.name(), component.type(), component.label()!);
                    h(widgetWindow, {}, h(this._contentWidget!, {}, text.el()));
                    this._existWidgetsTypes.push(text);
                    break;

                case "action":
                    let action = new ActionGUIModel(component.name());
                    h(this._contentWidget!, {}, action.el());
                    this._existWidgetsTypes.push(action);
                    break;

                case "image":
                    let image = new ImageGUIModel(component.name(), component.size()!, component.extension()!);
                    h(this._contentWidget!, {}, image.el());
                    this._existWidgetsTypes.push(image);
                    break;

                case "layout":
                    let layout = new LayoutGUIModel(component.name(), component);
                    h(this._contentWidget!, {}, layout.el());
                    this._existWidgetsTypes.push(layout);
                    break;

                default:
                    break;
            }
        })
        // DropToOutline.getInstance().dragFromPanel(this._existWidgetsTypes);
    }

    static getInstance(): WidgetPickerGUI {
        if (WidgetPickerGUI._wp == null) {
            WidgetPickerGUI._wp = new WidgetPickerGUI();
        }
        return WidgetPickerGUI._wp;
    }

    addToParent(parent: HTMLElement) {
        h(parent, {}, this._contentWidget);
    }

    getExistWidgetsTypes() {
        return this._existWidgetsTypes;
    }

    getContentWidget(): HTMLDivElement {
        return this._contentWidget;
    }

    //todo bug: why this cannot work
    clear() {
        clear(this._contentWidget);
    }
}