import { ContainerAcceptance } from "./ContainerAcceptance";
import { Horizontal } from "./Horizontal";
import { LayoutBlock } from "./LayoutBlock";
import { LayoutCompoundBlocksContainer } from "./LayoutCompoundBlocksContainer";
import { DirectionEl } from "./LayoutContainerFactory";
import { Vertical } from "./Vertical";

const BLOCK: string = "block";

/**
 * This is a class that is divided into LayoutCompoundBlocksContainer and LayoutBlock classes.
*/
export class LayoutCompoundBlocksContainerFactory {

    constructor() {

    }

    static createFromLayoutContainer(el: xml.Element): LayoutCompoundBlocksContainer | LayoutBlock | undefined {
        let direction: LayoutCompoundBlocksContainer | LayoutBlock | undefined;

        switch (el.name()) {
            case BLOCK: {
                direction = LayoutBlock.createFromLayoutContainer(el);
                break;
            }

            case DirectionEl.VERTICAL:
            case DirectionEl.HORIZONTAL: {
                direction = LayoutCompoundBlocksContainerFactory.parseFromXml(el, el.name());
                break;
            }
        }

        if (el.elements().length > 0) {
            el.elements().forEach(c => {
                let child = LayoutCompoundBlocksContainerFactory.createFromLayoutContainer(c);
                if (child) {
                    direction?.children.push(child);
                }
            })
        }
        return direction;
    }

    static parseFromXml(xml: xml.Element, direction: string): Horizontal | Vertical | undefined {
        let blocks: LayoutBlock[] = [];
        let accepts: ContainerAcceptance[] = [];

        if (xml.elements("block")) {
            xml.elements("block").forEach(el => {
                let block = LayoutBlock.createFromLayoutContainer(el);
                if (block) {
                    blocks.push(block);
                }
            })
        }

        if (xml.elements("accept")) {
            xml.elements("accept").forEach(el => {
                let accept = ContainerAcceptance.createFromXml(el);
                if (accept) {
                    accepts.push(accept);
                }
            })
        }

        let first = xml.value("first");
        let last = xml.value("last");

        /**
         * This parse xml function generate the Horizontal or Vertical which extends from LayoutCompoundBlocksContainer.
         * @see{@link  LayoutCompoundBlocksContainer}
         */
        switch (direction) {
            case DirectionEl.HORIZONTAL:
                return new Horizontal(false, accepts, first!, last!);
            case DirectionEl.VERTICAL:
                return new Vertical(false, accepts, first!, last!)
        }
    }
}