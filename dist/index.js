var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-flow/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.expandablePanelStyle = exports.spinnerStyle = exports.customStyles = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    exports.customStyles = components_1.Styles.style({
        $nest: {
            '.flow-step': {
                userSelect: 'none',
                cursor: 'pointer',
                background: Theme.action.selected,
            },
            '.flow-step.--disabled': {
                cursor: 'not-allowed',
                background: Theme.action.disabled,
            },
            '.flow-step.--active .step-icon': {
                background: Theme.colors.primary.main,
                transition: 'all .3s ease-in'
            },
            '.flow-step.--active .step-label': {
                color: `${Theme.text.primary} !important`,
                transition: 'all .3s ease-in'
            },
            '.flow-step.--active .step-label-container > .step-label': {
                fontWeight: 600
            },
            '.shadow': {
                boxShadow: `0 0 0 2px hsla(0, 0%, var(--card-color-l), var(--card-color-a))`,
            },
            '#flowImg img': {
                borderRadius: '50%',
                objectFit: 'cover',
                objectPosition: 'center'
            }
        }
    });
    const spin = components_1.Styles.keyframes({
        "to": {
            "-webkit-transform": "rotate(360deg)"
        }
    });
    exports.spinnerStyle = components_1.Styles.style({
        display: "inline-block",
        width: "50px",
        height: "50px",
        border: "3px solid rgba(255,255,255,.3)",
        borderRadius: "50%",
        borderTopColor: Theme.colors.primary.main,
        "animation": `${spin} 1s ease-in-out infinite`,
        "-webkit-animation": `${spin} 1s ease-in-out infinite`
    });
    exports.expandablePanelStyle = components_1.Styles.style({
        $nest: {
            'i-panel': {
                border: 'none'
            },
            '#comboEmbedType .icon-btn': {
                opacity: 0.5
            }
        }
    });
});
define("@scom/scom-flow/asset.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let moduleDir = components_2.application.currentModuleDir;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    exports.default = {
        scom: fullPath('img/scom.svg'),
        fullPath
    };
});
define("@scom/scom-flow/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-flow/store/state.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.State = void 0;
    class State {
        constructor(data) {
            var _a, _b;
            this._activeStep = (_a = data === null || data === void 0 ? void 0 : data.activeStep) !== null && _a !== void 0 ? _a : 0;
            this._steps = (_b = data === null || data === void 0 ? void 0 : data.steps) !== null && _b !== void 0 ? _b : [];
        }
        get steps() {
            var _a;
            return (_a = this._steps) !== null && _a !== void 0 ? _a : [];
        }
        set steps(value) {
            this._steps = value;
        }
        get currentStep() {
            return this._steps[this.activeStep];
        }
        get activeStep() {
            var _a;
            return (_a = this._activeStep) !== null && _a !== void 0 ? _a : 0;
        }
        set activeStep(value) {
            this._activeStep = value;
        }
        get furthestStepIndex() {
            var _a;
            return (_a = this._furthestStepIndex) !== null && _a !== void 0 ? _a : 0;
        }
        set furthestStepIndex(value) {
            this._furthestStepIndex = value;
        }
        getCompleted(index) {
            var _a, _b;
            return (_b = (_a = this._steps[index]) === null || _a === void 0 ? void 0 : _a.completed) !== null && _b !== void 0 ? _b : false;
        }
        setCompleted(index, value) {
            const step = this._steps[index];
            if (step)
                step.completed = value;
        }
        checkStep() {
            return this.activeStep < this._steps.length && this.getCompleted(this.activeStep);
        }
        checkDone() {
            return this.steps.every(step => step.completed);
        }
    }
    exports.State = State;
});
define("@scom/scom-flow/store/index.ts", ["require", "exports", "@scom/scom-flow/store/state.ts"], function (require, exports, state_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-flow/store/index.ts'/> 
    __exportStar(state_1, exports);
});
define("@scom/scom-flow/utils/index.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.generateUUID = void 0;
    ///<amd-module name='@scom/scom-flow/utils/index.ts'/> 
    const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    exports.generateUUID = generateUUID;
});
define("@scom/scom-flow", ["require", "exports", "@ijstech/components", "@scom/scom-flow/index.css.ts", "@scom/scom-flow/asset.ts", "@scom/scom-flow/store/index.ts", "@scom/scom-flow/utils/index.ts", "@ijstech/eth-wallet"], function (require, exports, components_3, index_css_1, asset_1, index_1, utils_1, eth_wallet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_3.Styles.Theme.ThemeVars;
    let ScomFlow = class ScomFlow extends components_3.Module {
        constructor() {
            super(...arguments);
            this.stepElms = [];
            this.widgetContainerMap = new Map();
            this.widgetModuleMap = new Map();
            this.steps = [];
            this.TransactionsTableColumns = [
                {
                    title: 'Date',
                    fieldName: 'timestamp',
                    key: 'timestamp',
                    onRenderCell: (source, columnData, rowData) => {
                        return components_3.FormatUtils.unixToFormattedDate(columnData);
                    }
                },
                {
                    title: 'Txn Hash',
                    fieldName: 'hash',
                    key: 'hash',
                    onRenderCell: async (source, columnData, rowData) => {
                        const networkMap = components_3.application.store["networkMap"];
                        const vstack = new components_3.VStack();
                        const token = rowData.toToken || rowData.fromToken; //FIXME: toToken or fromToken
                        const networkInfo = networkMap[token.chainId];
                        const caption = components_3.FormatUtils.truncateTxHash(columnData);
                        const url = networkInfo.blockExplorerUrls[0] + '/tx/' + columnData;
                        const label = new components_3.Label(undefined, {
                            caption: caption,
                            font: { size: '0.875rem' },
                            link: {
                                href: url,
                                target: '_blank',
                                font: { size: '0.875rem' }
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
                    title: 'Token Amounts',
                    fieldName: '',
                    key: '',
                    onRenderCell: (source, columnData, rowData) => {
                        console.log('rowData', rowData);
                        const vstack = new components_3.VStack();
                        const fromToken = rowData.fromToken;
                        if (fromToken) {
                            const fromTokenAmount = components_3.FormatUtils.formatNumber(eth_wallet_1.Utils.fromDecimals(rowData.fromTokenAmount, fromToken.decimals).toFixed(), {
                                decimalFigures: 4
                            });
                            const fromTokenLabel = new components_3.Label(undefined, {
                                caption: `${fromTokenAmount} ${fromToken.symbol}`,
                                font: { size: '0.875rem' }
                            });
                            vstack.append(fromTokenLabel);
                        }
                        const toToken = rowData.toToken;
                        if (toToken) {
                            const toTokenAmount = components_3.FormatUtils.formatNumber(eth_wallet_1.Utils.fromDecimals(rowData.toTokenAmount, toToken.decimals).toFixed(), {
                                decimalFigures: 4
                            });
                            const toTokenLabel = new components_3.Label(undefined, {
                                caption: `${toTokenAmount} ${toToken.symbol}`,
                                font: { size: '0.875rem' }
                            });
                            vstack.append(toTokenLabel);
                        }
                        return vstack;
                    }
                }
            ];
            this._data = {
                activeStep: 0
            };
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get description() {
            return this._data.description;
        }
        set description(value) {
            this._data.description = value;
        }
        get img() {
            return this._data.img;
        }
        set img(value) {
            this._data.img = value;
        }
        get option() {
            var _a;
            return (_a = this._data.option) !== null && _a !== void 0 ? _a : 'manual';
        }
        set option(value) {
            this._data.option = value;
        }
        get activeStep() {
            var _a;
            return (_a = this._data.activeStep) !== null && _a !== void 0 ? _a : 0;
        }
        set activeStep(step) {
            var _a, _b;
            if (this._data.activeStep === step)
                return;
            if ((_a = this.stepElms) === null || _a === void 0 ? void 0 : _a.length) {
                const activeStep = this.stepElms[this._data.activeStep];
                const targetStep = this.stepElms[step];
                if (activeStep)
                    activeStep.classList.remove('--active');
                if (targetStep)
                    targetStep.classList.add('--active');
            }
            if ((_b = this.widgetContainerMap) === null || _b === void 0 ? void 0 : _b.size) {
                const activeWidgetContainer = this.widgetContainerMap.get(this._data.activeStep);
                const targetWidgetContainer = this.widgetContainerMap.get(step);
                if (activeWidgetContainer)
                    activeWidgetContainer.visible = false;
                if (targetWidgetContainer)
                    targetWidgetContainer.visible = true;
            }
            this._data.activeStep = step;
            this.state.activeStep = step;
        }
        calculateSteps(widgets) {
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
        async setData(data) {
            var _a, _b;
            await this.transAccordion.setData({
                items: [
                    {
                        name: 'Transactions',
                        defaultExpanded: true,
                        onRender: () => {
                            return this.$render("i-table", { id: "tableTransactions", columns: this.TransactionsTableColumns });
                        }
                    }
                ]
            });
            this.tableTransactions.data = [];
            this._data = data;
            this.steps = this.calculateSteps(this._data.widgets);
            this.state = new index_1.State({ steps: (_a = this.steps) !== null && _a !== void 0 ? _a : [], activeStep: (_b = this._data.activeStep) !== null && _b !== void 0 ? _b : 0 });
            this.state.steps = this.steps;
            await this.renderUI();
        }
        getData() {
            return this._data;
        }
        async renderUI() {
            if (this.flowImg)
                this.flowImg.url = this.img;
            if (this.lbDesc)
                this.lbDesc.caption = this.description;
            this.renderOption();
            await this.renderSteps();
        }
        renderOption() { }
        async renderSteps() {
            var _a, _b;
            this.resetData();
            for (let i = 0; i < this.steps.length; i++) {
                const step = this.steps[i];
                const item = (this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "space-between", gap: '1rem', padding: { left: '1rem', right: '1.5rem', top: '1rem', bottom: '1rem' }, class: 'flow-step' + (i === this.activeStep ? ' --active' : ''), 
                    // background={{color: Theme.action.hover}}
                    onClick: () => this.onSelectedStep(i) },
                    this.$render("i-vstack", { gap: '1rem' },
                        this.$render("i-panel", null,
                            this.$render("i-label", { caption: `${i + 1}`, padding: { left: '1rem', right: '1rem', top: '0.25rem', bottom: '0.25rem' }, border: { radius: 20 }, font: { color: '#fff' }, background: { color: (_a = step.color) !== null && _a !== void 0 ? _a : Theme.colors.primary.light }, class: "step-icon" })),
                        this.$render("i-label", { caption: (_b = step.name) !== null && _b !== void 0 ? _b : '', class: "step-label" })),
                    this.$render("i-panel", null,
                        this.$render("i-image", { url: step.image, width: 50, display: "flex" }))));
                if (!this.isStepSelectable(i)) {
                    item.classList.add('--disabled');
                }
                item.setAttribute('data-step', `${i}`);
                this.pnlStep.appendChild(item);
                this.stepElms.push(item);
                const contentPanel = (this.$render("i-panel", { class: "pane-item", visible: false }));
                contentPanel.setAttribute('data-step', `${i}`);
                this.pnlEmbed.appendChild(contentPanel);
                this.widgetContainerMap.set(i, contentPanel);
            }
            await this.renderEmbedElm(this.activeStep);
        }
        resetData() {
            this.widgetContainerMap = new Map();
            this.widgetModuleMap = new Map();
            this.stepElms = [];
            if (this.tableTransactions)
                this.tableTransactions.data = [];
            this.pnlTransactions.visible = false;
            this.pnlStep.clearInnerHTML();
            this.pnlEmbed.clearInnerHTML();
        }
        async handleNextStep(data) {
            let nextStep;
            let options;
            this.steps.forEach((step, index) => {
                this.updateStatus(index, true);
            });
            if (data.tokenAcquisition) {
                nextStep = this.state.steps.findIndex((step, index) => step.stage === 'tokenAcquisition' && index > this.activeStep);
                options = {
                    properties: data.executionProperties,
                    onDone: async (target) => {
                        console.log('Completed all steps', target);
                        await this.onSelectedStep(this.activeStep + 1);
                    }
                };
            }
            else {
                nextStep = this.state.steps.findIndex((step, index) => step.stage === 'execution' && index > this.activeStep);
                options = {
                    properties: data.executionProperties
                };
            }
            this.steps[nextStep].widgetData = Object.assign(Object.assign({}, this.steps[nextStep].widgetData), { options: options, tokenRequirements: data.tokenRequirements });
            console.log('nextStep', data);
            if (nextStep) {
                await this.onSelectedStep(nextStep);
            }
        }
        async handleAddTransactions(data) {
            if (!data.list)
                return;
            const transactions = [...this.tableTransactions.data, ...data.list];
            this.tableTransactions.data = transactions;
        }
        async renderEmbedElm(step) {
            const widgetContainer = this.widgetContainerMap.get(step);
            if (!widgetContainer)
                return;
            widgetContainer.clearInnerHTML();
            widgetContainer.visible = true;
            const stepInfo = this.steps[step];
            const widgetData = (stepInfo === null || stepInfo === void 0 ? void 0 : stepInfo.widgetData) || {};
            const flowWidget = await components_3.application.createElement(widgetData.name);
            if (flowWidget) {
                flowWidget.id = (0, utils_1.generateUUID)();
                const flowWidgetObj = await flowWidget.handleFlowStage(widgetContainer, stepInfo.stage, Object.assign(Object.assign({}, widgetData.options), { tokenRequirements: widgetData.tokenRequirements, initialSetupData: widgetData.initialSetupData, onNextStep: this.handleNextStep.bind(this), onAddTransactions: this.handleAddTransactions.bind(this) }));
                if (flowWidgetObj) {
                    this.widgetModuleMap.set(step, flowWidgetObj.widget);
                }
                // For Test
                // if (widgetData.name === 'scom-token-acquisition') {
                //   flowWidgetObj.widget.onUpdateStatus();
                // }
            }
        }
        isStepSelectable(index) {
            return index <= this.state.furthestStepIndex;
        }
        async onSelectedStep(index) {
            if (index > this.state.furthestStepIndex && !this.state.checkStep())
                return;
            this.activeStep = index;
            const targetWidget = this.widgetModuleMap.get(index);
            const stepInfo = this.steps[index];
            this.pnlTransactions.visible = stepInfo.stage !== 'initialSetup';
            if (!targetWidget) {
                await this.renderEmbedElm(index);
            }
            if (this.onChanged)
                this.onChanged(this, this.activeStep);
        }
        updateStatus(index, value) {
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
                        return this._data;
                    },
                    setData: async (data) => {
                        await this.setData(data);
                    }
                }
            ];
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
                if ((widgets === null || widgets === void 0 ? void 0 : widgets.length) > 0) {
                    await this.setData({ description, img, option, widgets, activeStep });
                }
            }
            const themeVar = document.body.style.getPropertyValue('--theme');
            this.setThemeVar(themeVar);
        }
        setThemeVar(theme) {
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
        render() {
            return (this.$render("i-panel", { class: index_css_1.customStyles },
                this.$render("i-grid-layout", { templateColumns: ['3fr 4fr'], gap: { row: '1rem', column: '2rem' }, mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: {
                                templateColumns: ['auto']
                            }
                        }
                    ] },
                    this.$render("i-panel", null,
                        this.$render("i-vstack", { border: { style: 'none' }, class: "shadow" },
                            this.$render("i-hstack", { verticalAlignment: "center", border: { bottom: { width: '1px', style: 'solid', color: 'hsla(0, 0%, var(--card-color-l), 0.03)' } }, padding: { left: '1rem', right: '1rem', top: '1rem', bottom: '1rem' }, background: { color: Theme.action.hover }, gap: '1rem' },
                                this.$render("i-panel", { minWidth: 50 },
                                    this.$render("i-image", { id: "flowImg", url: asset_1.default.scom, width: 50, height: 50, display: "block" })),
                                this.$render("i-label", { id: "lbDesc", caption: '', lineHeight: 1.5 })),
                            this.$render("i-vstack", { padding: { left: '0.5rem', right: '0.5rem', top: '0.5rem', bottom: '0.5rem' }, id: "pnlStep", gap: "0.5rem" }))),
                    this.$render("i-vstack", { border: { style: 'none' }, maxWidth: '100%', overflow: 'hidden', class: "shadow" },
                        this.$render("i-vstack", { id: "pnlLoading", stack: { grow: '1' }, horizontalAlignment: "center", verticalAlignment: "center", padding: { top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }, visible: false },
                            this.$render("i-panel", { class: index_css_1.spinnerStyle })),
                        this.$render("i-vstack", { id: "pnlEmbed", width: "100%" }),
                        this.$render("i-vstack", { id: "pnlTransactions", visible: false, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' } },
                            this.$render("i-scom-accordion", { id: "transAccordion" }))))));
        }
    };
    ScomFlow = __decorate([
        (0, components_3.customElements)('i-scom-flow')
    ], ScomFlow);
    exports.default = ScomFlow;
});
