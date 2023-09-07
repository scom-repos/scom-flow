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
  Label,
  application
} from '@ijstech/components';
import { customStyles, spinnerStyle } from './index.css';
import asset from './asset';
import { IFlowData, IOption, IStep } from './interface';

const Theme = Styles.Theme.ThemeVars;

interface ScomFlowElement extends ControlElement {
  img?: string;
  description?: string;
  option?: IOption;
  steps?: IStep[];
  onChanged?: (target: Control, activeStep: number) => void;
}

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
  private widgetContainers: Map<number, Module> = new Map();
  private widgets: Map<number, Module> = new Map();
  private embeddersConfigurator: any;

  private _data: IFlowData = {
    activeStep: 0,
    steps: []
  };

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
    return this._data.description;
  }
  set description(value: string) {
    this._data.description = value;
  }

  get img() {
    return this._data.img;
  }
  set img(value: string) {
    this._data.img = value;
  }
  
  get steps() {
    return this._data.steps ?? [];
  }
  set steps(value: IStep[]) {
    this._data.steps = value ?? [];
  }

  get option() {
    return this._data.option ?? 'manual';
  }
  set option(value: IOption) {
    this._data.option = value;
  }

  get activeStep(): number {
    return this._data.activeStep ?? 0;
  }

  set activeStep(step: number) {
    if (this._data.activeStep === step) return;
    if (this.stepElms?.length) {
      const activeStep = this.stepElms[this._data.activeStep];
      const targetStep = this.stepElms[step];
      if (activeStep) activeStep.classList.remove('--active');
      if (targetStep) targetStep.classList.add('--active');
    }
    if (this.widgetContainers?.size) {
      const activeWidgetContainer = this.widgetContainers.get(this._data.activeStep)
      const targetWidgetContainer = this.widgetContainers.get(step)
      if (activeWidgetContainer) activeWidgetContainer.visible = false;
      if (targetWidgetContainer) targetWidgetContainer.visible = true;
    }
    this._data.activeStep = step;
  }

  async setData(data: IFlowData) {
    this._data = data;
    await this.renderUI();
  }

  getData() {
    return this._data;
  }

  private async renderUI() {
    if (this.flowImg) this.flowImg.url = this.img;
    if (this.lbDesc) this.lbDesc.caption = this.description;
    this.renderOption();
    await this.renderSteps();
  }

  private renderOption() {}

  private async renderSteps() {
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
      const contentPanel = (<i-panel class="pane-item" visible={false}></i-panel>);
      contentPanel.setAttribute('data-step', `${i}`);
      this.pnlEmbed.appendChild(contentPanel);
      this.widgetContainers.set(i, contentPanel);
    }
    await this.renderEmbedElm(this.activeStep)
  }

  private resetData() {
    this.widgetContainers = new Map();
    this.widgets = new Map();
    this.stepElms = [];
    this.pnlStep.clearInnerHTML();
    this.pnlEmbed.clearInnerHTML();
  }

  private async renderEmbedElm(step: number) {
    const widgetContainer = this.widgetContainers.get(step);
    if (!widgetContainer) return;
    widgetContainer.clearInnerHTML();
    widgetContainer.visible = true;
    const embedData = this.steps[step]?.embedData || {}
    const widget: any = await application.createElement(embedData?.module?.path || '');
    this.widgets.set(step, widget);
    widgetContainer.appendChild(widget);
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
  }

  private async onSelectedStep(index: number) {
    this.activeStep = index;
    const targetWidget = this.widgets.get(index);
    if (!targetWidget) {
      await this.renderEmbedElm(index);
    }
    if (this.onChanged) this.onChanged(this, this.activeStep);
  }

  async init() {
    super.init();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    const description = this.getAttribute('description', true, '');
    const activeStep = this.getAttribute('activeStep', true, 0);
    const img = this.getAttribute('img', true, '');
    const option = this.getAttribute('option', true, 'manual');
    const steps = this.getAttribute('steps', true, []);
    await this.setData({ description, img, option, steps, activeStep });
    const themeVar = document.body.style.getPropertyValue('--theme');
    this.setThemeVar(themeVar);
  }

  private setThemeVar(theme: string) {
    this.style.setProperty('--card-color-l', theme === 'light' ? '5%' : '95%');
    this.style.setProperty('--card-color-a', theme === 'light' ? '0.05' : '0.1');
  }

  render() {
    return (
      <i-panel class={customStyles}>
        <i-grid-layout
          templateColumns={['repeat(2, 1fr)']}
          gap={{row: '1rem', column: '2rem'}}
        >
          <i-vstack
            border={{style: 'none'}}
            class="shadow"
          >
            <i-hstack
              verticalAlignment="center"
              border={{bottom: {width: '1px', style: 'solid', color: 'hsla(0, 0%, var(--card-color-l), 0.03)'}}}
              padding={{left: '1rem', right: '1rem', top: '1rem', bottom: '1rem'}}
              background={{color: Theme.action.hover}}
              gap={'1rem'}
            >
              <i-image id="flowImg" url={asset.scom} width={50} height={50} display="block"></i-image>
              <i-label id="lbDesc" caption=''></i-label>
            </i-hstack>
            <i-vstack
              padding={{left: '0.5rem', right: '0.5rem', top: '0.5rem', bottom: '0.5rem'}}
              id="pnlStep"
              gap="0.5rem"
            />
          </i-vstack>
          <i-panel
            border={{style: 'none'}}
            class="shadow"
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
            <i-vstack id="pnlEmbed" width="100%"/>
          </i-panel>
        </i-grid-layout>
      </i-panel>
    )
  }
}
