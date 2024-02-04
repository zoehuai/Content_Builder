import { FlowRule } from "../model/template/FlowRule";

// store the flow rules
export class FlowRuleGUIModel {

    private static _fr: FlowRuleGUIModel;
     _flowRulesAry: FlowRule[];
    private _flowRules2D: string[][];


    private constructor() {
        this._flowRulesAry = [];
        this._flowRules2D = [];
    }

    static getInstance(): FlowRuleGUIModel {
        if (FlowRuleGUIModel._fr == null) {
            FlowRuleGUIModel._fr = new FlowRuleGUIModel();
        }
        return FlowRuleGUIModel._fr;
    }

    flowRulesArray(): FlowRule[] {
        return this._flowRulesAry;
    }

  // build a 2 dimensional array of flow Rules
    generate2DRulesAry() {
        for (var i = 0; i < this._flowRulesAry.length; i++) {
            this._flowRules2D[i] = new Array();
            for (var j = 0; j < 2; j++) {
                this._flowRules2D[i][0] = this._flowRulesAry[i].from();

                //outline
                this._flowRules2D[i][1] = this._flowRulesAry[i].to();
            }
        }
        return this._flowRules2D;
    }

}