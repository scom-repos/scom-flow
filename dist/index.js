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
            },
            '.step.--active .step-label': {
                color: `${Theme.text.primary} !important`
            },
            '.step.--active .step-label-container > .step-label': {
                fontWeight: 600
            },
            '.custom-border': {
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
define("@scom/scom-flow", ["require", "exports", "@ijstech/components", "@scom/scom-flow/index.css.ts", "@scom/scom-flow/asset.ts"], function (require, exports, components_3, index_css_1, asset_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_3.Styles.Theme.ThemeVars;
    let ScomFlow = class ScomFlow extends components_3.Module {
        constructor(parent, options) {
            super(parent, options);
            this.stepElms = [];
            this.widgetContainers = new Map();
            this.widgets = new Map();
            this._steps = [];
            this._option = 'manual';
            this._activeStep = 0;
            this._img = '';
            this._description = '';
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get description() {
            return this._description;
        }
        set description(value) {
            this._description = value;
            if (this.lbDesc)
                this.lbDesc.caption = value;
        }
        get img() {
            return this._img;
        }
        set img(value) {
            this._img = value;
            if (value && this.flowImg)
                this.flowImg.url = value;
        }
        get steps() {
            var _a;
            return (_a = this._steps) !== null && _a !== void 0 ? _a : [];
        }
        set steps(value) {
            this._steps = value !== null && value !== void 0 ? value : [];
            this.renderSteps();
        }
        get option() {
            var _a;
            return (_a = this._option) !== null && _a !== void 0 ? _a : 'manual';
        }
        set option(value) {
            this._option = value;
            this.renderOption();
        }
        get activeStep() {
            return this._activeStep;
        }
        set activeStep(step) {
            var _a, _b;
            if (this._activeStep === step)
                return;
            if ((_a = this.stepElms) === null || _a === void 0 ? void 0 : _a.length) {
                const activeStep = this.stepElms[this._activeStep];
                const targetStep = this.stepElms[step];
                if (activeStep)
                    activeStep.classList.remove('--active');
                if (targetStep)
                    targetStep.classList.add('--active');
            }
            if ((_b = this.widgetContainers) === null || _b === void 0 ? void 0 : _b.size) {
                const activeWidgetContainer = this.widgetContainers.get(this._activeStep);
                const targetWidgetContainer = this.widgetContainers.get(step);
                if (activeWidgetContainer)
                    activeWidgetContainer.visible = false;
                if (targetWidgetContainer)
                    targetWidgetContainer.visible = true;
            }
            this._activeStep = step;
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
                this.widgetContainers.set(i, contentPanel);
            }
            await this.renderEmbedElm(this.activeStep);
        }
        resetData() {
            this.widgetContainers = new Map();
            this.widgets = new Map();
            this.stepElms = [];
            this.pnlStep.clearInnerHTML();
            this.pnlEmbed.clearInnerHTML();
        }
        async renderEmbedElm(step) {
            var _a, _b, _c, _d;
            const widgetContainer = this.widgetContainers.get(step);
            if (!widgetContainer)
                return;
            widgetContainer.clearInnerHTML();
            widgetContainer.visible = true;
            const embedData = ((_a = this.steps[step]) === null || _a === void 0 ? void 0 : _a.embedData) || {};
            const widget = await components_3.application.createElement(((_b = embedData === null || embedData === void 0 ? void 0 : embedData.module) === null || _b === void 0 ? void 0 : _b.path) || '');
            this.widgets.set(step, widget);
            widgetContainer.appendChild(widget);
            await widget.ready();
            let properties = embedData.properties;
            let tag = embedData.tag;
            if (widget === null || widget === void 0 ? void 0 : widget.getConfigurators) {
                this.embeddersConfigurator = widget.getConfigurators().find((configurator) => configurator.target === "Embedders");
                ((_c = this.embeddersConfigurator) === null || _c === void 0 ? void 0 : _c.setData) && await this.embeddersConfigurator.setData(properties);
                if (tag && ((_d = this.embeddersConfigurator) === null || _d === void 0 ? void 0 : _d.setTag)) {
                    await this.embeddersConfigurator.setTag(tag);
                }
            }
        }
        async onSelectedStep(index) {
            this.activeStep = index;
            const targetWidget = this.widgets.get(index);
            if (!targetWidget) {
                await this.renderEmbedElm(index);
            }
            if (this.onChanged)
                this.onChanged(this, this.activeStep);
        }
        init() {
            super.init();
            this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
            const description = this.getAttribute('description', true);
            if (description)
                this.description = description;
            const img = this.getAttribute('img', true);
            if (img)
                this.img = img;
            const option = this.getAttribute('option', true);
            if (option)
                this.option = option;
            const steps = this.getAttribute('steps', true);
            if (steps)
                this.steps = steps;
            const themeVar = document.body.style.getPropertyValue('--theme');
            this.setThemeVar(themeVar);
        }
        setThemeVar(theme) {
            this.style.setProperty('--card-color-l', theme === 'light' ? '5%' : '95%');
            this.style.setProperty('--card-color-a', theme === 'light' ? '0.05' : '0.1');
        }
        render() {
            return (this.$render("i-panel", { class: index_css_1.customStyles },
                this.$render("i-grid-layout", { templateColumns: ['repeat(2, 1fr)'], gap: { row: '1rem', column: '2rem' } },
                    this.$render("i-vstack", { border: { style: 'none' }, class: "custom-border" },
                        this.$render("i-hstack", { verticalAlignment: "center", border: { bottom: { width: '1px', style: 'solid', color: 'hsla(0, 0%, var(--card-color-l), 0.03)' } }, padding: { left: '1rem', right: '1rem', top: '1rem', bottom: '1rem' }, background: { color: Theme.action.hover }, gap: '1rem' },
                            this.$render("i-image", { id: "flowImg", url: asset_1.default.scom, width: 50, height: 50, display: "block" }),
                            this.$render("i-label", { id: "lbDesc", caption: '' })),
                        this.$render("i-vstack", { padding: { left: '0.5rem', right: '0.5rem', top: '0.5rem', bottom: '0.5rem' }, id: "pnlStep", gap: "0.5rem" })),
                    this.$render("i-panel", { border: { style: 'none' }, class: "custom-border" },
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
