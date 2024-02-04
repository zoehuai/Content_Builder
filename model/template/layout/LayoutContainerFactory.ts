import { LayoutCompoundBlocksContainerFactory } from "./LayoutCompoundBlocksContainerFactory";
import { LayoutContainer } from "./LayoutContainer";

export enum DirectionEl {
    HORIZONTAL = "horizontal",
    VERTICAL = "vertical",
}
/**
 * This is a class that parses the xml and returns a LayoutContainer or null if it doesn't exist.
*/
export class LayoutContainerFactory {
    constructor() {}

    static createFromXml(el: xml.Element): LayoutContainer | undefined {
        let LayoutCompoundBlocks: LayoutContainer | undefined;
        el.elements().forEach((el) => {
            switch (el.name()) {
                case DirectionEl.VERTICAL:
                case DirectionEl.HORIZONTAL: {
                    LayoutCompoundBlocks = LayoutCompoundBlocksContainerFactory.createFromLayoutContainer(el);
                    break;
                }
            }
        })
        return LayoutCompoundBlocks!;
    }
}