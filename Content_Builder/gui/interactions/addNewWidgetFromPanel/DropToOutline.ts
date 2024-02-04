import { draggable } from "../../../utils/Drag";
import { html as h } from "../../../commons/lib/dom/create";
import { TextGUI } from "../../elementPanel/element/blocks/typography/TextGUI";
import { ImageGUI } from "../../elementPanel/element/blocks/media/ImageGUI";
import { TextGUIModel } from "../../../gui-model/TextGUIModel";
import { ImageGUIModel } from "../../../gui-model/ImageGUIModel";
import { ActionGUIModel } from "../../../gui-model/ActionGUIModel";
import { LayoutGUIModel } from "../../../gui-model/LayoutGUIModel";
import { PreviewWindow } from "../../previewWindow/PreviewWindow";
import { ButtonGUI } from "../../elementPanel/element/blocks/interaction/ButtonGUI";
import { DraggableSortedOrder } from "../DraggableSortedOrder";
import { Outline } from "../../outline/Outline";
import { _block } from "../../../gui-model/BlockStyle";
import { WidgetPickerGUI } from "../../elementPanel/widgetPanelGUI/WidgetPickerGUI";
import { LayoutGUI } from "../../elementPanel/element/blocks/typography/LayoutGUI";
import { WordCount } from "../../previewWindow/bottomInfoBar/WordCount";
import { CommandAction } from "../undo/CommandAction";
import { StyleItems } from "../../../model/template/document/StyleItems";
import { ParseLayoutCompoundBlockXml } from "../parseXML/ParseLayoutCompoundBlockXml";
import { WidgetGUIModel } from "../../../gui-model/WidgetGUIModel";
import { WidgetGUI } from "../../elementPanel/element/blocks/WidgetGUI";
import { AddToOutlineWindow } from "./AddToOutlineWindow";
import { AddToPreviewWindow } from "./AddToPreviewWindow";
import { GhostVisualEffect } from "./GhostVisualEffect";
import { PreventionWarning } from "./PreventionWarning";
import { WidgetDropEnd } from "./WidgetDropEnd";
import { ClearBorderColorAfterDrop } from "./ClearBorderColorAfterDrop";
import { FlowRuleGUIModel } from "../../../gui-model/FlowRuleGUIModel";
import { CompareTwoAry } from "../../../utils/CompareTwoAry";
import { CheckAcceptance } from "../prevention/CheckAcceptance";
import { ContainerAcceptance } from "../../../model/template/layout/ContainerAcceptance";
import { CorrespondingName } from "./CorrespondingName";

export class DropToOutline {
    private static _dropOutline: DropToOutline;
    selectedEl: HTMLDivElement | null | undefined;
    selectedOutline: HTMLDivElement | null | undefined;
    pwLayoutAry: HTMLDivElement[];
    outlineLayoutAry: HTMLDivElement[];
    followedRules: boolean;
    followedAccept: boolean;
    followedFirst: boolean;
    followedLast: boolean;
    acceptAry: string[];
    first: string | undefined;
    last: string | undefined;
    rules: string[];
    uniqueArray: string[];

    private constructor() {
        //comment this 
        this.pwLayoutAry = [];
        //comment this 
        this.outlineLayoutAry = [];
        //selected could be preview el and outline el, depends on which window they are locate at
        this.selectedEl;
        //check whether the widget follow the rule
        this.followedRules = false;
        //check whether the widget follow the accept
        this.followedAccept = false;
        //check whether the widget follow the first
        this.followedFirst = false;
        //check whether the widget follow the last
        this.followedLast = false;

        // accept array includes acceptance
        this.acceptAry = [];
        this.first;
        this.last;

        // rules is the specific from A to B, that widget.el() not satisfied
        this.rules = [];

        //this is accept unique array (reason: when from A to B, there will be next A = B, so the array needs to be unique )
        this.uniqueArray = [];
    }

    static getInstance(): DropToOutline {
        if (DropToOutline._dropOutline == null) {
            DropToOutline._dropOutline = new DropToOutline();
        }
        return DropToOutline._dropOutline;
    }

