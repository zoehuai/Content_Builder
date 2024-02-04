
export function dragOver(target: HTMLElement, selected: HTMLElement) {
    if (selected != null) {
        if (isBefore(selected, target)) {
            target.parentNode!.insertBefore(selected, target);
        } else {
            target.parentNode!.insertBefore(selected, target.nextSibling);
        }
    }
}

/**
 * Check the position of the dragging element.
 */
export function isBefore(el1: Node, el2: Node) {
    let cur;
    if (el2.parentNode === el1.parentNode) {
        for (cur = el1.previousSibling; cur; cur = cur.previousSibling) {
            if (cur === el2)
                return true;
        }
    }
    return false;
}