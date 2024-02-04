import { ContainerAcceptance } from "./ContainerAcceptance";
import { LayoutCompoundBlocksContainer } from "./LayoutCompoundBlocksContainer";

/**
 * This is a concrete class that implements horizontal layout for layout container from LayoutComponentContainer.
*/
export class Horizontal extends LayoutCompoundBlocksContainer {
    constructor(editable: boolean, accepts?: ContainerAcceptance[], first?: string, last?: string) {
        super(editable, accepts, first, last);
        this._accepts = accepts;
        this._editable = editable;
        this._first = first;
        this._last = last;
    }
}