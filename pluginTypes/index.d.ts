/// <amd-module name="@scom/scom-flow/index.css.ts" />
declare module "@scom/scom-flow/index.css.ts" {
    export const customStyles: string;
    export const spinnerStyle: string;
}
/// <amd-module name="@scom/scom-flow/asset.ts" />
declare module "@scom/scom-flow/asset.ts" {
    function fullPath(path: string): string;
    const _default: {
        scom: string;
        fullPath: typeof fullPath;
    };
    export default _default;
}
/// <amd-module name="@scom/scom-flow/interface.ts" />
declare module "@scom/scom-flow/interface.ts" {
    export interface IStep {
        name: string;
        image?: string;
        color?: string;
        widgetData: any;
        stage?: string;
    }
    export type IOption = 'auto' | 'manual';
    export interface IFlowData {
        activeStep?: number;
        img?: string;
        description?: string;
        option?: IOption;
        steps?: IStep[];
    }
}
/// <amd-module name="@scom/scom-flow" />
declare module "@scom/scom-flow" {
    import { Container, Control, ControlElement, Module } from '@ijstech/components';
    import { IFlowData, IOption, IStep } from "@scom/scom-flow/interface.ts";
    interface ScomFlowElement extends ControlElement {
        img?: string;
        description?: string;
        option?: IOption;
        steps?: IStep[];
        onChanged?: (target: Control, activeStep: number) => void;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-flow']: ScomFlowElement;
            }
        }
    }
    export default class ScomFlow extends Module {
        private pnlStep;
        private pnlEmbed;
        private flowImg;
        private lbDesc;
        private stepElms;
        private widgetContainers;
        private widgets;
        private embeddersConfigurator;
        private _data;
        onChanged: (target: Control, activeStep: number) => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomFlowElement, parent?: Container): Promise<ScomFlow>;
        get description(): string;
        set description(value: string);
        get img(): string;
        set img(value: string);
        get steps(): IStep[];
        set steps(value: IStep[]);
        get option(): IOption;
        set option(value: IOption);
        get activeStep(): number;
        set activeStep(step: number);
        setData(data: IFlowData): Promise<void>;
        getData(): IFlowData;
        private renderUI;
        private renderOption;
        private renderSteps;
        private resetData;
        private renderEmbedElm;
        private onSelectedStep;
        init(): Promise<void>;
        private setThemeVar;
        render(): any;
    }
}
