import { html as h } from "../../../commons/lib/dom/create";
import { ElementsPanel } from "../../elementPanel/widgetPanelGUI/ElementsPanel";
import { Outline } from "../../outline/Outline";
import { PreviewWindow } from "../../previewWindow/PreviewWindow";

export function GhostVisualEffect(ghostWidget: HTMLElement, newOutline: HTMLElement, widgetElement: HTMLElement) {
    ElementsPanel.getInstance().el().onmouseenter = () => {
        ghostWidget.style.display = "block";
    }

    Outline.getInstance().el().onmouseenter = () => {
        ghostWidget.style.display = "none";
        h(Outline.getInstance().el(), {}, newOutline);
    }

    PreviewWindow.getInstance().el().onmouseenter = () => {
        ghostWidget.style.display = "none";
        h(PreviewWindow.getInstance().el(), {}, widgetElement);
    }

    PreviewWindow.getInstance().el().onmouseleave = () => {
        ghostWidget.style.display = "block";
    }

    Outline.getInstance().el().onmouseleave = () => {
        ghostWidget.style.display = "block";
    }
}