    // add new widget from panel (check the flow rules here)
    dragFromPanel(existWidgetsTypes: WidgetGUIModel[]) {
        let that = this;
        let widget: WidgetGUI;

        existWidgetsTypes.forEach((widgetType: WidgetGUIModel) => {

            // build a ghost element for widget
            let ghostWidget: HTMLElement = widgetType.el().cloneNode(true) as HTMLElement;

            that.selectedEl = null;
            that.selectedOutline = null;

            let newOutline = h("div", { id: "0" }, widgetType.name());

            // build another ghost element for another window
            draggable(widgetType.el(), {
                start() {
                    if (widgetType instanceof TextGUIModel) {
                        widget = new TextGUI("", "true", "", widgetType.name(), widgetType.label()!, 0);
                        WordCount.getInstance().wordCountAry().set(widget.el(), 0);
                        newOutline = Outline.getInstance().createSingleOutline(widgetType.name(), 3, widget);
                    }

                    if (widgetType instanceof ImageGUIModel) {
                        widget = new ImageGUI("true", widgetType.instruction()!, widgetType.name(), "image", 0, widgetType.size(), widgetType.extension());
                        newOutline = Outline.getInstance().createSingleOutline(widgetType.name(), 1, widget);
                    }

                    //this is a compound block widget
                    if (widgetType instanceof LayoutGUIModel) {
                        if (widgetType.name() == "Vertical") {
                            widget = new LayoutGUI(widgetType.name(), "", 0, "");
                            newOutline = Outline.getInstance().createSingleOutline("Vertical", 1, widget);
                        }

                        else if (widgetType.name() == "Horizontal") {
                            widget = new LayoutGUI(widgetType.name(), "", 0, "");
                            newOutline = Outline.getInstance().createSingleOutline("Horizontal", 1, widget);
                        }
                        else {
                            widget = new LayoutGUI(widgetType.name(), "", 0, "", widgetType.component());
                            newOutline = Outline.getInstance().createSingleOutline(widgetType.name(), 1, widget);
                            //parse the compound blocks
                            ParseLayoutCompoundBlockXml(widgetType.component()!.LayoutContainer()!, widget.el(), newOutline, 1, that.outlineLayoutAry, that.pwLayoutAry);
                        }
                    }

                    if (widgetType instanceof ActionGUIModel) {
                        widget = new ButtonGUI(widgetType.name(), "button", 0);
                        newOutline = Outline.getInstance().createSingleOutline(widgetType.name(), 1, widget);
                    }

                    that.selectedEl = widget.el();
                    that.selectedOutline = newOutline;

                    ghostWidget.style.position = "fixed";
                    ghostWidget.style.display = "block";
                    ghostWidget.style.pointerEvents = "none";

                    h(WidgetPickerGUI.getInstance().getContentWidget(), {}, ghostWidget);

                    // this is the widgetType element ghost (ghost preview, ghost outline and widgetType element)
                    GhostVisualEffect(ghostWidget, newOutline, widget.el());
                },

                // fix any in the future
                move(data: any) {

                    ghostWidget.style.left = `${data.current.x}px`;
                    ghostWidget.style.top = `${data.current.y}px`;
                    widget.el().id = "continue";
                    widget.el().style.backgroundColor = "var(--bg-dim)";
                    newOutline.style.backgroundColor = "var(--label)";

                    // insert new widget to pw window
                    AddToPreviewWindow(that.selectedOutline!, that.selectedEl!,true);
                    // insert new widget to outline window
                    // AddToOutlineWindow(that.selectedOutline!, that.selectedEl!);

                    Outline.getInstance().el().parentElement!.onmouseleave = () => {
                        widget.el().remove();
                        newOutline.remove();
                    }

                    PreviewWindow.getInstance().el().onmouseleave = () => {
                        widget.el().remove();
                        newOutline.remove();
                    }

                    // Outline.getInstance().el().parentElement!.onmouseenter = () => {
                    //     Outline.getInstance().addToChild(newOutline);
                    //     PreviewWindow.getInstance().addToChild(widget.el());
                    // }

                    // PreviewWindow.getInstance().el().onmouseenter = () => {
                    //     Outline.getInstance().addToChild(newOutline);
                    //     PreviewWindow.getInstance().addToChild(widget.el());
                    // }

                    // check the flow rules
                    that.checkFlowRules(widget.el());

                    // check the acceptance, first and last
                    that.checkWidgetAcceptance(widget);

                    // console.log(widget.name());

                    // scenario 1.2 : empty layout or delete all elements and check again
                    if ((widget.el().parentElement == PreviewWindow.getInstance().el()) && (widget.el().parentElement?.childNodes == null)) {
                        console.log("scenario 2 : move - empty");
                        // in this case, still need to check the flow rules
                        // that.checkFlowRules(widget.el());
                    }
                    
                },

                end() {

                    ghostWidget.remove();
                    widget.el().style.backgroundColor = "var(--bg)";
                    newOutline.style.backgroundColor = "var(--bg)";

                    // when outline window and preview window is a empty layout (reason: need to re-assign etc.)
                    if (Outline.getInstance().el().childNodes.length == 1 || Outline.getInstance().el().childNodes.length == 0) {

                        // todo: this bug drag might generate two widget，（maybe includes a container)
                        console.log("end - empty window.");

                        // todo add on preview (el and array)
                        widget.el().id = "a1";
                        DraggableSortedOrder.getInstance().existPwWidgets.splice(0, 0, widget.el());

                        // todo add on outline (el and array)
                        DraggableSortedOrder.getInstance().existOutline.splice(0, 0, newOutline);

                        let outlineIdx = widget.el().id.replace("a", "");
                        newOutline.id = outlineIdx;
                        newOutline.style.textIndent = (Number(outlineIdx) - 2) + 0.7 + `rem`;

                        // DraggableSortedOrder.getInstance().existOutline.forEach((el: HTMLElement) => {
                        //     Outline.getInstance().addToChild(el);
                        // });

                        // todo remove two of one elements

                        // todo redo and undo 
                        // CommandAction.add(widget.el(), newOutline, afterIdx, afterIdx, widget.el().parentElement!);
                        // StyleItems.getInstance().setDropStyle(widget.el());
                        // followedAccept == true;
                    }

                    // when not select an empty layout will ignore the flow rules and acceptance
                    else {
                        console.log("end - not an empty ");
                        if (!that.followedRules || !that.followedAccept || !that.followedFirst || !that.followedLast) {
                            // widget.el().parentElement!.onmouseover = null;
                            // widget.el().parentElement!.onmouseleave = null;
                            widget.el().remove();
                            newOutline.remove();
                            PreventionWarning(that.followedRules!, that.followedAccept, that.followedFirst, that.followedLast, widget.name(), that.uniqueArray, that.first!, that.last!, that.rules);
                        }

                        else {
                            let idx: number | undefined;
                            let outlineIdx: string | undefined;
                            if (widget.el().id == "continue") {
                                if (widget.el().previousSibling != null) {
                                    console.log("end - previous not null");
                                    WidgetDropEnd(widget.el(), newOutline, that.outlineLayoutAry, that.pwLayoutAry);
                                }

                                else {
                                    console.log("end - 0 previous");
                                    let next = widget.el().nextSibling as HTMLElement;
                                    idx = DraggableSortedOrder.getInstance().existPwWidgets.indexOf(next);
                                    // let afterIdx = DraggableSortedOrder.getInstance().existPwWidgets.indexOf(next);

                                    CommandAction.add(widget.el(), newOutline, idx, idx, widget.el().parentElement!);

                                    // todo testing for more widgets adding  (when its empty it will be restructure the id )
                                    // goal for this statement
                                    // if (PreviewWindow.getInstance().el().childNodes.length <= 2) {
                                    //     widget.el().id = "2";
                                    // }

                                    widget.el().id = next!.id;

                                    outlineIdx = widget.el().id.replace("a", "");

                                    newOutline.id = outlineIdx;
                                }

                                that.updateTwoAryAfterDrop(widget, idx!, newOutline, outlineIdx!);

                                // if (widget instanceof TextGUI || ImageGUI || ButtonGUI) {
                                //     StyleItems.getInstance().setDropStyle(widget.el());

                                //     // if drag a layout it should generate multiple outline
                                //     if (that.pwLayoutAry != null) {
                                //         for (var i = 0; i < this.pwLayoutAry.length; i++) {
                                //             let id = Number(widget.el().id) + 1;
                                //             that.pwLayoutAry[i].id = "a" + id;
                                //             DraggableSortedOrder.getInstance().existPwWidgets.splice((afterIdx + i), 0, that.pwLayoutAry[i]);
                                //             console.log("pwLayoutAry not null");
                                //         }
                                //     }

                                //     // console.log(widget.el());
                                //     DraggableSortedOrder.getInstance().existPwWidgets.splice(afterIdx, 0, widget.el());

                                //     // if drag a layout it should generate multiple outline
                                //     if (that.outlineLayoutAry != null) {
                                //         for (var i = 0; i < that.outlineLayoutAry.length; i++) {
                                //             that.outlineLayoutAry[i].id = (Number(newOutline.id) + 1).toString();
                                //             DraggableSortedOrder.getInstance().existOutline.splice((afterIdx + i), 0, that.outlineLayoutAry[i]);
                                //         }
                                //     }
                                //     newOutline.style.textIndent = (Number(outlineIdx) - 2) + 0.7 + `rem`;

                                //     for (var i = 0; i < that.outlineLayoutAry.length; i++) {
                                //         that.outlineLayoutAry[i].style.textIndent = newOutline.style.textIndent;
                                //     }
                                //     DraggableSortedOrder.getInstance().existOutline.splice(afterIdx, 0, newOutline);
                                // }

                                DraggableSortedOrder.getInstance().existOutline.forEach((el: HTMLElement) => {
                                    Outline.getInstance().addToChild(el);
                                });
                            }
                        }
                    }

                    // console.log("test end");
                    // that.selectedEl = null;
                    // that.selectedOutline = null;
                    // PreviewWindow.getInstance().el().onmouseenter = null;
                    // PreviewWindow.getInstance().el().onmouseleave = null;
                    // Outline.getInstance().el().onmouseenter = null;
                    // Outline.getInstance().el().onmouseleave = null;

                    ghostWidget.style.position = "";
                    ClearBorderColorAfterDrop(widget.el());
                },
            });
        });
    }

