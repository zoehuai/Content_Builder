import { mdIcon } from "../../commons/lib/icons/material-design-icons";
import { html as h } from "../../commons/lib/dom/create";
import { createClass as cls } from "../../commons/lib/css/create";

const _el = cls({
});

const _titleChange = cls({
	cursor: "pointer",
	fontFamily: "Lato",
	fontWeight: "bold",
	border: "none",
	color: "var(--fg-disabled)",
	backgroundColor: "var(--bg)",
	width: "100%",
	fontSize: 30,
	paddingLeft: "20px",
	marginRight: "10px",
	textAlign: "center",
	"&:focus": {
		outline: "none",
		color: "var(--fg)",
	},
});

const _returnIcon = cls({
	border: "none",
	cursor: "pointer",
	fontSize: 30,
});

const _titleDiv = cls({
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	textAlign: "center",

});

const ARROWICON = "<line y1='-0.5' x2='18.1809' y2='-0.5' transform='matrix(-0.71052 0.703677 -0.71052 -0.703677 30.4556 0)' stroke='var(--fg)'/><line y1='-0.5' x2='18.1808' y2='-0.5' transform='matrix(0.710502 0.703695 -0.710502 0.703695 18.0835 13.2061)' stroke='var(--fg)'/><line y1='-0.5' x2='18.1808' y2='-0.5' transform='matrix(-0.710508 0.703689 -0.710508 -0.703689 21.7153 0)' stroke='var(--fg)'/><line y1='-0.5' x2='18.1807' y2='-0.5' transform='matrix(0.710499 0.703699 -0.710499 0.703699 9.34131 13.2061)' stroke='var(--fg)'/><line y1='-0.5' x2='18.1807' y2='-0.5' transform='matrix(-0.7105 0.703698 -0.7105 -0.703698 12.9175 0)' stroke='var(--fg)'/><line y1='-0.5' x2='18.1806' y2='-0.5' transform='matrix(0.710489 0.703709 -0.710489 0.703709 0.547363 13.2061)' stroke='var(--fg)'/>";

/**
 * This class is used to generate the top menu of the content builder. 
 * For example, editing the title of the content.
 */
export class TopTitleEditorGUI {
	private _el: HTMLDivElement;
	private _returnArrow: HTMLDivElement;
	private _title: string | null;
	private _titleEditor: HTMLDivElement | undefined;
	private _titleChangeInput: HTMLInputElement;
	private static _tte: TopTitleEditorGUI;

	private constructor() {

		this._el = h("div", { class: _el });
		this._returnArrow = h("div", { class: _returnIcon });

		//this arrow button is customizable, it could link to other page
		let arrowIcon = mdIcon(ARROWICON);
		arrowIcon.style.width = "50px";

		this._title = null;

		this._titleChangeInput = h("input", { type: "text", class: _titleChange, placeholder: "Untitled", title: "Click here to edit title" });

		let titleEditor = h("div", { class: _titleDiv });

		this._titleChangeInput.onchange = () => {

			this._title = this._titleChangeInput.value;
			this._titleChangeInput.style.color = "var(--fg)";
		};

		this._titleChangeInput.onblur = () => {

			if (this._titleChangeInput.value === "") {
				this._titleChangeInput.focus();
				internalSystem.notification("Missing a title for the content page.", { type: "error" });
			}
		};

		this._titleChangeInput.onfocus = () => {
			this._titleChangeInput.placeholder = " ";
			this._titleChangeInput.setSelectionRange(0, this._titleChangeInput.value.length);
		};

		h(titleEditor, {}, this._titleChangeInput);

		h(this._el, {}, this._returnArrow, titleEditor);
	}

	addToParent(parent: HTMLElement) {
		h(parent, {}, this._el);
	}

	title() {
		return this._title;
	}

	static getInstance(): TopTitleEditorGUI {
		if (TopTitleEditorGUI._tte == null) {
			TopTitleEditorGUI._tte = new TopTitleEditorGUI;
		}
		return TopTitleEditorGUI._tte;
	}
}