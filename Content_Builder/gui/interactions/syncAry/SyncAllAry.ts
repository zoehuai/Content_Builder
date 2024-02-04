import { DraggableSortedOrder } from "../DraggableSortedOrder";

export class SyncAllAry {
    private static _sa: SyncAllAry;

    constructor() {

    }

    static getInstance(): SyncAllAry {
        if (SyncAllAry._sa == null) {
            SyncAllAry._sa = new SyncAllAry();
        }
        return SyncAllAry._sa;
    }

    deleteSyncAry(idx: number) {
        DraggableSortedOrder.getInstance().existPwWidgets[idx].remove();
        DraggableSortedOrder.getInstance().existPwWidgets.splice(idx, 1);
        DraggableSortedOrder.getInstance().existOutline[idx].remove();
        DraggableSortedOrder.getInstance().existOutline.splice(idx, 1);
    }
}