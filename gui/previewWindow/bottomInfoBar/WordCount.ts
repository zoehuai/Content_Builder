import { clear } from "../../../commons/lib/dom/clear";
import { html } from "../../../commons/lib/dom/create";
import { BottomInfoBar } from "./BottomInfoBar";

export class WordCount {
    private static _wc: WordCount;
    private _wordCountAry: Map<HTMLElement, number>;

    private constructor() {
        this._wordCountAry = new Map<HTMLElement, number>();
    }

    static getInstance(): WordCount {
        if (WordCount._wc == null) {
            WordCount._wc = new WordCount();
        }
        return WordCount._wc;
    }

    wordCountAry(): Map<HTMLElement, number> {
        return this._wordCountAry;
    }

    // count the words for text
    countWord(textInput: string, el: HTMLElement): number {
        let words = textInput;
        let count = 0;

        // Split the words on each space character
        let split = words.split(' ');

        for (let i = 0; i < split.length; i++) {
            if (split[i] != "") {
                count += 1;
            }
        }

        this._wordCountAry.set(el, count);

        return count;
    }

    //count word for whole document
    wordOverall() {
        clear(BottomInfoBar.getInstance().wordCountEl()!);
        let sum = 0;
        this._wordCountAry.forEach(count => {
            sum += count;
        })
        html(BottomInfoBar.getInstance().wordCountEl()!, {}, `Word Count: ${sum} words`);
    }
}