    checkWidgetAcceptance(widget: WidgetGUI | HTMLDivElement) {
        let widgetEl;
        let widgetTitle;
        if (widget instanceof WidgetGUI) {
            widgetEl = widget.el();
            widgetTitle = widget.name();
        } else {
            widgetEl = widget;
            widgetTitle = widget.title;
        }
        if (CheckAcceptance.getInstance().accepts.get(widgetEl.parentElement!)) {
            console.log("CheckWidgetAcceptance - get");

            CheckAcceptance.getInstance().accepts.forEach((values) => {
                console.log("second round in CheckAcceptance");
                values.forEach((value: ContainerAcceptance) => {
                    this.acceptAry.push(value.blockRef());
                })
            })

            // if cannot find the element which means 
            if (this.acceptAry.indexOf(widgetTitle) !== -1) {
                this.followedAccept = true;
            }
            else {
                this.followedAccept = false;
            }
        }
        else {
            this.followedAccept = true;
        }

        // find the unique array values
        this.uniqueArray = [...new Set(this.acceptAry)];


        if (CheckAcceptance.getInstance().first.get(widgetEl.parentElement!)) {
            this.first = CheckAcceptance.getInstance().first.values().next().value;
            let name = widgetEl.parentElement!.firstElementChild as HTMLElement;

            if (this.first == CorrespondingName(name.title)) {
                this.followedFirst = true;
            }
            else {
                this.followedFirst = false;
            }
        }
        else {
            this.followedFirst = true;
        }

        if (CheckAcceptance.getInstance().last.get(widgetEl.parentElement!)) {
            this.last = CheckAcceptance.getInstance().last.values().next().value;
            let name = widgetEl.parentElement!.lastElementChild as HTMLElement;

            if (this.last == CorrespondingName(name.title)) {
                this.followedLast = true;
            }
            else {
                this.followedLast = false;
            }
        } else {
            this.followedLast = true;
        }
    }

