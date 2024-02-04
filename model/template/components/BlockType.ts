/**
 * This is a class that defines the range of block types.
*/
export class BlockType {
    static HEADING1: string = "h1";
    static HEADING2: string = "h2";
    static HEADING3: string = "h3";
    static HEADING4: string = "h4";
    static HEADING5: string = "h5";
    static PARAGRAPH: string = "p";
    static BUTTON: string = "button";
    static THUMBNAIL: string = "thumbnail";
    static IMAGE: string = "image";
    static VIDEO: string = "video";
    static names: string[] = [BlockType.HEADING1, BlockType.HEADING2,
    BlockType.HEADING3, BlockType.HEADING4, BlockType.HEADING5, BlockType.PARAGRAPH,
    BlockType.BUTTON, BlockType.THUMBNAIL, BlockType.IMAGE, BlockType.VIDEO]

    static contains(block: string): boolean {
        return BlockType.names.includes(block);
    }
}