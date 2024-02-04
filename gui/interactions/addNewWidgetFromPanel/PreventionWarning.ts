export function PreventionWarning(followedRules: boolean, followedAccept: boolean, followedFirst: boolean, followedLast: boolean, widgetName: string, uniqueArray: string[], first: string, last: string, rules: string[]) {
    if (!followedRules) {
        internalSystem.notification(`The widget { ` + widgetName + ` } is not satisfied the flow rule: from { ` + rules[0] + ` } to { ` + rules[1] + ` }`, { type: "warning" });
    }

    if (!followedAccept) {
        // console.log(uniqueArray);
        internalSystem.notification(`This layout container could only accept  { ` + uniqueArray.toString() + ` }`, { type: "warning" });
    }

    if (!followedFirst) {
        internalSystem.notification(`The first widget in this layout container should be  { ` + first + ` } `, { type: "warning" });
    }

    if (!followedLast) {
        internalSystem.notification(`The last widget in this layout container should be  { ` + last + ` } `, { type: "warning" });
    }
}