    checkFlowRules(widgetEl: HTMLDivElement) {
        // containerEls includes widget.el currently at a certain layer's all children nodes; e.g. widget.el(for example is h2) drag into a layer [text, h1, h2, compound layout]
        let containerEls: HTMLElement[] = [];
        //containerEls all the els title name in this container
        let containerTitles: string[] = [];

        let requiredAry: string[] = [];

        let requiredArySecond: string[] = [];

        let insertOneElInEmptyLayout = false;

        //if the container has multiple elements, there will have chances to check the flow rules based on those children elements
        if (widgetEl.parentElement?.childNodes != null) {
            widgetEl.parentElement?.childNodes.forEach((children: ChildNode) => {
                let c = children as HTMLElement;
                if (c.title == "text" || c.title == "Paragraph") {
                    c.title = "p";
                    containerEls.push(c);
                    containerTitles.push(c.title);
                }

                else if (c.title != null) {
                    containerEls.push(c);
                    containerTitles.push(c.title);

                    if (c.title == "") {
                        containerTitles.push("layout-");
                    }
                }

                else {
                    c.title = "layout";
                    containerEls.push(c);
                    containerTitles.push("layout");
                }
            })

            let y = PreviewWindow.getInstance().el().querySelectorAll("div");
            let j;
            for (j = 0; j < y.length; j++) {
                // console.log(y[j]);
                if (typeof y[j].title === "undefined") {
                    console.log("this is a null");
                }
             }

            // this method is to find array with target elements
            widgetEl.parentElement!.onmouseover = () => {
                PreviewWindow.getInstance().el().style.border = "0.5px solid grey";

                let x = PreviewWindow.getInstance().el().querySelectorAll("div");

                let i;

                for (i = 0; i < x.length; i++) {
                    if (x[i].style.border != "") {
                        x[i].style.border = "0.1px solid var(--bg-dim)";
                    }
                }

                // in this class
                // if (followedRule == null) {
                if (this.followedRules && this.followedAccept) {
                    if (widgetEl.parentElement != null) {
                        widgetEl.parentElement!.style.border = "1px dotted var(--accent-success-active)";
                    }
                }

                else {
                    console.log(widgetEl.parentElement);
                    if (widgetEl.parentElement != null) {
                        widgetEl.parentElement!.style.border = "1px dotted var(--accent-error-active)";
                    }
                }

                // in draggableSortedList for existing element reordering
                // } else {
                //     if (followedRule && followedAccept) {
                //         widgetEl.parentElement!.style.border = "1px dotted var(--accent-success-active)";
                //     }

                //     else {
                //         widgetEl.parentElement!.style.border = "1px dotted var(--accent-error-active)";
                //     }
                // }


                // every time widget parent changed, then empty the acceptance array.
                this.acceptAry = [];

                //FIXME: change the first and last
                this.first = "";
                this.last = "";
            }

            widgetEl.parentElement!.onmouseleave = () => {
                // event.preventDefault();
                // widgetEl.parentElement!.style.border = "0.1px solid var(--bg-dim)";
                if (widgetEl.parentElement != null) {
                    widgetEl.parentElement!.style.border = "0.1px solid red";
                }
            }

            let widgetIdx = containerEls.indexOf(widgetEl);

            // if widget.el is the last element then check the [widget.el()'s previous node, widget.el()]
            if (widgetIdx == containerEls.length) {
                requiredAry = [containerTitles[widgetIdx - 1], containerTitles[widgetIdx]];
                requiredArySecond = [];
            }

            // widget.el is the only child of the container ps: also include the scenario that it is a empty layout
            else if (widgetIdx == 0) {
                // when only one element in this layer
                if (containerEls.length == 1) {
                    insertOneElInEmptyLayout = true;
                }

                // todo : if only one element which means only one index
                requiredAry = [containerTitles[widgetIdx], containerTitles[widgetIdx + 1]];
                requiredArySecond = [];
            }

            else {
                requiredAry = [containerTitles[widgetIdx - 1], containerTitles[widgetIdx]];
                requiredArySecond = [containerTitles[widgetIdx], containerTitles[widgetIdx + 1]];
            }
        }

        else {
            console.log("check flow rule - parent has no children");
            // this.checkFlowRules(widget.el());
        }

        let n = FlowRuleGUIModel.getInstance().generate2DRulesAry().length;
        let m = FlowRuleGUIModel.getInstance().generate2DRulesAry()[0].length;

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {

                if (FlowRuleGUIModel.getInstance().generate2DRulesAry()[i][j] == widgetEl.title) {

                    this.rules = FlowRuleGUIModel.getInstance().generate2DRulesAry()[i];

                    let twoAryEqual = CompareTwoAry(FlowRuleGUIModel.getInstance().generate2DRulesAry()[i], requiredAry);

                    //when target widget in the middle of the array and it need to be checked twice
                    let threeAryEqual = CompareTwoAry(FlowRuleGUIModel.getInstance().generate2DRulesAry()[i], requiredArySecond);

                    if (twoAryEqual || insertOneElInEmptyLayout || requiredAry.includes("layout")) {
                        this.followedRules = true;
                        // FIXME: fix this scenario

                        // if (requiredArySecond != [] && !threeAryEqual) {
                        //     followedRules = false;
                        // }

                    }
                    else {
                        this.followedRules = false;
                    }
                }

                // this scenario means the target is not been included in the flow rule widgets (the widgets not been included in the flow rule could be insert anywhere)
                else {
                    this.followedRules = true;
                }
            }
        }
    }

    // check whether it will satisfy the all rules, return true if one of the rules is not satisfied
    preventionWarning(el: HTMLElement): boolean {
        PreventionWarning(this.followedRules!, this.followedAccept, this.followedFirst, this.followedLast, el.title, this.uniqueArray, this.first!, this.last!, this.rules);
        if (!this.followedRules || !this.followedAccept || !this.followedFirst || !this.followedLast) {
            return true;
        }
        return false;
    }

    updateTwoAryAfterDrop(widget: WidgetGUI, afterIdx: number, newOutline: HTMLDivElement, outlineIdx: string) {
        if (widget instanceof TextGUI || ImageGUI || ButtonGUI) {
            StyleItems.getInstance().setDropStyle(widget.el());

            // if drag a layout it should generate multiple outline
            if (this.pwLayoutAry != null) {
                for (var i = 0; i < this.pwLayoutAry.length; i++) {
                    let id = Number(widget.el().id) + 1;
                    this.pwLayoutAry[i].id = "a" + id;
                    DraggableSortedOrder.getInstance().existPwWidgets.splice((afterIdx + i), 0, this.pwLayoutAry[i]);
                    console.log("pwLayoutAry not null");
                }
            }

            DraggableSortedOrder.getInstance().existPwWidgets.splice(afterIdx, 0, widget.el());

            // if drag a layout it should generate multiple outline
            if (this.outlineLayoutAry != null) {
                for (var i = 0; i < this.outlineLayoutAry.length; i++) {
                    this.outlineLayoutAry[i].id = (Number(newOutline.id) + 1).toString();
                    DraggableSortedOrder.getInstance().existOutline.splice((afterIdx + i), 0, this.outlineLayoutAry[i]);
                }
            }

            newOutline.style.textIndent = (Number(outlineIdx) - 2) + 0.7 + `rem`;

            for (var i = 0; i < this.outlineLayoutAry.length; i++) {
                this.outlineLayoutAry[i].style.textIndent = newOutline.style.textIndent;
            }

            DraggableSortedOrder.getInstance().existOutline.splice(afterIdx, 0, newOutline);

        }
    }
}