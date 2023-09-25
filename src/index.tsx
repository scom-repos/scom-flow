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
  IEventBus,
  FormatUtils,
  Icon,
  Table
} from '@ijstech/components';
import { customStyles, expandablePanelStyle, spinnerStyle } from './index.css';
import asset from './asset';
import { IFlowData, IOption, IStep, IWidgetData } from './interface';
import { State } from './store/index';
import { generateUUID } from './utils';
import { INetwork, Utils } from '@ijstech/eth-wallet';
import ScomAccordion  from '@scom/scom-accordion';

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
  private pnlTransactions: VStack;
  private flowImg: Image;
  private lbDesc: Label;
  private stepElms: HStack[] = [];
  private widgetContainerMap: Map<number, Module> = new Map();
  private widgetModuleMap: Map<number, Module> = new Map();
  private $eventBus: IEventBus;
  private steps: IStep[] = [];
  private tableTransactions: Table;
  private transAccordion: ScomAccordion;
  private TransactionsTableColumns = [
    {
      title: 'Date',
      fieldName: 'timestamp',
      key: 'timestamp',
      onRenderCell: (source: Control, columnData: number, rowData: any) => {
        return FormatUtils.unixToFormattedDate(columnData);
      }
    },
    {
      title: 'Txn Hash',
      fieldName: 'hash',
      key: 'hash',
      onRenderCell: async (source: Control, columnData: string, rowData: any) => {
        const networkMap = application.store["networkMap"];
        const networkInfo: INetwork = networkMap[rowData.toToken.chainId];
        const caption = FormatUtils.truncateTxHash(columnData);
        const url = networkInfo.blockExplorerUrls[0] + '/tx/' + columnData;
        const label = new Label(undefined, {
            caption: caption,
            font: {size: '0.875rem'},
            link: {
              href: url,
              target: '_blank',
              font: {size: '0.875rem'}
            },
            tooltip: {
              content: columnData
            }
        });

        return label;
      }
    },
    {
      title: 'Action',
      fieldName: 'desc',
      key: 'desc'
    },
    {
      title: 'Token In Amount',
      fieldName: 'fromTokenAmount',
      key: 'fromTokenAmount',
      onRenderCell: (source: Control, columnData: string, rowData: any) => {
        const fromToken = rowData.fromToken;
        const fromTokenAmount = FormatUtils.formatNumber(Utils.fromDecimals(columnData, fromToken.decimals).toFixed(), {
          decimalFigures: 4
        });
        return `${fromTokenAmount} ${fromToken.symbol}`;
      }
    },
    {
      title: 'Token Out Amount',
      fieldName: 'toTokenAmount',
      key: 'toTokenAmount',
      onRenderCell: (source: Control, columnData: string, rowData: any) => {
        const toToken = rowData.toToken;
        const toTokenAmount = FormatUtils.formatNumber(Utils.fromDecimals(columnData, toToken.decimals).toFixed(), {
          decimalFigures: 4
        });
        return `${toTokenAmount} ${toToken.symbol}`;
      }
    }
  ];

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
          class={'flow-step' + (i === this.activeStep ? ' --active' : '')}
          // background={{color: Theme.action.hover}}
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
      if (!this.isStepSelectable(i)) {
        item.classList.add('--disabled');
      }
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
    this.tableTransactions.data = [];
    this.pnlTransactions.visible = false;
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

  private isStepSelectable(index: number) {
    return index <= this.state.furthestStepIndex;
  }

  private async onSelectedStep(index: number) {
    if (index > this.state.furthestStepIndex && !this.state.checkStep()) return;
    this.activeStep = index;
    const targetWidget = this.widgetModuleMap.get(index);
    const stepInfo = this.steps[index];
    this.pnlTransactions.visible = stepInfo.stage !== 'initialSetup';
    if (!targetWidget) {
      await this.renderEmbedElm(index);
    }
    if (this.onChanged) this.onChanged(this, this.activeStep);
  }

  updateStatus(index: number, value: boolean) {
    this.state.setCompleted(index, value);
    if (value) {
      this.stepElms[index].classList.remove('--disabled');
    }
    else {
      this.stepElms[index].classList.add('--disabled');
    }
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
    this.tableTransactions = <i-table id="tableTransactions" columns={this.TransactionsTableColumns}></i-table>;
    this.transAccordion.addChild(this.tableTransactions);
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
    this.registerEvents();
  }

  private registerEvents() {
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
    this.$eventBus.register(this, `${this.id}:addTransactions`, async (data: any) => {
      if (!data.list) return;
      const transactions = [...this.tableTransactions.data, ...data.list];
      this.tableTransactions.data = transactions;
    });
  }

  private setThemeVar(theme: string) {
    this.style.setProperty('--card-color-l', theme === 'light' ? '5%' : '95%');
    this.style.setProperty('--card-color-a', theme === 'light' ? '0.05' : '0.1');
  }

  // private toggleExpandablePanel(c: Control) {
  //   const icon: Icon = c.querySelector('i-icon.expandable-icon');
  //   const contentPanel: Panel = c.parentNode.querySelector(`i-panel.${expandablePanelStyle}`);
  //   if (c.classList.contains('expanded')) {
  //     icon.name = 'angle-right';
  //     contentPanel.visible = false;
  //     c.classList.remove('expanded');
  //   } else {
  //     icon.name = 'angle-down';
  //     contentPanel.visible = true;
  //     c.classList.add('expanded');
  //   }
  // }

  private onExpanded(c: Control, expanded: boolean) {}

  render() {
    return (
      <i-panel class={customStyles}>
        <i-grid-layout
          templateColumns={['3fr 4fr']}
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
          <i-vstack
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
            <i-vstack id="pnlTransactions" visible={false} padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}>
              <i-scom-accordion
                id="transAccordion"
                name="Transactions"
                defaultExpanded={true}
                onChanged={this.onExpanded}
              ></i-scom-accordion>
              {/* <i-hstack
                horizontalAlignment="space-between"
                verticalAlignment="center"
                padding={{ top: '0.5rem', bottom: '0.5rem' }}
                class="expanded pointer"
                onClick={this.toggleExpandablePanel}
              >
                <i-label caption='Transactions' font={{ size: '1rem' }} lineHeight={1.3}></i-label>
                <i-icon class="expandable-icon" width={20} height={28} fill={Theme.text.primary} name="angle-down"></i-icon>
              </i-hstack>
              <i-panel class={expandablePanelStyle}>
                <i-table id="tableTransactions" columns={this.TransactionsTableColumns}></i-table>
              </i-panel>    */}
            </i-vstack>
          </i-vstack>
        </i-grid-layout>
      </i-panel>
    )
  }
}
