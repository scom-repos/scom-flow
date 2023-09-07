export interface IStep {
  name: string;
  image?: string;
  color?: string;
  embedData: any;
}

export type IOption = 'auto' | 'manual'

export interface IFlowData {
  activeStep?: number;
  img?: string;
  description?: string;
  option?: IOption;
  steps?: IStep[];
}
