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

export type IOption = 'auto' | 'manual'

export interface IFlowData {
  activeStep?: number;
  img?: string;
  description?: string;
  option?: IOption;
  widgets?: IWidgetData[];
  transactions?: any[];
  stepHistory?: { [step: number]: any };
}
