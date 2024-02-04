export function CorrespondingName(title: string) {
    switch (title) {
        case "Heading 1":
            return "h1";
        case "Heading 2":
            return "h2";
        case "Heading 3":
            return "h3";
        default:
            return title;
    }
}
