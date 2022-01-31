import { theme as rimbleTheme } from 'rimble-ui'

export enum Color {
  primary = '#0179ef',
  primaryDark = '#0966c1',
  primaryLight = '#ddeeff',
  primaryAlpha03 = 'rgba(1, 121, 239, 0.03)',
  successLight2 = '#6FCF97',
  success = '#27AE60',
  successDark = '#219653',
  successLight = '#E8FAF0',
  warning = '#F2994A',
  warningDark = '#D46400',
  warningLight = '#FFF7DF',
  danger = '#EB5757',
  dangerDark = '#E40101',
  dangerLight = '#FFECEC',
  black = '#262626',
  nearBlack = '#4d4d4d',
  grey = '#9FA3BC',
  greyDark = '#2A3F60',
  greyLight = '#D3D5E5',
  background = '#F0F3F7',
  textRare = '#009FD2',
  border = '#E9EAF2',
  offWhite = '#F0F4FA',
}

export enum RewardsColor {
  Base = '#E9EAF5',
  Silver = '#E4F1F7',
  BaseDark = '#9FA3BC',
  SilverDark = '#8DB3C4',
  Gold = '#EBD08D',
  Platinum = '#A1E4E6',
}

const theme = {
  ...rimbleTheme,
  fontWeights: [0, 300, 400, 500, 600, 700],
  lineHeights: {
    solid: 1,
    title: 1.25,
    copy: 1.5,
    button: 3,
  },
  colors: {
    ...rimbleTheme.colors,
    primary: Color.primary,
    'primary-dark': Color.primaryDark,
    'primary-light': Color.primaryLight,
    success: Color.success,
    'success-dark': Color.successDark,
    'success-light': Color.successLight,
    warning: Color.warning,
    'warning-dark': Color.warningDark,
    'warning-light': Color.warningLight,
    danger: Color.danger,
    'danger-dark': Color.dangerDark,
    'danger-light': Color.dangerLight,
    black: Color.black,
    'near-black': Color.nearBlack,
    grey: Color.grey,
    'light-gray': Color.greyLight,
    'dark-gray': Color.greyDark,
    background: Color.background,
    text: Color.black,
    'text-light': Color.nearBlack,
    'navy-dark': Color.greyDark,
    'text-rare': Color.textRare,
    'primary-alpha-03': Color.primaryAlpha03,
    border: Color.border,
    'off-white': Color.offWhite,
  },
  buttonSizes: {
    ...rimbleTheme.buttonSizes,
    medium: {
      fontSize: '1rem',
      height: '2.5rem',
    },
  },
  buttons: {
    ...rimbleTheme.buttons,
    plain: {
      padding: 0,
      height: 'fit-content',
      minWidth: 'fit-content',
      boxShadow: 'none',
      '--main-color': 'transparent',
      '--contrast-color': Color.grey,
      '&:hover': {
        color: Color.primary,
        boxShadow: 'none !important',
        background: 'transparent !important',
        '--main-color': 'transparent',
        '--contrast-color': Color.primary,
      },
      '&:active': {
        color: Color.primary,
        boxShadow: 'none !important',
        background: 'transparent !important',
        '--main-color': 'transparent',
        '--contrast-color': Color.primary,
      },
    },
  },
  messageStyle: {
    ...rimbleTheme.messageStyle,
    success: {
      color: Color.successDark,
      backgroundColor: Color.successLight,
      borderColor: Color.successDark,
    },
    warning: {
      color: Color.warningDark,
      backgroundColor: Color.warningLight,
      borderColor: Color.warningDark,
    },
    danger: {
      color: Color.dangerDark,
      backgroundColor: Color.dangerLight,
      borderColor: Color.dangerDark,
    },
  },
  shadows: [
    ...rimbleTheme.shadows,
    '0px 2px 2px rgba(152, 162, 179, 0.15), 0px 12px 24px rgba(152, 162, 179, 0.15)',
  ],
  zIndices: [...rimbleTheme.zIndices, 99999],
  palette: {
    primary: {
      main: Color.primary,
      light: Color.primaryLight,
      dark: Color.primaryDark,
      contrastText: '#fff',
    },
    text: {
      primary: Color.primary,
      secondary: Color.grey,
      disabled: Color.greyLight,
      hint: Color.greyLight,
    },
  },
}

export const zendeskStyle = {
  color: {
    theme: '#2b79ef',
    launcherText: '#ffffff',
    button: '#2b79ef',
    header: '#2b79ef',
  },
}

export default theme
