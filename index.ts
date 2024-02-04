import { html } from "./commons/lib/dom/create";
import { ContentBuilderGUI } from "./gui/ContentBuilderGUI";

/** Render a content builder HTML element */
export default (com: internalSystem.Component) => {
	let outerHtml = html("div");
	let contentBuilderGUI = new ContentBuilderGUI();
	return contentBuilderGUI.render(outerHtml);
}