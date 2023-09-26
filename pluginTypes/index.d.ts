/// <amd-module name="@scom/scom-flow/index.css.ts" />
declare module "@scom/scom-flow/index.css.ts" {
    export const customStyles: string;
    export const spinnerStyle: string;
    export const expandablePanelStyle: string;
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
        completed?: boolean;
    }
    export interface ITokenIn {
        chainId: number;
        address?: string;
        amount?: string;
    }
    export interface ITokenOut {
        chainId: number;
        address?: string;
        amount?: string;
    }
    export interface ITokenRequirement {
        tokensIn: ITokenIn[];
        tokenOut: ITokenOut;
    }
    export interface IWidgetData {
        name: string;
        initialSetupStepTitle?: string;
        executionStepTitle: string;
        options: any;
        tokenRequirements?: ITokenRequirement[];
    }
    export type IOption = 'auto' | 'manual';
    export interface IFlowData {
        activeStep?: number;
        img?: string;
        description?: string;
        option?: IOption;
        widgets?: IWidgetData[];
    }
}
/// <amd-module name="@scom/scom-flow/store/state.ts" />
declare module "@scom/scom-flow/store/state.ts" {
    import { IStep } from "@scom/scom-flow/interface.ts";
    export class State {
        private _steps;
        private _activeStep;
        private _furthestStepIndex;
        constructor(data: any);
        get steps(): IStep[];
        set steps(value: IStep[]);
        get currentStep(): IStep;
        get activeStep(): number;
        set activeStep(value: number);
        get furthestStepIndex(): number;
        set furthestStepIndex(value: number);
        getCompleted(index: number): boolean;
        setCompleted(index: number, value: boolean): void;
        checkStep(): boolean;
        checkDone(): boolean;
    }
}
/// <amd-module name="@scom/scom-flow/store/index.ts" />
declare module "@scom/scom-flow/store/index.ts" {
    export * from "@scom/scom-flow/store/state.ts";
}
/// <amd-module name="@scom/scom-flow/utils/index.ts" />
declare module "@scom/scom-flow/utils/index.ts" {
    export const generateUUID: () => string;
}
/// <amd-module name="@scom/scom-flow" />
declare module "@scom/scom-flow" {
    import { Container, Control, ControlElement, Module } from '@ijstech/components';
    import { IFlowData, IOption, IWidgetData } from "@scom/scom-flow/interface.ts";
    interface ScomFlowElement extends ControlElement {
        img?: string;
        description?: string;
        option?: IOption;
        widgets?: IWidgetData[];
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
        private pnlTransactions;
        private flowImg;
        private lbDesc;
        private stepElms;
        private widgetContainerMap;
        private widgetModuleMap;
        private $eventBus;
        private steps;
        private tableTransactions;
        private transAccordion;
        private TransactionsTableColumns;
        private _data;
        private state;
        onChanged: (target: Control, activeStep: number) => void;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomFlowElement, parent?: Container): Promise<ScomFlow>;
        get description(): string;
        set description(value: string);
        get img(): string;
        set img(value: string);
        get option(): IOption;
        set option(value: IOption);
        get activeStep(): number;
        set activeStep(step: number);
        private calculateSteps;
        setData(data: IFlowData): Promise<void>;
        getData(): IFlowData;
        private renderUI;
        private renderOption;
        private renderSteps;
        private resetData;
        private renderEmbedElm;
        private isStepSelectable;
        private onSelectedStep;
        updateStatus(index: number, value: boolean): void;
        getConfigurators(): {
            name: string;
            target: string;
            getData: () => Promise<IFlowData>;
            setData: (data: IFlowData) => Promise<void>;
        }[];
        init(): Promise<void>;
        private registerEvents;
        private setThemeVar;
        render(): any;
    }
}
