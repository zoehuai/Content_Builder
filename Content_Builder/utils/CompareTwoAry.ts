//this method aims to compare two arrays' values 
export function CompareTwoAry(a: string[], b: string[]): boolean {
    if (a.length !== b.length) {
        return false
    } else {
        for (let i = 0; i < a.length; i++) {
            if (b.indexOf(a[i]) === -1) {
                return false
            }
        }
        return true;
    }
}