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
        widgetData: IStepWidget;
        isConditional: boolean;
        stage?: string;
        completed?: boolean;
    }
    export interface IStepWidget {
        name: string;
        options: IWidgetDataOptions;
        tokenRequirements?: ITokenRequirement[];
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
    export interface IWidgetDataOptions {
        properties: any;
    }
    export interface IWidgetData {
        name: string;
        initialSetupStepTitle?: string;
        executionStepTitle: string;
        isConditional?: boolean;
        options: IWidgetDataOptions;
        tokenRequirements?: ITokenRequirement[];
    }
    export type IOption = 'auto' | 'manual';
    export interface IFlowHistory {
        dataUri: string;
        walletAddress: string;
        step: number;
        status: string;
        message: string;
        properties?: any;
        timestamp: number;
    }
    export interface IFlowData {
        activeStep?: number;
        img?: string;
        description?: string;
        option?: IOption;
        widgets?: IWidgetData[];
        history?: IFlowHistory[];
        transactions?: any[];
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
/// <amd-module name="@scom/scom-flow/utils/theme.ts" />
declare module "@scom/scom-flow/utils/theme.ts" {
    export const darkTheme: {
        action: {
            disabled: string;
            hover: string;
            selected: string;
        };
        background: {
            main: string;
        };
        colors: {
            primary: {
                light: string;
                main: string;
            };
            success: {
                main: string;
            };
        };
        text: {
            primary: string;
        };
    };
    export const lightTheme: {
        action: {
            disabled: string;
            hover: string;
            selected: string;
        };
        background: {
            main: string;
        };
        colors: {
            primary: {
                light: string;
                main: string;
            };
            success: {
                main: string;
            };
        };
        text: {
            primary: string;
        };
    };
}
/// <amd-module name="@scom/scom-flow/utils/index.ts" />
declare module "@scom/scom-flow/utils/index.ts" {
    export { darkTheme, lightTheme } from "@scom/scom-flow/utils/theme.ts";
}
/// <amd-module name="@scom/scom-flow" />
declare module "@scom/scom-flow" {
    import { Container, Control, ControlElement, Module } from '@ijstech/components';
    import { IFlowData, IOption, IWidgetData } from "@scom/scom-flow/interface.ts";
    interface ScomFlowElement extends ControlElement {
        lazyLoad?: boolean;
        img?: string;
        description?: string;
        option?: IOption;
        widgets?: IWidgetData[];
        onChanged?: (target: Control, activeStep: number) => void;
        onAddTransactions?: (data: any[]) => void;
        onUpdateStepStatus?: (step: number, status: string, message?: string, executionProperties?: any) => void;
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
        private stepMsgLbls;
        private stepStatusLbls;
        private widgetContainerMap;
        private widgetModuleMap;
        private steps;
        private tableTransactions;
        private transAccordion;
        private TransactionsTableColumns;
        private _data;
        private state;
        private stepHistory;
        private stepSequence;
        onChanged: (target: Control, activeStep: number) => void;
        onAddTransactions: (data: any[]) => void;
        onUpdateStepStatus: (step: number, status: string, message?: string, executionProperties?: any) => void;
        static create(options?: ScomFlowElement, parent?: Container): Promise<ScomFlow>;
        get description(): string;
        set description(value: string);
        get img(): string;
        set img(value: string);
        get option(): IOption;
        set option(value: IOption);
        get activeStep(): number;
        set activeStep(step: number);
        get theme(): string;
        private calculateSteps;
        setData(data: IFlowData): Promise<void>;
        getData(): IFlowData;
        getStepTitle(step: number): string;
        private initializeUI;
        private renderOption;
        private renderSteps;
        private updateTokenBalances;
        private checkIfBalancesSufficient;
        private handleJumpToStep;
        private handleNextStep;
        private handleAddTransactions;
        private handleUpdateStepStatus;
        private handleFlowStage;
        private renderEmbedElm;
        private isStepSelectable;
        private onSelectedStep;
        private changeStep;
        updateStatus(index: number, value: boolean): void;
        getConfigurators(): {
            name: string;
            target: string;
            getData: () => Promise<IFlowData>;
            setData: (data: IFlowData) => Promise<void>;
        }[];
        init(): Promise<void>;
        private setThemeVar;
        private updateStyle;
        private updateTheme;
        render(): any;
    }
}
