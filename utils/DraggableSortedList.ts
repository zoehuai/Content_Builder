import { html } from "../commons/lib/dom/create";
import { FlowRuleGUIModel } from "../gui-model/FlowRuleGUIModel";
import { onfocusHighlight } from "../gui/elementPanel/element/blocks/typography/TextGUI";
import { AddToOutlineWindow } from "../gui/interactions/addNewWidgetFromPanel/AddToOutlineWindow";
import { AddToPreviewWindow } from "../gui/interactions/addNewWidgetFromPanel/AddToPreviewWindow";
import { ClearBorderColorAfterDrop } from "../gui/interactions/addNewWidgetFromPanel/ClearBorderColorAfterDrop";
import { CorrespondingName } from "../gui/interactions/addNewWidgetFromPanel/CorrespondingName";
import { PreventionWarning } from "../gui/interactions/addNewWidgetFromPanel/PreventionWarning";
import { DraggableSortedOrder } from "../gui/interactions/DraggableSortedOrder";
import { CheckAcceptance } from "../gui/interactions/prevention/CheckAcceptance";
import { UpdateIndex } from "../gui/interactions/reorder/UpdateIndex";
import { Outline } from "../gui/outline/Outline";
import { PreviewWindow } from "../gui/previewWindow/PreviewWindow";
import { ContainerAcceptance } from "../model/template/layout/ContainerAcceptance";
import { CompareTwoAry } from "./CompareTwoAry";
import { draggableEx } from "./DragEx";

/*
** This method is customized for content builder, so it's NOT a general draggable sorted list method for developers.
** data: An object that contains a HTMLElement.
** ghostParent: This is an element where we temporarily hold the dragging element.
*/
export class DraggableSortedList {
    data: HTMLElement[];
    options: { onclick(data: any): void, onmove(data: any): void };
    // this two parameters are used for undo and redo functions
    previousParent!: HTMLElement;
    childrenIdx!: number;
    outlineTextIndent: string | undefined;
    ghost: HTMLElement | null;
    ghostAnother: HTMLElement | null;
    followedRules: boolean;
    followedAccept: boolean;
    followedFirst: boolean;
    followedLast: boolean;
    acceptAry: string[];
    first: string | undefined;
    last: string | undefined;
    rules: string[];
    uniqueArray: string[];

