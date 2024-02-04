import { AlreadyExistsError } from "../../error/AlreadyExistsError";
import { NotFoundError } from "../../error/NotFoundError";
import { Blocks } from "../components/Blocks";
import { BlocksFactory } from "../components/BlocksFactory";
import { LayoutCompoundBlocks } from "../components/LayoutCompoundBlocks";
import { FlowRule } from "../FlowRule";

/**
 * This is a class that could parse the template xml or construct the template xml.
 */
export class Template {
    private _name: string;
    private _description: string;
    private _blocks: Blocks[];
    private _flowRules?: FlowRule[];
    private _documentLayouts?: LayoutCompoundBlocks[];
    static flowRule: xml.Element;
    static templateAry: string[];
    static optionalString: string;
    static optionalXml: xml.Element;

    /**
     * @param name template name.
     * @param description template description.
     * @param blocks A set of designated block or layout that are allowed to be edited.
     * @param flowRules A set of fow rules that define the block flow.
     * @param documentLayouts A set of designated layout that can be applied.
     */
    constructor(name: string, description: string, blocks: Blocks[], flowRules?: FlowRule[], documentLayouts?: LayoutCompoundBlocks[]) {
        this._name = name;
        this._description = description;
        this._blocks = blocks;
        this._flowRules = flowRules;
        this._documentLayouts = documentLayouts;
    }
    
    name(): string {
        return this._name;
    }

    setName(name: string) {
        this._name = name;
    }

    description(): string {
        return this._description;
    }

    setDescription(description: string) {
        this._description = description;
    }

    blocks(): Blocks[] | undefined {
        if (this._blocks == null) {
            NotFoundError.message("Blocks");
            return;
        }
        return this._blocks;
    }


    flowRules(): FlowRule[] | undefined {
        if (this._flowRules == null) {
            NotFoundError.message("Flow rules");
            return;
        }
        return this._flowRules;
    }

    documentLayouts(): LayoutCompoundBlocks[] | undefined {
        if (this._documentLayouts == null) {
            NotFoundError.message("Document Layouts");
            return;
        }
        return this._documentLayouts;
    }

    static toXml(template: Template): string {
        let dw = new xml.DocWriter();
        dw.push("template");
        dw.add("name", template.name);
        dw.add("description", template.description);
        dw.add("blocks", template.blocks);
        // if (template._flowRules) { dw.add("flow-rule", template.flowRules); }
        // if (template._prescribedLayouts) { dw.add("prescribed-layouts", template.prescribedLayouts); }
        dw.pop();
        let xmlDoc = '<?xml version="1.0" encoding="UTF-8"?>\n' + dw.root().toString();
        return xmlDoc;
    }

    static createFromXml(xml: xml.Element): Template {
        let name: string = xml.value("name")!;
        let description: string = xml.value("description")!;

        //Parse the Optional XML
        let blocks: Blocks[] = [];
       this.optionalXml = xml.element("optional")!;
        this.optionalString =  this.optionalXml.toString();

        let flowRulesContainer: FlowRule[] = [];

        if ( this.optionalXml) {

            this.optionalXml.elements().forEach((el: xml.Element) => {

                el.elements().forEach((option: xml.Element) => {

                    let optionalElement: Blocks | null = BlocksFactory.createFromXml(option);
                    if (optionalElement) {
                        if (blocks?.includes(optionalElement)) {
                            AlreadyExistsError.message(`Blocks ${option.name()}`);
                        } else {
                            blocks?.push(optionalElement);
                        }
                    }
                });

                //Create flow rules
                if (el.name() == "flow-rules") {
                    this.flowRule = el;
                    el.elements().forEach((f: xml.Element) => {
                        let flowRule: FlowRule = FlowRule.createFromXml(f);
                        if (flowRulesContainer?.includes(flowRule)) {
                            AlreadyExistsError.message(`Flow rule from ${flowRule.from()} to ${flowRule.to()} `);
                        } else {
                            flowRulesContainer.push(flowRule);
                        }
                    })
                }
            });
        }

        // Create document layouts
        let documentLayoutsXml = xml.element("document");
        let documentLayoutsContainer: LayoutCompoundBlocks[] = [];
        
        if (documentLayoutsXml) {
            documentLayoutsXml.elements("layout").forEach(dl => {
                let documentLayouts: LayoutCompoundBlocks = LayoutCompoundBlocks.createFromXml(dl);
                if (documentLayoutsContainer?.includes(documentLayouts)) {
                    AlreadyExistsError.message(`Document Layout ${documentLayouts.name()}`);
                } else {
                    documentLayoutsContainer.push(documentLayouts);
                }
            })
        }
        return new Template(name, description, blocks!, flowRulesContainer!, documentLayoutsContainer);
    }
}