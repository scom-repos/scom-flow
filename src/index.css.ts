import { Styles } from "@ijstech/components";

const Theme = Styles.Theme.ThemeVars;

export const customStyles = Styles.style({
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
