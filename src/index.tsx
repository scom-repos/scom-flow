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
import { darkTheme, lightTheme } from './utils';
import { BigNumber, INetwork, Utils } from '@ijstech/eth-wallet';
import ScomAccordion  from '@scom/scom-accordion';
import { tokenStore, ChainNativeTokenByChainId } from '@scom/scom-token-list';

const Theme = Styles.Theme.ThemeVars;

interface ScomFlowElement extends ControlElement {
  lazyLoad?: boolean;
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
        const vstack = new VStack();
        const token = rowData.toToken || rowData.fromToken; //FIXME: toToken or fromToken
        const chainId = rowData.chainId || token.chainId;
        const networkInfo: INetwork = networkMap[chainId];
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
        vstack.append(label);
        return vstack;
      }
    },
    {
      title: 'Description',
      fieldName: 'desc',
      key: 'desc'
    },
    {
      title: 'Value',
      fieldName: '',
      key: '',
      onRenderCell: (source: Control, columnData: string, rowData: any) => {
        console.log('rowData', rowData)
        const vstack = new VStack();
        if (rowData.value) {
          const hstack = new HStack(undefined, {
            verticalAlignment: 'center',
            gap: 6
          });
          vstack.append(hstack);
          const lblValue = new Label(undefined, {
            caption: rowData.value,
            font: { size: '0.875rem' }
          });
          hstack.append(lblValue);
          const iconCopy = new Icon(undefined, {
            width: 16,
            height: 16,
            name: 'copy'
          });
          iconCopy.classList.add('pointer');
          iconCopy.onClick = () => application.copyToClipboard(rowData.value || '');
          hstack.append(iconCopy);
        } else {
          const fromToken = rowData.fromToken;
          if (fromToken) {
            const fromTokenAmount = FormatUtils.formatNumber(Utils.fromDecimals(rowData.fromTokenAmount, fromToken.decimals).toFixed(), {
              decimalFigures: 4
            });
            const fromTokenLabel = new Label(undefined, {
              caption: `${fromTokenAmount} ${fromToken.symbol}`,
              font: {size: '0.875rem'}
            });
            vstack.append(fromTokenLabel);
          }
          const toToken = rowData.toToken;
          if (toToken) {
            const toTokenAmount = FormatUtils.formatNumber(Utils.fromDecimals(rowData.toTokenAmount, toToken.decimals).toFixed(), {
              decimalFigures: 4
            });
            const toTokenLabel = new Label(undefined, {
              caption: `${toTokenAmount} ${toToken.symbol}`,
              font: {size: '0.875rem'}
            });
            vstack.append(toTokenLabel);
          }
        }
        return vstack;
      }
    }
  ];

  private _data: IFlowData = {
    activeStep: 0
  };
  private state: State;

  public onChanged: (target: Control, activeStep: number) => void;

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

  get theme() {
    return document.body.style.getPropertyValue('--theme');
  }

  private calculateSteps(widgets: IWidgetData[]) {
    let steps: IStep[] = [];
    for (let widget of widgets) {
      if (widget.initialSetupStepTitle) {
        steps.push({
          name: widget.initialSetupStepTitle,
          image: '',
          color: Theme.colors.success.main,
          stage: 'initialSetup',
          isConditional: widget.isConditional || false,
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
          isConditional: widget.isConditional || false,
          widgetData: {
            name: 'scom-token-acquisition',
            options: widget.options,
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
          isConditional: widget.isConditional || false,
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
    await this.transAccordion.setData({
      items: [
        {
          name: 'Transactions',
          defaultExpanded: true,
          onRender: () => {
            return <i-table id="tableTransactions" columns={this.TransactionsTableColumns}></i-table>
          }
        }
      ]
    })
    this.tableTransactions.data = [];
    this._data = data;
    this.steps = this.calculateSteps(this._data.widgets);
    this.state = new State({steps: this.steps ?? [], activeStep: this._data.activeStep ?? 0});
    this.state.steps = this.steps;
    await this.initializeUI();
  }

  getData() {
    return this._data;
  }

  private async initializeUI() {
    if (this.flowImg) this.flowImg.url = this.img;
    if (this.lbDesc) this.lbDesc.caption = this.description;
    this.renderOption();
    this.widgetContainerMap = new Map();
    this.widgetModuleMap = new Map();
    this.stepElms = [];
    if (this.tableTransactions) this.tableTransactions.data = [];
    this.pnlTransactions.visible = false;
    this.pnlStep.clearInnerHTML();
    this.pnlEmbed.clearInnerHTML();
    await this.renderSteps();
    const flowWidget = await this.renderEmbedElm(this.activeStep);
    const stepInfo = this.steps[this.activeStep];
    const widgetData = stepInfo?.widgetData;
    if (widgetData.tokenRequirements) {
      await this.updateTokenBalances(widgetData.tokenRequirements);
    }
    const flowWidgetObj = await this.handleFlowStage(this.activeStep, flowWidget, false);
  }

  private renderOption() {}

  private async renderSteps() {
    let requiredStepIndex = 0;
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i]
      if (!step.isConditional) requiredStepIndex++;
      const item = (
        <i-hstack
          visible={!step.isConditional}
          verticalAlignment="center" horizontalAlignment="space-between"
          gap={'1rem'}
          padding={{left: '1rem', right: '1.5rem', top: '1rem', bottom: '1rem'}}
          class={'flow-step' + (i === this.activeStep ? ' --active' : '')}
          // background={{color: Theme.action.hover}}
          onClick={() => this.onSelectedStep(i)}
        >
          <i-vstack gap={'1rem'}>
            <i-panel visible={!step.isConditional}>
              <i-label 
                caption={`${requiredStepIndex}`}
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
  }

  private async updateTokenBalances(tokenRequirements: any) {
    let chainIds = new Set<number>();
    if (tokenRequirements) {
      for (let tokenRequirement of tokenRequirements) {
        chainIds.add(tokenRequirement.tokenOut.chainId);
        tokenRequirement.tokensIn.forEach(token => {
          chainIds.add(token.chainId);
        });
      }
    }
    for (let chainId of chainIds) {
      await tokenStore.updateTokenBalancesByChainId(chainId);
    }
  }

  private checkIfBalancesSufficient(tokenRequirements: any) {
    if (tokenRequirements) {
      for (let tokenRequirement of tokenRequirements) {
        const tokenOut = tokenRequirement.tokenOut;
        const tokenOutAddress = tokenOut.address ? tokenOut.address.toLowerCase() : ChainNativeTokenByChainId[tokenOut.chainId].symbol;
        const tokenBalances = tokenStore.getTokenBalancesByChainId(tokenOut.chainId);
        const tokenOutBalance = tokenBalances[tokenOutAddress];
        const isBalanceSufficient = new BigNumber(tokenOutBalance).gte(tokenOut.amount);
        if (!isBalanceSufficient) return false;
      }
    }
    return true;
  }

  private async handleJumpToStep(data: any) {
    this.steps.forEach((step, index) => {
      this.updateStatus(index, true);
    });
    let stage = data.stage || 'execution';
    let nextStep = this.state.steps.findIndex((step, index) => step.widgetData.name === data.widgetName && step.stage === stage && index > this.activeStep);
    if (this.steps[nextStep].isConditional) {
      this.stepElms[nextStep].visible = true;
    }
    const widgetData = this.steps[nextStep].widgetData;
    this.steps[nextStep].widgetData = {
      ...widgetData
    }
    if (data.executionProperties) {
      this.steps[nextStep].widgetData.options = {
        properties: {
          ...widgetData.options.properties,
          ...data.executionProperties
        }
      }
    }
    if (data.tokenRequirements) {
      this.steps[nextStep].widgetData.tokenRequirements = data.tokenRequirements;
    }
    if (nextStep) {
      await this.changeStep(nextStep, false);
    }
  }

  private async handleNextStep(data: any) {
    let nextStep: number;
    this.steps.forEach((step, index) => {
      this.updateStatus(index, true);
    });
    const balancesSufficient = this.checkIfBalancesSufficient(data.tokenRequirements);
    if (!balancesSufficient) {
      nextStep = this.state.steps.findIndex((step, index) => step.stage === 'tokenAcquisition' && index > this.activeStep);
    }
    else {
      nextStep = this.state.steps.findIndex((step, index) => step.stage === 'execution' && index > this.activeStep);
    }
    const widgetData = this.steps[nextStep].widgetData;
    this.steps[nextStep].widgetData = {
      ...widgetData
    }
    if (data.executionProperties) {
      this.steps[nextStep].widgetData.options = {
        properties: {
          ...widgetData.options.properties,
          ...data.executionProperties
        },
        // onDone: async (target: Control) => {
        //     console.log('Completed all steps', target)
        //     await this.changeStep(this.activeStep + 1, true);
        // }
      }
    }
    if (data.tokenRequirements) {
      this.steps[nextStep].widgetData.tokenRequirements = data.tokenRequirements;
    }
    console.log('nextStep', data);
    if (nextStep) {
      await this.changeStep(nextStep, false);
    }
  }

  private async handleAddTransactions(data: any) {
    if (!data.list) return;
    const transactions = [...this.tableTransactions.data, ...data.list];
    this.tableTransactions.data = transactions;
  }

  private async handleFlowStage(step: number, flowWidget: any, isWidgetConnected: boolean) {
    const widgetContainer = this.widgetContainerMap.get(step);
    const stepInfo = this.steps[step];
    const widgetData = stepInfo?.widgetData;
    const flowWidgetObj = await flowWidget.handleFlowStage(widgetContainer, stepInfo.stage, {
      ...widgetData.options,
      isWidgetConnected: isWidgetConnected,
      tokenRequirements: widgetData.tokenRequirements,
      onNextStep: this.handleNextStep.bind(this),
      onJumpToStep: this.handleJumpToStep.bind(this),
      onAddTransactions: this.handleAddTransactions.bind(this)
    });
    if (flowWidgetObj) {
      this.widgetModuleMap.set(step, flowWidgetObj.widget);
    }
    return flowWidgetObj;
  }

  private async renderEmbedElm(step: number) {
    const widgetContainer = this.widgetContainerMap.get(step);
    if (!widgetContainer) return;
    widgetContainer.clearInnerHTML();
    widgetContainer.visible = true;
    const stepInfo = this.steps[step];
    const widgetData = stepInfo?.widgetData
    let flowWidget = await application.createElement(widgetData.name);
    return flowWidget;
  }

  private isStepSelectable(index: number) {
    return index <= this.state.furthestStepIndex;
  }

  private async onSelectedStep(index: number) {
    await this.changeStep(index, true);
    if (this.onChanged) this.onChanged(this, index);
  }

  private async changeStep(index: number, isUserTriggered: boolean) {
    if (index > this.state.furthestStepIndex && !this.state.checkStep()) return;
    this.activeStep = index;
    const stepInfo = this.steps[index];
    this.pnlTransactions.visible = stepInfo.stage !== 'initialSetup';
    let flowWidget: any = this.widgetModuleMap.get(this.activeStep);
    const widgetData = stepInfo?.widgetData;
    if (widgetData.tokenRequirements) {
      await this.updateTokenBalances(widgetData.tokenRequirements);
    }
    if (flowWidget) {
      await this.handleFlowStage(this.activeStep, flowWidget, true);
    }
    else {
      flowWidget = await this.renderEmbedElm(index);
      if (flowWidget) await this.handleFlowStage(this.activeStep, flowWidget, false);
    }
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
      },
      {
        name: 'Builder Configurator',
        target: 'Builders',
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
    this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
    const lazyLoad = this.getAttribute('lazyLoad', true, false);
    if (!lazyLoad) {
      const description = this.getAttribute('description', true, '');
      const activeStep = this.getAttribute('activeStep', true, 0);
      const img = this.getAttribute('img', true, '');
      const option = this.getAttribute('option', true, 'manual');
      const widgets = this.getAttribute('widgets', true, []);
      if (widgets?.length > 0) {
        await this.setData({ description, img, option, widgets, activeStep });
      }
    }
    this.updateTheme();
  }

  private setThemeVar() {
    this.style.setProperty('--card-color-l', this.theme === 'light' ? '5%' : '95%');
    this.style.setProperty('--card-color-a', this.theme === 'light' ? '0.05' : '0.1');
  }

  private updateStyle(name: string, value: any) {
    value ?
      this.style.setProperty(name, value) :
      this.style.removeProperty(name);
  }
  
  private updateTheme() {
    this.setThemeVar();
    const themeVars = this.theme === 'light' ? lightTheme : darkTheme;
    this.updateStyle('--action-disabled', themeVars.action.disabled);
    this.updateStyle('--action-hover', themeVars.action.hover);
    this.updateStyle('--action-selected', themeVars.action.selected);
    this.updateStyle('--background-main', themeVars.background.main);
    this.updateStyle('--colors-primary-light', themeVars.colors.primary.light);
    this.updateStyle('--colors-secondary-main', themeVars.colors.primary.main);
    this.updateStyle('--colors-success-main', themeVars.colors.success.main);
    this.updateStyle('--text-primary', themeVars.text.primary);
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
              border={{ style: 'none', radius: 6 }}
              class="shadow"
              overflow="hidden"
              background={{ color: Theme.background.main }}
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
            border={{ style: 'none', radius: 6 }}
            maxWidth={'100%'}
            class="shadow"
            overflow="hidden"
            background={{ color: Theme.background.main }}
            
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
