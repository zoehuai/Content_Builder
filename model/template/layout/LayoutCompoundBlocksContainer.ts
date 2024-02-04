import { NotFoundError } from "../../error/NotFoundError";
import { ContainerAcceptance } from "./ContainerAcceptance";
import { LayoutContainer } from "./LayoutContainer";

export abstract class LayoutCompoundBlocksContainer extends LayoutContainer {
    protected _editable: boolean;
    protected _accepts?: ContainerAcceptance[];
    protected _first?: string;
    protected _last?: string;
    constructor(editable: boolean, accepts?: ContainerAcceptance[], first?: string, last?: string) {
        super();
        this._accepts = accepts;
        this._editable = editable;
        this._first = first;
        this._last = last;
    }

    editable(): boolean {
        return this._editable;
    }

    setEditable(editable: boolean) {
        this._editable = editable;
    }

    blocks() {

    }

    accepts(): ContainerAcceptance[] | undefined {
        if (this._accepts == null) {
            NotFoundError.message(`Acceptance`);
            return;
        }
        return this._accepts;
    }

    first(): string {
        return this._first!;
    }

    last(): string {
        return this._last!;
    }

    add() {

    }

    remove() {

    }

}