# Content Builder Guide

## **Conceptual design ideas:**

This web application is aimed to construct documents based on a template file, so the very first step is to upload a pre-defined template XML document.

## **Content Builder Functionalities:**

### 1. **Preview window**

1.1 Display the contents of the document

1.2 Edit the document blocks on content builder preview window

- Text editing with several sizes of the font. (Paragraph, h1, h2, h3, h4, h5)
- Image uploading
- Button editing
- Video uploading
- Compound blocks editing (with pre-defined layout)
- Vertical & Horizontal empty container editing
- Reordering the block by dragging and dropping block
- Add new block/widget from widget panel (based on convention rules)

### 2. **Outline window**

2.1 Display the structure of the document

2.2 Edit the document blocks on Outline

- Reordering the block by dragging and dropping block outline
- Delete block in outline window (keyboard shortcut-backspace, context menu)
- Delete compound block by using context menu onto the vertical/horizontal
- Collapse and expend the vertical/horizontal compound block
- Focus and find the corresponding block in preview window that user aims to view
- Same indent on same layer of the vertical/ horizontal container
- Add new block/widget from widget panel (based on convention rules)

### **3. Bottom Information Bar**

- Display the name, type and editable information of the specific block
- Word count for specific block and when not focused on a specific block it will display the whole document word count

### **4. Top Menu Bar**

- Download the document as a xml file (Document.xml including contents and styles)

### **5. Interactions**

- Deletion
- Add
- Keyboard Shortcut

## **XML Files Convention Rules and Editing Instructions:**

### **A. Template XML Format**

1. Block name must be one of the types. (e.g., h1, h2, h3, p, button, thumbnail,) if writer name the block as specific name (e.g., instruction, title, footer…) it will automatically be recognized as a p (paragraph) normal text font and size.

2. If the layout does not include any convention rules (flow rules, first, last, acceptance), it means any types of the Block could be added in this layout container.

3. Editable is an optional choice, if writer does not address these attributes, which means this block could edit (default setting is block/content editable).

### **B. Style XML Format**

The styles could define the block’s styles based on CSS rules

### **C. Document XML Format**

The styles could define the block’s styles based on CSS rules 

### **D. Available Widgets List:**

- Text ( including from h1 to h5, p )
- Image
- Button
- Predefined Layout
- Horizontal Empty Layout
- Vertical Empty Layout
  