    constructor(data: HTMLElement[], options: { onclick(data: any): void, onmove(data: any): void }) {
        this.data = data;
        this.options = options;
        this.ghost = null;
        this.ghostAnother = null;

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

    addToList(d: { el: HTMLDivElement; }) {
        let el = d.el;
        let previousHtml: HTMLElement;

        // drag to a certain position
        draggableEx(el, (data: any) => {

            let isMoving = false;
            let top = 0;
            let left = 0;
            let anotherGhostParent: HTMLElement;

            // used for finding the preview ghost dragging position
            let initialX: number;
            let initialY: number;
            // used for recording the HTML for el and return back when drop finished

            // original index
            let oidx = this.data.indexOf(el);

            // selected could be preview el and outline el, depends on which window they are locate at
            return {
                move: (data: { diff: { size: () => number; }; current: { y: number; x: number; }; }) => {
                    if (data.diff.size() > 2 && !isMoving) {
                        // drag compound elements are not allowed in preview window, it only available in outline window (below is preview window)
                        if (this.checkIsPreviewEl(el)) {
                            // when dragged element in the preview window, the compound elements should not be dragged in the preview window, only single element could be dragged in the preview window. The compound elements could only be dragged in the outline window.
                            onfocusHighlight(el);
                            if (el.title != "layout") {
                                this.ghost = el.cloneNode(true) as HTMLElement;
                                this.ghost.style.cursor = 'pointer';
                                this.ghost.style.backgroundColor = "var(--label)";

                                // display ghost for dragging process
                                this.ghost.style.display = "block";
                                html(PreviewWindow.getInstance().el(), {}, this.ghost);

                                // another ghost there (id with a is a preview window element and id without a is a outline window element)
                                // specify the type of the dragging element and generate corresponding element and ghost element.
                                // console.log(DraggableSortedOrder.getInstance().existOutline[oidx]);

                                this.ghostAnother = (DraggableSortedOrder.getInstance().existOutline[oidx].cloneNode(true)) as HTMLElement;
                                anotherGhostParent = html("div", { style: { border: "1px solid white", position: "relative" } });

                                // preview window element adjustment
                                // let ghostParent = html("div", { style: { border: "1px solid white", position: "relative" } });
                                // DraggableSortedOrder.getInstance().existPwWidgets[oidx].replaceWith(this.ghost!);
                                // html(ghostParent, {}, DraggableSortedOrder.getInstance().existPwWidgets[oidx]);
                                // this.updateGUI(DraggableSortedOrder.getInstance().existPwWidgets[oidx], this.ghost!, ghostParent);

                                // outline ghost adjustment
                                // this.updateGUI(DraggableSortedOrder.getInstance().existOutline[oidx], this.ghostAnother, anotherGhostParent);

                                // let originalOutline = DraggableSortedOrder.getInstance().existOutline[oidx];
                                // originalOutline.style.pointerEvents = "cursor";
                                // anotherTop = Outline.getInstance().el().children[oidx].getBoundingClientRect().top;
                                // anotherLeft = Outline.getInstance().el().children[oidx].getBoundingClientRect().left;·
                                // this.outlineTextIndent = DraggableSortedOrder.getInstance().existOutline[oidx].style.textIndent;
                                // html(PreviewWindow.getInstance().el(), {}, this.ghost!);

                                // el.replaceWith(this.ghost!);
                                // el.style.position = "absolute";
                                // this.selected = this.ghost;
                                // html(this.ghostParent, {}, el);

                                // parameters in the below are for the redo and undo functions
                                // this.previousParent = this.selected.parentElement!;
                                this.previousParent = el.parentElement!;
                                this.childrenIdx = [... this.previousParent!.children].indexOf(el);

                                isMoving = true;
                                // these four parameters are for finding the dragged accurate position
                                top = el.getBoundingClientRect().top;
                                left = el.getBoundingClientRect().left;

                                // calculate the difference of el and mouse position
                                initialX = Number(`${data.current.x - left}`);
                                initialY = Number(`${data.current.y - top}`);

                                previousHtml = el.cloneNode(true) as HTMLDivElement;
                                // el.innerHTML = "";
                            }

                            // if preview window drag a layout, it shall not been dragged.
                            else {
                                isMoving = false;
                                el.onmousemove = null;
                                el.onmouseleave = null;
                            }
                        }

                        // when dragged element in the outline window
                        else {
                            this.ghost = el.cloneNode(true) as HTMLElement;
                            this.ghost.style.cursor = 'pointer';
                            this.ghost.style.backgroundColor = "var(--label)";

                            // display ghost for dragging process
                            this.ghost.style.display = "block";
                            html(Outline.getInstance().el(), {}, this.ghost);

                            // another ghost there (id with a is a preview window element and id without a is a outline window element)
                            // specify the type of the dragging element and generate corresponding element and ghost element.
                            // console.log(DraggableSortedOrder.getInstance().existOutline[oidx]);

                            this.ghostAnother = (DraggableSortedOrder.getInstance().existPwWidgets[oidx].cloneNode(true)) as HTMLElement;
                            anotherGhostParent = html("div", { style: { border: "1px solid white", position: "relative" } });

                            // this.previousParent =     this.ghostAnother.parentElement!;
                            // this.childrenIdx = [... this.previousParent!.children].indexOf(el);

                            isMoving = true;
                            // these four parameters are for finding the dragged accurate position
                            top = el.getBoundingClientRect().top;
                            left = el.getBoundingClientRect().left;

                            // previousHtml =  this.ghostAnother.cloneNode(true) as HTMLDivElement;
                            // previousHtml = DraggableSortedOrder.getInstance().existPwWidgets[oidx].cloneNode(true) as HTMLDivElement;
                            previousHtml = DraggableSortedOrder.getInstance().existPwWidgets[oidx];

                        }
                    }

                    if (isMoving && el.parentElement != null) {
                        //drag a preview window el
                        if (this.checkIsPreviewEl(this.ghost!)) {

                            // el.style.borderColor = "var(--bg)";
                            el.style.backgroundColor = "var(--fg-disabled)";
                            this.ghost!.style.position = "absolute";
                            this.ghost!.style.top = `${data.current.y - initialY}px`;
                            this.ghost!.style.left = `${data.current.x - initialX}px`;
                            // this.ghost!.style.rotate = "2deg";
                            this.ghost!.style.width = `${el.offsetWidth}px`;

                            // DraggableSortedOrder.getInstance().existOutline[oidx].style.display = "none";
                            // this.ghostAnother!.style.backgroundColor = 'var(--label)';
                            // this.ghostAnother!.style.left = `${data.current.x}px`;
                            // this.ghostAnother!.style.top = `${data.current.y}px`;
                            // GhostVisualEffectForDsl(this.ghost!, this.ghostAnother!);

                            // PreviewWindow.getInstance().el().onmouseenter = () => {
                            //     // this.ghost!.style.display = "none";
                            // }

                            // PreviewWindow.getInstance().el().onmouseleave = () => {
                            //     // this.ghost!.style.display = "block";
                            // }

                            // DraggableSortedOrder.getInstance().existPwWidgets.forEach((landingEl: HTMLElement) => {
                            //     if (landingEl.title == "text" || landingEl.title == "image" || landingEl.title == "button" || landingEl.title == "video") {
                            //         landingEl.onmouseover = () => {
                            //             dragOver(landingEl, this.selected!);
                            //         }
                            //         el.onmouseleave = () => {
                            //             el.style.backgroundColor = "var(--bg--dim)";
                            //         }
                            //     }
                            // })

                            // define ghost movement （we need to consider about the onclick, otherwise it will generate the element when onfocus the element, trouble on drag and drop the outline as well）
                            // this.ghost!.style.left = `${data.current.x}px`;
                            // this.ghost!.style.top = `${data.current.y}px`;

                            // insert new widget to pw window
                            AddToPreviewWindow(this.ghostAnother!, el, false);
                            // insert new widget to outline window
                            AddToOutlineWindow(this.ghostAnother!, el);
                            // console.log(el.parentElement);
                            // check whether it is in a horizontal container and adjust horizontal container els' height

                            let heightArr: number[] = [];
                            if (el.parentElement != null) {
                                if (el.parentElement!.style.display == "flex") {
                                    // this method used to adjust all children elements' height to the largest element in horizontal container when any els drop in it.
                                    for (let i = 0; i < el.parentElement!.children.length!; i++) {
                                        let childNode = el.parentElement!.childNodes!.item(i) as HTMLElement;
                                        let height = parseInt(childNode.style.height);
                                        heightArr.push(height);
                                        childNode.style.removeProperty("height");
                                    }
                                    let max = Math.max(...heightArr);
                                    el.parentElement!.style.height = max + "px";
                                    el.style.height = max + "px";
                                }
                                else if (el.title == "image") {
                                    this.ghost!.style.height = "46px";
                                    this.ghost!.style.backgroundColor = "transparent";
                                }
                                else {
                                    this.ghost!.style.backgroundColor = "var(--fg)";
                                    this.ghost!.style.height = "46px";
                                    el.style.height = "46px";
                                }
                            }

                            // another ghost
                            // this.another!.style.top = `${2 - anotherTop}px`;
                            // this.another!.style.left = `${2 - anotherLeft}px`;

                            // adjust ghost text indent to be same as the current position

                            // DraggableSortedOrder.getInstance().existOutline[oidx].style.display = "none";
                            // this.ghostAnother!.style.backgroundColor = 'var(--label)';
                            // this.ghostAnother!.style.left = `${data.current.x}px`;
                            // this.ghostAnother!.style.top = `${data.current.y}px`;
                            // this.another!.style.textIndent = this.outlineTextIndent!;

                            // this function needs to implement flow rule and acceptance

                            // check the flow rules
                            // this.checkFlowRules(el);

                            // check the acceptance, first and last
                            // this.checkWidgetAcceptance(el);
                        }

                        //drag an outline
                        else {
                            el.style.backgroundColor = "var(--fg-disabled)";
                            this.ghost!.style.position = "absolute";
                            this.ghost!.style.top = `${data.current.y}px`;
                            this.ghost!.style.left = `${data.current.x}px`;

                            // el.style.top = `${data.current.y}px`;
                            // el.style.left = `${data.current.x}px`;

                            // insert new widget to pw window
                            AddToPreviewWindow(el, this.ghostAnother!, false);
                            // insert new widget to outline window

                            // AddToOutlineWindow(el, this.ghostAnother!);
                            AddToOutlineWindow(el, previousHtml);

                            // check whether it is in a horizontal container and adjust horizontal container els' height

                            // todo here 
                            // let heightArr: number[] = [];
                            // if (el.parentElement != null) {
                            //     if (el.parentElement!.style.display == "flex") {
                            //         // this method used to adjust all children elements' height to the largest element in horizontal container when any els drop in it.
                            //         for (let i = 0; i < el.parentElement!.children.length!; i++) {
                            //             let childNode = el.parentElement!.childNodes!.item(i) as HTMLElement;
                            //             let height = parseInt(childNode.style.height);
                            //             heightArr.push(height);
                            //             childNode.style.removeProperty("height");
                            //         }
                            //         let max = Math.max(...heightArr);
                            //         el.parentElement!.style.height = max + "px";
                            //         el.style.height = max + "px";
                            //     }
                            //     else if (el.title == "image") {
                            //         this.ghost!.style.height = "46px";
                            //         this.ghost!.style.backgroundColor = "transparent";
                            //     }
                            //     else {
                            //         this.ghost!.style.backgroundColor = "var(--fg)";
                            //         this.ghost!.style.height = "46px";
                            //         el.style.height = "46px";
                            //     }
                            // }



                        }
                    }
                },

                end: (data: { diff: { size: () => number; }; }) => {


                    // prevent warning
                    // DropToOutline.getInstance().preventionWarning(this.selected!.title);
                    // // if (data.diff.size() < 1 && el!.id.includes("a")) {
                    if (data.diff.size() < 5) {
                        // Define this diff size as a click
                        this.options.onclick(d);
                    }

                    else {
                        // check whether satisfied the rules
                        // if (!this.followedRules || !this.followedAccept || !this.followedFirst || !this.followedLast) {
                        //     // return back to the dragged before
                        //     // el.remove();
                        //     // newOutline.remove();
                        //     // this.previousParent.insertBefore(el, this.previousParent.children[this.childrenIdx]);
                        //     // el.style.backgroundColor = "var(--bg--dim)";
                        //     PreventionWarning(this.followedRules!, this.followedAccept, this.followedFirst, this.followedLast, el.title, this.uniqueArray, this.first!, this.last!, this.rules);

                        // }
                        if (el.title != "layout") {
                            if (this.checkIsPreviewEl(el)) {
                                // if (previousHtml == undefined) {
                                //     console.log("why this is undefined");
                                // }
                                // todo: remove the previous one at old index (also remove its children div)
                                // this method is to update two arrays
                                // el.innerText = previousHtml.innerText;
                                el.style.backgroundColor = "var(--bg--dim)";
                                DraggableSortedOrder.getInstance().existOutline[oidx].style.display = "block";
                                UpdateIndex(el, oidx, DraggableSortedOrder.getInstance().existPwWidgets, this.previousParent, this.childrenIdx, this.outlineTextIndent!);
                                // el.replaceWith(previousHtml);
                                isMoving = false;

                                el.style.position = "";
                                el.style.top = "";
                                el.style.left = "";

                                // this.selected = null;
                                // this.ghost!.replaceWith(el);

                                // DraggableSortedOrder.getInstance().existPwWidgets.forEach((landingEl: HTMLElement) => {
                                //     landingEl.onmouseover = null;
                                //     landingEl.onmouseleave = null;
                                // })

                                // DraggableSortedOrder.getInstance().reorderPreviewWindow(el);

                                // todo: another ghost
                                // if (this.another != null) {
                                //     this.another!.style.position = "";
                                //     this.another!.style.top = "";
                                //     this.another!.style.left = "";
                                //     this.selectedAnother = null;
                                //     anotherGhost.replaceWith(this.another!);
                                // }

                                // this is to check whether the layout has children nodes, if there is no children, this vertical or horizontal container will change the color for insert new widget
                                if (!this.previousParent.hasChildNodes()) {
                                    this.previousParent.style.border = `2px dotted pink`;
                                    this.previousParent.style.height = "46px";
                                    this.previousParent.title = "empty layout";
                                    // this.previousParent.innerHTML = "";
                                }
                            }

                            // drag in the outline window
                            else {

                                UpdateIndex(el, oidx, DraggableSortedOrder.getInstance().existOutline, this.previousParent, this.childrenIdx, this.outlineTextIndent!);

                                // console.log(this.ghostAnother!);
                                // this.ghostAnother = null;

                                isMoving = false;

                                el.style.position = "";
                                el.style.top = "";
                                el.style.left = "";
                            }

                        }
                        else {
                            internalSystem.notification("This should not be drag a compound layout");
                            // el.ondragenter = null;
                            // CommandAction.reorder(oidx, idxBeforeEl, el, previousParent, childrenIdx, outlineTextIndent);
                        }
                    }

                    // might be combined with ClearBorderColorAfterDrop method
                    DraggableSortedOrder.getInstance().existPwWidgets.forEach((el: HTMLElement) => {
                        el.onmousemove = null;
                        el.onmouseleave = null;
                    })

                    DraggableSortedOrder.getInstance().existOutline.forEach((el: HTMLElement) => {
                        el.onmousemove = null;
                        el.onmouseleave = null;
                    })

                    if (this.ghost != null) {
                        this.ghost!.remove();
                    }

                    ClearBorderColorAfterDrop(el);
                },
                alwaysMove: true,
            }
        });
    }

    // updateGUI(another: HTMLElement, anotherGhost: HTMLElement, anotherGhostParent: HTMLElement) {
    //     // this.another = another;
    //     another.replaceWith(anotherGhost);
    //     // another.style.position = "absolute";
    //     this.ghostAnother = anotherGhost;
    //     html(anotherGhostParent, {}, another);
    // }

    // check whether drag the preview window element, the essence is that els based on the id of the element
    checkIsPreviewEl(el: HTMLElement): boolean {
        // id includes "a" which means preview window element
        if (el.id.includes("a")) {
            return true;
        }
        else {
            return false;
        }
    }

    // check whether it will satisfy the all rules, return true if one of the rules is not satisfied
    // preventionWarning(el: HTMLElement): boolean {
    //     PreventionWarning(this.followedRules!, this.followedAccept, this.followedFirst, this.followedLast, el.title, this.uniqueArray, this.first!, this.last!, this.rules);
    //     if (!this.followedRules || !this.followedAccept || !this.followedFirst || !this.followedLast) {
    //         return true;
    //     }
    //     return false;
    // }

    // checkWidgetAcceptance(widget: HTMLDivElement) {

    //     let widgetEl;
    //     let widgetTitle;

    //     widgetEl = widget;
    //     widgetTitle = widget.title;

    //     if (CheckAcceptance.getInstance().accepts.get(widgetEl.parentElement!)) {

    //         CheckAcceptance.getInstance().accepts.forEach((values) => {
    //             // console.log("second round in CheckAcceptance");
    //             values.forEach((value: ContainerAcceptance) => {
    //                 this.acceptAry.push(value.blockRef());
    //             })
    //         })

    //         // if cannot find the element which means 
    //         if (this.acceptAry.indexOf(widgetTitle) !== -1) {
    //             this.followedAccept = true;
    //         }
    //         else {
    //             this.followedAccept = false;
    //         }
    //     }
    //     else {
    //         this.followedAccept = true;
    //     }

    //     // find the unique array values
    //     this.uniqueArray = [...new Set(this.acceptAry)];

    //     if (CheckAcceptance.getInstance().first.get(widgetEl.parentElement!)) {
    //         this.first = CheckAcceptance.getInstance().first.values().next().value;
    //         let name = widgetEl.parentElement!.firstElementChild as HTMLElement;

    //         if (this.first == CorrespondingName(name.title)) {
    //             this.followedFirst = true;
    //         }
    //         else {
    //             this.followedFirst = false;
    //         }
    //     }
    //     else {
    //         this.followedFirst = true;
    //     }

    //     if (CheckAcceptance.getInstance().last.get(widgetEl.parentElement!)) {
    //         this.last = CheckAcceptance.getInstance().last.values().next().value;
    //         let name = widgetEl.parentElement!.lastElementChild as HTMLElement;

    //         if (this.last == CorrespondingName(name.title)) {
    //             this.followedLast = true;
    //         }
    //         else {
    //             this.followedLast = false;
    //         }
    //     } else {
    //         this.followedLast = true;
    //     }
    // }

    // checkFlowRules(widgetEl: HTMLDivElement) {
    //     // containerEls includes widget.el currently at a certain layer's all children nodes; e.g. widget.el(for example is h2) drag into a layer [text, h1, h2, compound layout]
    //     let containerEls: HTMLElement[] = [];
    //     //containerEls all the els title name in this container
    //     let containerTitles: string[] = [];

    //     let requiredAry: string[] = [];

    //     let requiredArySecond: string[] = [];

    //     let insertOneElInEmptyLayout = false;

    //     //if the container has multiple elements, there will have chances to check the flow rules based on those children elements
    //     if (widgetEl.parentElement?.childNodes != null) {
    //         widgetEl.parentElement?.childNodes.forEach((children: ChildNode) => {
    //             let c = children as HTMLElement;
    //             if (c.title == "text" || c.title == "Paragraph") {
    //                 c.title = "p";
    //                 containerEls.push(c);
    //                 containerTitles.push(c.title);
    //             }

    //             else if (c.title != null) {
    //                 containerEls.push(c);
    //                 containerTitles.push(c.title);

    //                 if (c.title == "") {
    //                     containerTitles.push("layout-");
    //                 }
    //             }

    //             else {
    //                 c.title = "layout";
    //                 containerEls.push(c);
    //                 containerTitles.push("layout");
    //             }
    //         })

    //         let y = PreviewWindow.getInstance().el().querySelectorAll("div");
    //         let j;
    //         for (j = 0; j < y.length; j++) {
    //             // console.log(y[j]);
    //             if (typeof y[j].title === "undefined") {
    //                 console.log("this is a null");
    //             }
    //         }

    //         // this method is to find array with target elements
    //         widgetEl.parentElement!.onmouseover = () => {
    //             PreviewWindow.getInstance().el().style.border = "0.5px solid grey";

    //             let x = PreviewWindow.getInstance().el().querySelectorAll("div");
    //             let i;

    //             for (i = 0; i < x.length; i++) {
    //                 if (x[i].style.border != "") {
    //                     x[i].style.border = "0.1px solid var(--bg-dim)";
    //                 }
    //             }

    //             // in this class
    //             // if (followedRule == null) {
    //             if (this.followedRules && this.followedAccept) {
    //                 if (widgetEl.parentElement != null) {
    //                     widgetEl.parentElement!.style.border = "1px dotted var(--accent-success-active)";
    //                 }
    //             }

    //             else {
    //                 // console.log(widgetEl.parentElement);
    //                 if (widgetEl.parentElement != null) {
    //                     widgetEl.parentElement!.style.border = "1px dotted var(--accent-error-active)";
    //                 }
    //             }

    //             // in draggableSortedList for existing element reordering
    //             // } else {
    //             //     if (followedRule && followedAccept) {
    //             //         widgetEl.parentElement!.style.border = "1px dotted var(--accent-success-active)";
    //             //     }

    //             //     else {
    //             //         widgetEl.parentElement!.style.border = "1px dotted var(--accent-error-active)";
    //             //     }
    //             // }

    //             // every time widget parent changed, then empty the acceptance array.
    //             this.acceptAry = [];

    //             //FIXME: change the first and last
    //             this.first = "";
    //             this.last = "";
    //         }

    //         // widgetEl.parentElement!.onmouseleave = () => {
    //         //     // event.preventDefault();
    //         //     // widgetEl.parentElement!.style.border = "0.1px solid var(--bg-dim)";
    //         //     if (widgetEl.parentElement != null) {
    //         //         widgetEl.parentElement!.style.border = "0.1px solid green";
    //         //         // widgetEl.parentElement!.focus();
    //         //     }
    //         // }

    //         let widgetIdx = containerEls.indexOf(widgetEl);

    //         // if widget.el is the last element then check the [widget.el()'s previous node, widget.el()]
    //         if (widgetIdx == containerEls.length) {
    //             requiredAry = [containerTitles[widgetIdx - 1], containerTitles[widgetIdx]];
    //             requiredArySecond = [];
    //         }

    //         // widget.el is the only child of the container ps: also include the scenario that it is a empty layout
    //         else if (widgetIdx == 0) {
    //             // when only one element in this layer
    //             if (containerEls.length == 1) {
    //                 insertOneElInEmptyLayout = true;
    //             }

    //             // todo : if only one element which means only one index
    //             requiredAry = [containerTitles[widgetIdx], containerTitles[widgetIdx + 1]];
    //             requiredArySecond = [];
    //         }

    //         else {
    //             requiredAry = [containerTitles[widgetIdx - 1], containerTitles[widgetIdx]];
    //             requiredArySecond = [containerTitles[widgetIdx], containerTitles[widgetIdx + 1]];
    //         }
    //     }

    //     else {
    //         console.log("check flow rule - parent has no children");
    //         // this.checkFlowRules(widget.el());
    //     }

    //     let n = FlowRuleGUIModel.getInstance().generate2DRulesAry().length;
    //     let m = FlowRuleGUIModel.getInstance().generate2DRulesAry()[0].length;

    //     for (let i = 0; i < n; i++) {
    //         for (let j = 0; j < m; j++) {

    //             if (FlowRuleGUIModel.getInstance().generate2DRulesAry()[i][j] == widgetEl.title) {

    //                 this.rules = FlowRuleGUIModel.getInstance().generate2DRulesAry()[i];

    //                 let twoAryEqual = CompareTwoAry(FlowRuleGUIModel.getInstance().generate2DRulesAry()[i], requiredAry);

    //                 //when target widget in the middle of the array and it need to be checked twice
    //                 let threeAryEqual = CompareTwoAry(FlowRuleGUIModel.getInstance().generate2DRulesAry()[i], requiredArySecond);

    //                 if (twoAryEqual || insertOneElInEmptyLayout || requiredAry.includes("layout")) {
    //                     this.followedRules = true;
    //                     // FIXME: fix this scenario

    //                     // if (requiredArySecond != [] && !threeAryEqual) {
    //                     //     followedRules = false;
    //                     // }

    //                 }
    //                 else {
    //                     this.followedRules = false;
    //                 }
    //             }

    //             // this scenario means the target is not been included in the flow rule widgets (the widgets not been included in the flow rule could be insert anywhere)
    //             else {
    //                 this.followedRules = true;
    //             }
    //         }
    //     }
    // }
}

export function GhostVisualEffectForDsl(ghostWidget: HTMLElement, newOutline: HTMLElement) {

    Outline.getInstance().el().onmouseenter = () => {
        ghostWidget.style.display = "none";
        newOutline.style.display = "block";
        // html(Outline.getInstance().el(), {}, newOutline);
    }

    PreviewWindow.getInstance().el().onmouseenter = () => {
        ghostWidget.style.display = "block";
        newOutline.style.display = "none";
        // html(PreviewWindow.getInstance().el(), {}, ghostWidget);
    }

    PreviewWindow.getInstance().el().onmouseleave = () => {
        ghostWidget.style.display = "none";
    }

    Outline.getInstance().el().onmouseleave = () => {
        newOutline.style.display = "none";
    }
}