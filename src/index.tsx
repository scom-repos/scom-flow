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
  application,
  IEventBus
} from '@ijstech/components';
import { customStyles, spinnerStyle } from './index.css';
import asset from './asset';
import { IFlowData, IOption, IStep, IWidgetData } from './interface';
import { State } from './store/index';
import { generateUUID } from './utils';

const Theme = Styles.Theme.ThemeVars;

interface ScomFlowElement extends ControlElement {
  img?: string;
  description?: string;
  option?: IOption;
  widgets?: IWidgetData[];
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
  private widgetContainerMap: Map<number, Module> = new Map();
  private widgetModuleMap: Map<number, Module> = new Map();
  private $eventBus: IEventBus;
  private steps: IStep[] = [];

  private _data: IFlowData = {
    activeStep: 0
  };
  private state: State;

  public onChanged: (target: Control, activeStep: number) => void;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
    this.$eventBus = application.EventBus;
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
    if (this.widgetContainerMap?.size) {
      const activeWidgetContainer = this.widgetContainerMap.get(this._data.activeStep)
      const targetWidgetContainer = this.widgetContainerMap.get(step)
      if (activeWidgetContainer) activeWidgetContainer.visible = false;
      if (targetWidgetContainer) targetWidgetContainer.visible = true;
    }
    this._data.activeStep = step;
    this.state.activeStep = step;
  }

  private calculateSteps(widgets: IWidgetData[]) {
    let steps = [];
    for (let widget of widgets) {
      if (widget.initialSetupStepTitle) {
        steps.push({
          name: widget.initialSetupStepTitle,
          image: '',
          color: Theme.colors.success.main,
          stage: 'initialSetup',
          widgetData: {
            name: widget.name,
            options: widget.options,
            tokenRequirements: widget.tokenRequirements
          }
        });
      }
      if (widget.tokenRequirements) {
        steps.push({
          name: 'Acquire Tokens',
          image: '',
          color: Theme.colors.success.main,
          stage: 'tokenAcquisition',
          widgetData: {
            name: 'scom-token-acquisition',
            tokenRequirements: widget.tokenRequirements
          }
        });
      }
      if (widget.executionStepTitle) {
        steps.push({
          name: widget.executionStepTitle,
          image: '',
          color: Theme.colors.success.main,
          stage: 'execution',
          widgetData: {
            name: widget.name,
            options: widget.options,
            tokenRequirements: widget.tokenRequirements
          }
        });
      }
    }
    return steps;
  }
  async setData(data: IFlowData) {
    this._data = data;
    this.steps = this.calculateSteps(this._data.widgets);
    this.state = new State({steps: this.steps ?? [], activeStep: this._data.activeStep ?? 0});
    this.state.steps = this.steps;
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
            <i-image url={step.image} width={50} display="flex"></i-image>
          </i-panel>
        </i-hstack>
      )
      item.setAttribute('data-step', `${i}`)
      this.pnlStep.appendChild(item);
      this.stepElms.push(item);
      const contentPanel = (<i-panel class="pane-item" visible={false}></i-panel>);
      contentPanel.setAttribute('data-step', `${i}`);
      this.pnlEmbed.appendChild(contentPanel);
      this.widgetContainerMap.set(i, contentPanel);
    }
    await this.renderEmbedElm(this.activeStep)
  }

  private resetData() {
    this.widgetContainerMap = new Map();
    this.widgetModuleMap = new Map();
    this.stepElms = [];
    this.pnlStep.clearInnerHTML();
    this.pnlEmbed.clearInnerHTML();
  }

  private async renderEmbedElm(step: number) {
    const widgetContainer = this.widgetContainerMap.get(step);
    if (!widgetContainer) return;
    widgetContainer.clearInnerHTML();
    widgetContainer.visible = true;
    const stepInfo = this.steps[step];
    const widgetData = stepInfo?.widgetData || {}
    const flowWidget: any = await application.createElement(widgetData.name);
    if (flowWidget) {
      flowWidget.id = generateUUID();
      const flowWidgetObj = await flowWidget.handleFlowStage(widgetContainer, stepInfo.stage, {
        ...widgetData.options,
        invokerId: this.id,
        tokenRequirements: widgetData.tokenRequirements,
        initialSetupData: widgetData.initialSetupData
      });
      if (flowWidgetObj) {
        this.widgetModuleMap.set(step, flowWidgetObj.widget);
      }
      // For Test
      // if (widgetData.name === 'scom-token-acquisition') {
      //   flowWidgetObj.widget.onUpdateStatus();
      // }
    }
  }

  private async onSelectedStep(index: number) {
    if (index > this.state.furthestStepIndex && !this.state.checkStep()) return;
    this.activeStep = index;
    const targetWidget = this.widgetModuleMap.get(index);
    if (!targetWidget) {
      await this.renderEmbedElm(index);
    }
    if (this.onChanged) this.onChanged(this, this.activeStep);
  }

  updateStatus(index: number, value: boolean) {
    this.state.setCompleted(index, value);
  }

  getConfigurators() {
    let self = this;
    return [
      {
        name: 'Embedder Configurator',
        target: 'Embedders',
        getData: async () => {
          return this._data
        },
        setData: async (data: IFlowData) => {
          await this.setData(data);
        }
      }
    ]
  }


  async init() {
    super.init();
    this.id = generateUUID();
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    const description = this.getAttribute('description', true, '');
    const activeStep = this.getAttribute('activeStep', true, 0);
    const img = this.getAttribute('img', true, '');
    const option = this.getAttribute('option', true, 'manual');
    const widgets = this.getAttribute('widgets', true, []);
    await this.setData({ description, img, option, widgets, activeStep });
    const themeVar = document.body.style.getPropertyValue('--theme');
    this.setThemeVar(themeVar);
    this.$eventBus.register(this, `${this.id}:nextStep`, async (data: any) => {
      let nextStep: number;
      let options: any;
      this.steps.forEach((step, index) => {
        this.updateStatus(index, true);
      });
      if (data.tokenAcquisition) {
        nextStep = this.state.steps.findIndex((step, index) => step.stage === 'tokenAcquisition' && index > this.activeStep);
        options = {
          properties: data.executionProperties,
          onDone: async (target: Control) => {
              console.log('Completed all steps', target)
              await this.onSelectedStep(this.activeStep + 1);
          }
        }
      }
      else {
        nextStep = this.state.steps.findIndex((step, index)  => step.stage === 'execution' && index > this.activeStep);
        options = {
          properties: data.executionProperties
        }
      }
      this.steps[nextStep].widgetData = {
        ...this.steps[nextStep].widgetData,
        options: options,
        tokenRequirements: data.tokenRequirements
      }
      console.log('nextStep', data);
      if (nextStep) {
        await this.onSelectedStep(nextStep);
      }
    });
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
          mediaQueries={[
            {
              maxWidth: '767px',
              properties: {
                templateColumns: ['auto']
              }
            }
          ]}
        >
          <i-panel>
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
                <i-panel minWidth={50}>
                  <i-image id="flowImg" url={asset.scom} width={50} height={50} display="block"></i-image>
                </i-panel>
                <i-label id="lbDesc" caption='' lineHeight={1.5}></i-label>
              </i-hstack>
              <i-vstack
                padding={{left: '0.5rem', right: '0.5rem', top: '0.5rem', bottom: '0.5rem'}}
                id="pnlStep"
                gap="0.5rem"
              />
            </i-vstack>
          </i-panel>
          <i-panel
            border={{style: 'none'}}
            maxWidth={'100%'}
            overflow={'hidden'}
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
