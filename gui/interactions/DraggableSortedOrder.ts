import { html as h } from "../../commons/lib/dom/create";
import { DraggableSortedList } from "../../utils/DraggableSortedList";
import { WidgetGUI } from "../elementPanel/element/blocks/WidgetGUI";
import { Outline } from "../outline/Outline";
import { PreviewWindow } from "../previewWindow/PreviewWindow";

export class DraggableSortedOrder {
    ghostParent: HTMLDivElement | undefined;
    existPwWidgets: HTMLElement[];
    existOutline: HTMLElement[];
    existObjectWidgets: WidgetGUI[];
    dslPw: DraggableSortedList | undefined;
    private static _dso: DraggableSortedOrder;
    dslOutline: DraggableSortedList | undefined;

    constructor() {
        this.existPwWidgets = [];
        this.existOutline = [];
        this.existObjectWidgets = [];


        this.dslPw = new DraggableSortedList(
            this.existPwWidgets,
            {
                onclick: () => {
                },

                onmove: () => {
                },
            }
        );

        this.dslOutline = new DraggableSortedList(
            this.existOutline,
            {
                onclick: () => {
                },

                onmove: () => {
                },
            }
        )
    }

    static getInstance(): DraggableSortedOrder {
        if (DraggableSortedOrder._dso == null) {
            DraggableSortedOrder._dso = new DraggableSortedOrder();
        }
        return DraggableSortedOrder._dso;
    }

    reorderPreviewWindow(insertEl: HTMLDivElement) {
        this.dslPw!.addToList({ el: insertEl });
    }

    reorderOutline(insertEl: HTMLDivElement) {
        this.dslOutline!.addToList({ el: insertEl });
    }

    addPreviewWindowEl(widgetEl: HTMLElement, widgetObject: WidgetGUI) {
        this.existPwWidgets.push(widgetEl);
        this.existObjectWidgets.push(widgetObject);
    }

    addOutline(widget: HTMLElement) {
        this.existOutline.push(widget);
    }
}