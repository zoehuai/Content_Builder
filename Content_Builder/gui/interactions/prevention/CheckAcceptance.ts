import { ContainerAcceptance } from "../../../model/template/layout/ContainerAcceptance";
import { LayoutCompoundBlocksContainer } from "../../../model/template/layout/LayoutCompoundBlocksContainer";
import { LayoutContainer } from "../../../model/template/layout/LayoutContainer";

// check the acceptance, first and last
export class CheckAcceptance {
    private static _ca: CheckAcceptance;
    accepts: Map<HTMLElement, ContainerAcceptance[]>;
    first: Map<HTMLElement, string>;
    last: Map<HTMLElement, string>;

    private constructor() {

        // set up an array include accept widgets and first and last mapping the corresponding element
        this.accepts = new Map();
        this.first = new Map();
        this.last = new Map();
    }

    static getInstance(): CheckAcceptance {
        if (CheckAcceptance._ca == null) {
            CheckAcceptance._ca = new CheckAcceptance();
        }
        return CheckAcceptance._ca;
    }

    checkAll(c: LayoutCompoundBlocksContainer | LayoutContainer, correspondingEl: HTMLElement) {

        // store if acceptance is not null
        if (c.accepts()!.length > 0) {
            this.accepts.set(correspondingEl, c.accepts()!);
        }

        if (c.first() != null) {
            this.first.set(correspondingEl, c.first()!);
        }

        if (c.last() != null) {
            this.last.set(correspondingEl, c.last()!);
        }
    }
}