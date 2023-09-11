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
    exports.spinnerStyle = exports.customStyles = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    exports.customStyles = components_1.Styles.style({
        $nest: {
            '.step': {
                userSelect: 'none',
                cursor: 'pointer'
            },
            '.step.--active .step-icon': {
                background: Theme.colors.primary.main,
                transition: 'all .3s ease-in'
            },
            '.step.--active .step-label': {
                color: `${Theme.text.primary} !important`,
                transition: 'all .3s ease-in'
            },
            '.step.--active .step-label-container > .step-label': {
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
define("@scom/scom-flow", ["require", "exports", "@ijstech/components", "@scom/scom-flow/index.css.ts", "@scom/scom-flow/asset.ts", "@scom/scom-flow/store/index.ts", "@scom/scom-flow/utils/index.ts"], function (require, exports, components_3, index_css_1, asset_1, index_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_3.Styles.Theme.ThemeVars;
    let ScomFlow = class ScomFlow extends components_3.Module {
        constructor(parent, options) {
            super(parent, options);
            this.stepElms = [];
            this.widgetContainerMap = new Map();
            this.widgetModuleMap = new Map();
            this.steps = [];
            this._data = {
                activeStep: 0
            };
            this.$eventBus = components_3.application.EventBus;
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
        // get steps() {
        //   return this._data.steps ?? [];
        // }
        // set steps(value: IStep[]) {
        //   this._data.steps = value ?? [];
        //   this.state.steps = this.steps;
        // }
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
                        stage: 'tokenRequirements',
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
                        stage: '',
                        widgetData: {
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
                const item = (this.$render("i-hstack", { verticalAlignment: "center", horizontalAlignment: "space-between", gap: '1rem', padding: { left: '1rem', right: '1.5rem', top: '1rem', bottom: '1rem' }, class: 'step' + (i === this.activeStep ? ' --active' : ''), background: { color: Theme.action.hover }, onClick: () => this.onSelectedStep(i) },
                    this.$render("i-vstack", { gap: '1rem' },
                        this.$render("i-panel", null,
                            this.$render("i-label", { caption: `${i + 1}`, padding: { left: '1rem', right: '1rem', top: '0.25rem', bottom: '0.25rem' }, border: { radius: 20 }, font: { color: '#fff' }, background: { color: (_a = step.color) !== null && _a !== void 0 ? _a : Theme.colors.primary.light }, class: "step-icon" })),
                        this.$render("i-label", { caption: (_b = step.name) !== null && _b !== void 0 ? _b : '', class: "step-label" })),
                    this.$render("i-panel", null,
                        this.$render("i-image", { url: step.image || asset_1.default.scom, width: 50, display: "flex" }))));
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
            this.pnlStep.clearInnerHTML();
            this.pnlEmbed.clearInnerHTML();
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
                const flowWidgetObj = await flowWidget.handleFlowStage(widgetContainer, stepInfo.stage, Object.assign(Object.assign({}, widgetData.options), { invokerId: this.id, tokenRequirements: widgetData.tokenRequirements }));
                if (flowWidgetObj) {
                    this.widgetModuleMap.set(step, flowWidgetObj.widget);
                }
                // For Test
                // if (widgetData.name === 'scom-token-acquisition') {
                //   flowWidgetObj.widget.onUpdateStatus();
                // }
            }
        }
        async onSelectedStep(index) {
            if (index > this.state.furthestStepIndex && !this.state.checkStep())
                return;
            this.activeStep = index;
            const targetWidget = this.widgetModuleMap.get(index);
            if (!targetWidget) {
                await this.renderEmbedElm(index);
            }
            if (this.onChanged)
                this.onChanged(this, this.activeStep);
        }
        updateStatus(index, value) {
            this.state.setCompleted(index, value);
        }
        async init() {
            super.init();
            this.id = (0, utils_1.generateUUID)();
            this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
            const description = this.getAttribute('description', true, '');
            const activeStep = this.getAttribute('activeStep', true, 0);
            const img = this.getAttribute('img', true, '');
            const option = this.getAttribute('option', true, 'manual');
            const widgets = this.getAttribute('widgets', true, []);
            await this.setData({ description, img, option, widgets, activeStep });
            const themeVar = document.body.style.getPropertyValue('--theme');
            this.setThemeVar(themeVar);
            this.$eventBus.register(this, `${this.id}:nextStep`, async (data) => {
                console.log('nextStep', data);
                const nextStep = this.activeStep + 1;
                await this.onSelectedStep(nextStep);
            });
        }
        setThemeVar(theme) {
            this.style.setProperty('--card-color-l', theme === 'light' ? '5%' : '95%');
            this.style.setProperty('--card-color-a', theme === 'light' ? '0.05' : '0.1');
        }
        render() {
            return (this.$render("i-panel", { class: index_css_1.customStyles },
                this.$render("i-grid-layout", { templateColumns: ['repeat(2, 1fr)'], gap: { row: '1rem', column: '2rem' }, mediaQueries: [
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
                    this.$render("i-panel", { border: { style: 'none' }, maxWidth: '100%', overflow: 'hidden', class: "shadow" },
                        this.$render("i-vstack", { id: "pnlLoading", stack: { grow: '1' }, horizontalAlignment: "center", verticalAlignment: "center", padding: { top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }, visible: false },
                            this.$render("i-panel", { class: index_css_1.spinnerStyle })),
                        this.$render("i-vstack", { id: "pnlEmbed", width: "100%" })))));
        }
    };
    ScomFlow = __decorate([
        (0, components_3.customElements)('i-scom-flow')
    ], ScomFlow);
    exports.default = ScomFlow;
});
