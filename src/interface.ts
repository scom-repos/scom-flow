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
  amount?: number;
}

export interface ITokenOut {
  chainId: number;
  address?: string;
  amount?: number;
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

export type IOption = 'auto' | 'manual'

export interface IFlowData {
  activeStep?: number;
  img?: string;
  description?: string;
  option?: IOption;
  widgets?: IWidgetData[];
}
