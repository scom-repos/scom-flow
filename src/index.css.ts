import { Styles } from "@ijstech/components";

const Theme = Styles.Theme.ThemeVars;

export const customStyles = Styles.style({
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
})

const spin = Styles.keyframes({
  "to": {
    "-webkit-transform": "rotate(360deg)"
  }
});

export const spinnerStyle = Styles.style({
  display: "inline-block",
  width: "50px",
  height: "50px",
  border: "3px solid rgba(255,255,255,.3)",
  borderRadius: "50%",
  borderTopColor: Theme.colors.primary.main,
  "animation": `${spin} 1s ease-in-out infinite`,
  "-webkit-animation": `${spin} 1s ease-in-out infinite`
});

export const expandablePanelStyle = Styles.style({
  $nest: {
    'i-panel': {
      border: 'none'
    },
    '#comboEmbedType .icon-btn': {
      opacity: 0.5
    }
  }
})