import {
  Container,
  Control,
  ControlElement,
  customElements,
  HStack,
  Module,
  Panel,
  Styles,
  VStack,
  Image,
  Label
} from '@ijstech/components';
import { customStyles, spinnerStyle } from './index.css';
import asset from './asset';
import { getEmbedElement, getWidgetData } from './utils';

const Theme = Styles.Theme.ThemeVars;

interface ScomFlowElement extends ControlElement {
  img?: string;
  description?: string;
  option?: IOption;
  steps?: IStep[];
  onChanged?: (target: Control, activeStep: number) => void;
}

interface IStep {
  name: string;
  image?: string;
  color?: string;
  embedData: any;
}

type IOption = 'auto' | 'manual'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['i-scom-flow']: ScomFlowElement;
    }
  }
}

@customElements('i-scom-flow')
export default class ScomFlow extends Module {
  private pnlStep: Panel;
  private pnlEmbed: VStack;
  private flowImg: Image;
  private lbDesc: Label;
  private stepElms: HStack[] = [];
  private widgets: Module[] = [];
  private embeddersConfigurator: any;

  private _steps: IStep[] = [];
  private _option: IOption = 'manual';
  private _activeStep: number = 0;
  private _img: string = '';
  private _description: string = '';

  public onChanged: (target: Control, activeStep: number) => void;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  static async create(options?: ScomFlowElement, parent?: Container) {
    let self = new this(parent, options);
    await self.ready();
    return self;
  }

  get description() {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
    if (this.lbDesc) this.lbDesc.caption = value;
  }

  get img() {
    return this._img;
  }
  set img(value: string) {
    this._img = value;
    if (value && this.flowImg) this.flowImg.url = value;
  }
  
  get steps() {
    return this._steps ?? [];
  }
  set steps(value: IStep[]) {
    this._steps = value ?? [];
    this.renderSteps();
  }

  get option() {
    return this._option ?? 'manual';
  }
  set option(value: IOption) {
    this._option = value;
    this.renderOption();
  }

  get activeStep(): number {
    return this._activeStep;
  }

  set activeStep(step: number) {
    if (this._activeStep === step) return;
    if (this.stepElms && this.stepElms.length) {
      const activeStep = this.stepElms[this._activeStep];
      const targetStep = this.stepElms[step];
      if (activeStep) activeStep.classList.remove('--active');
      if (targetStep) targetStep.classList.add('--active');
    }
    if (this.widgets && this.widgets.length) {
      const activeWidget = this.widgets[this._activeStep];
      const targetWidget = this.widgets[step];
      if (activeWidget) activeWidget.visible = false;
      if (targetWidget) targetWidget.visible = true;
      else this.renderEmbedElm(step)
    }
    this._activeStep = step;
  }

  private renderOption() {}

  private renderSteps() {
    this.resetData();
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i]
      const item = (
        <i-hstack
          verticalAlignment="center" horizontalAlignment="space-between"
          gap={'1rem'}
          padding={{left: '1rem', right: '1.5rem', top: '1rem', bottom: '1rem'}}
          class={'step' + (i === this.activeStep ? ' --active' : '')}
          background={{color: Theme.action.hover}}
          onClick={() => this.onSelectedStep(i)}
        >
          <i-vstack gap={'1rem'}>
            <i-panel>
              <i-label
                caption={`${i + 1}`}
                padding={{left: '1rem', right: '1rem', top: '0.25rem', bottom: '0.25rem'}}
                border={{radius: 20}}
                font={{color: '#fff'}}
                background={{color: step.color ?? Theme.colors.primary.light}}
                class="step-icon"
              ></i-label>
            </i-panel>
            <i-label caption={step.name ?? ''} class="step-label"></i-label>
          </i-vstack>
          <i-panel>
            <i-image url={step.image || asset.scom} width={50} display="flex"></i-image>
          </i-panel>
        </i-hstack>
      )
      item.setAttribute('data-step', `${i}`)
      this.pnlStep.appendChild(item);
      this.stepElms.push(item);
    }
    this.renderEmbedElm(this.activeStep)
  }

  private resetData() {
    this.widgets = [];
    this.pnlStep.clearInnerHTML();
    this.pnlEmbed.clearInnerHTML();
    this.stepElms = [];
  }

  private async renderEmbedElm(step: number) {
    const stepData = this.steps[step]?.embedData || {}
    const embedData = await getWidgetData(stepData.dataUri);
    if (!embedData) return;
    const module = embedData.module;
    const path = module.path ? module.path : module.name.replace('@scom/', '');
    const widget = await getEmbedElement(path) as Module;
    this.pnlEmbed.appendChild(widget);
    await (widget as any).ready();
    let properties = embedData.properties;
    let tag = embedData.tag;
    if ((widget as any)?.getConfigurators) {
      this.embeddersConfigurator = (widget as any).getConfigurators().find((configurator: any) => configurator.target === "Embedders");
      (this.embeddersConfigurator?.setData) && await this.embeddersConfigurator.setData(properties);
      if (tag && this.embeddersConfigurator?.setTag) {
        await this.embeddersConfigurator.setTag(tag);
      }
    }
    this.widgets.push(widget)
  }

  private onSelectedStep(index: number) {
    this.activeStep = index;
    if (this.onChanged) this.onChanged(this, this.activeStep);
  }

  init() {
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    const description = this.getAttribute('description', true);
    if (description) this.description = description;
    const img = this.getAttribute('img', true);
    if (img) this.img = img;
    const option = this.getAttribute('option', true);
    if (option) this.option = option;
    const steps = this.getAttribute('steps', true);
    if (steps) this.steps = steps;
  }

  render() {
    return (
      <i-panel class={customStyles}>
        <i-grid-layout
          templateColumns={['repeat(2, 1fr)']}
          gap={{row: '1rem', column: '2rem'}}
        >
          <i-vstack
            border={{width: '1px', style: 'solid', color: Theme.divider}}
          >
            <i-hstack
              verticalAlignment="center"
              border={{bottom: {width: '1px', style: 'solid', color: Theme.divider}}}
              padding={{left: '1rem', right: '1rem', top: '1rem', bottom: '1rem'}}
              background={{color: Theme.action.hover}}
              gap={'1rem'}
            >
              <i-image id="flowImg" url={asset.scom} width={50} display="block" border={{radius: '50%'}}></i-image>
              <i-label id="lbDesc" caption=''></i-label>
            </i-hstack>
            <i-vstack
              padding={{left: '0.5rem', right: '0.5rem', top: '0.5rem', bottom: '0.5rem'}}
              id="pnlStep"
              gap="0.5rem"
            />
          </i-vstack>
          <i-panel
            border={{width: '1px', style: 'solid', color: Theme.divider}}
          >
            <i-vstack
              id="pnlLoading"
              stack={{ grow: '1' }}
              horizontalAlignment="center"
              verticalAlignment="center"
              padding={{ top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }}
              visible={false}
            >
              <i-panel class={spinnerStyle}></i-panel>
            </i-vstack>
            <i-vstack
              id="pnlEmbed"
              width="100%"
              padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
            />
          </i-panel>
        </i-grid-layout>
      </i-panel>
    )
  }
}
