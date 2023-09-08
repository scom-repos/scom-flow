export interface IStep {
  name: string;
  image?: string;
  color?: string;
  widgetData: any;
  stage?: string;
  completed?: boolean;
}

export type IOption = 'auto' | 'manual'

export interface IFlowData {
  activeStep?: number;
  img?: string;
  description?: string;
  option?: IOption;
  steps?: IStep[];
}
