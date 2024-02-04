import { createClass as cls } from "../../../commons/lib/css/create";
import { html as h } from "../../../commons/lib/dom/create";
import { FlowRuleGUIModel } from "../../../gui-model/FlowRuleGUIModel";
import { LayoutGUIModel } from "../../../gui-model/LayoutGUIModel";
import { LayoutCompoundBlocks } from "../../../model/template/components/LayoutCompoundBlocks";
import { Template } from "../../../model/template/document/Template";
import { Outline } from "../../outline/Outline";
import { PreviewWindow } from "../../previewWindow/PreviewWindow";
import { DraggableSortedOrder } from "../DraggableSortedOrder";
import { ContentIteration } from "./ContentIteration";

const _popupChooseBtn = cls({
    backgroundColor: "var(--bg-active)",
    border: `2px solid var(--separator)`,
    borderRadius: "6px",
    color: 'var(--fg)',
    cursor: "pointer",
    width: "100px",
    height: "30px",
    margin: "30px",
    marginRight:"0px",
    textTransform: "capitalize",
    fontWeight: "bold",
    "&:active": {
        opacity: 0.8,
    },
    "&:disabled": {
        opacity: 0.5,
        backgroundColor: 'var(--bg)',
    }
})

const _popupLayout = cls({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    width: "100%",
})

const _layoutContainer = cls({
    border: "0.1px solid transparent",
    cursor: "pointer",
    marginTop: "30px",
    height: "100%",
    width: "100%",
    userSelect: "none",
    "&:hover": {
        border: "0.1px solid var(--accent-warning)",
    },
    "&:active": {
        opacity: 0.7,
    },
    "&:disabled": {
        opacity: 0.6,
        backgroundColor: 'var(--bg)',
    }
})

const _btnGroup = cls({
    display: "flex",
    flexDirection: "row",
})

const _btnSet = cls({
    display: "flex",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: "auto",
    cursor: "pointer",
    userSelect: "none",
})

const _popupBtn = cls({
    backgroundColor: "var(--bg-active)",
    border: `2px solid var(--separator)`,
    borderRadius: "6px",
    color: 'var(--fg)',
    cursor: "pointer",
    width: "100%",
    height: "30px",
    textTransform: "capitalize",
    fontWeight: "bold",
    "&:active": {
        opacity: 0.8,
    },
    "&:disabled": {
        opacity: 0.5,
        backgroundColor: 'var(--bg)',
    }
})

//withConvention is the vertical and horizontal
export function ApplyDocumentLayouts(template: Template | LayoutGUIModel, fileName: string) {

    if (template instanceof LayoutGUIModel) {
        ContentIteration(template.component(), true);
    }
    else {
       FlowRuleGUIModel.getInstance()._flowRulesAry = template.flowRules()!;

        let documentLayouts = template.documentLayouts();

        let layoutContent = h("div", { class: _popupLayout });

        //choose which layout user want to apply
        let changeLayout: internalSystem.StandardResizableDialog = new internalSystem.StandardResizableDialog({
            title: "Choose a template layout",
            content:
                h(layoutContent, {},
                    h("h4", {style: "user-select:none"}, "Which layout that you want to apply to your document?"),
                    h("div", { class: _btnSet })
                ),
            width: 700,
            height: 700,
        });

        // provide a empty layout option
        let emptyLayout = h("div", { class: _layoutContainer, id: "layout preview" });

        let emptyBtn = h("button", { class: _popupBtn, style: {} }, "Not Apply Any Layout");

        h(emptyLayout, {}, emptyBtn);

        emptyLayout.style.marginTop = "30px";
        layoutContent.onblur = () => {
            yesLayoutBtn.disabled = true;
        }

        emptyLayout.onmouseover = () => {
            emptyLayout.style.border = "0.1px solid var(--accent-warning)";
        }

        emptyLayout.onmouseout = () => {
            if (emptyLayout.id != "selected") {
                emptyLayout.style.border = "0.1px solid transparent";
            }
        }

        emptyBtn.onclick = () => {
            yesLayoutBtn.disabled = false;
            layoutContent.childNodes.forEach((c: ChildNode) => {
                let previewEl = c as HTMLElement;
                previewEl.style.border = "0.1px solid transparent";
                previewEl.id = "layout preview";
            })

            emptyLayout.id = "selected";
            emptyLayout.style.borderColor = "var(--accent-warning)";
            choose = "none";
            
        }

        let choose: LayoutCompoundBlocks | string;
        documentLayouts!.forEach((l: LayoutCompoundBlocks) => {

            let layoutContainer = h("div", { class: _layoutContainer, id: "layout preview" });

            let layout = h("div", { style: { height: "100%", width: "100%", pointerEvents: "none" } });

            ContentIteration(l, false, layout, false);

            let nameBtn = h("button", { class: _popupBtn, }, l.name());

            h(layoutContent, {}, h(layoutContainer, {}, nameBtn, layout));

            layoutContainer.onclick = () => {

                layoutContent.childNodes.forEach((p: ChildNode) => {
                    let previewEl = p as HTMLElement;
                    previewEl.style.border = "0.1px solid transparent";
                    previewEl.id = "layout preview";
                })

                layoutContainer.id = "selected";

                yesLayoutBtn.disabled = false;

                choose = l;

                layoutContainer.style.border = "0.1px solid var(--accent-warning)";

            }

            layoutContent.childNodes.forEach((p: ChildNode) => {
                let previewEl = p as HTMLElement;

                if (previewEl.id != "selected") {

                    previewEl.style.border = "0.1px solid transparent";
                }
            })

            layoutContainer.onmouseover = () => {
                layoutContainer.style.border = "0.1px solid var(--accent-warning)";
            }

            layoutContainer.onmouseout = () => {
                if (layoutContainer.id != "selected") {
                    layoutContainer.style.border = "0.1px solid transparent";
                }
            }
        })

        let yesLayoutBtn = h("button", {
            class: _popupChooseBtn,
            onclick: () => {
                changeLayout.close();

                PreviewWindow.getInstance().clearPreviewWindow();

                Outline.getInstance().clearOutline();

                let PreviewWindowEl = h("div", { style: { border: "0.1px solid transparent" } });

                ContentIteration(choose, false, PreviewWindowEl, true);

                // let outline display as array list rather than nest structure (aims to display ghost outline properly)
                Outline.getInstance().clearOutline();

                DraggableSortedOrder.getInstance().existOutline.forEach((el: HTMLElement) => {
                    Outline.getInstance().addToChild(el);
                });
                
                internalSystem.notification("Upload Template <" + fileName + ">  Successfully!");

            }
            , disabled: true
        }, "Next");

        h(layoutContent, {}, emptyLayout);

        h(layoutContent, {},
            h("div", { class: _btnGroup , style: { alignSelf: "flex-end"}},
                yesLayoutBtn)
        )
    }
}