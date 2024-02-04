import { DraggableSortedOrder } from "../DraggableSortedOrder";

export function ApplyStyle(style: Map<string, string>) {
    let tagArray: string[] = [];
    let styleArray: string[] = [];

    for (const elType of style.entries()) {
        tagArray.push(elType[0]);
    }
    style?.forEach((key: string) => {
        styleArray.push(key);
    })

    tagArray.forEach((type: string) => {
        DraggableSortedOrder.getInstance().existPwWidgets.forEach((el: HTMLElement) => {
            if (type == el.title) {

            }
        })
    })
}