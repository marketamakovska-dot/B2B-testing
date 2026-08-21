import { createTheme } from '@mui/material/styles'

// Design tokens pulled from the Figma file (B2B ordering / MVP section)
export const tokens = {
  sidebarBg: '#2b2955',
  sidebarTextMuted: '#afb1b6',
  sidebarTextActive: '#1e1e1e',
  sidebarActiveBg: '#e6e5e7',
  textPrimary: '#1a1633',
  textSecondary: '#434168',
  formOutline: '#e8e8eb',
  black: '#000000',
  badge: '#2d8181',
  successBg: '#dbffe8',
  neutralLight: '#aaaaaa',
  background: '#f7f7fd',
  panelBg: '#f1f1f1',
}

const theme = createTheme({
  palette: {
    primary: { main: '#000000', contrastText: '#ffffff' },
    secondary: { main: tokens.badge },
    text: { primary: tokens.textPrimary, secondary: tokens.textSecondary },
    background: { default: '#ffffff' },
  },
  typography: {
    fontFamily: '"Roboto", "Plus Jakarta Sans", "Work Sans", sans-serif',
    h1: { fontFamily: '"Roboto", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 32, lineHeight: 1.3 },
    h5: { fontFamily: '"Work Sans", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Roboto", sans-serif', fontWeight: 700, fontSize: 20, lineHeight: 1.4 },
    button: { textTransform: 'none', fontWeight: 400 },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiButton: {
      styleOverrides: {
        // Sized per the Figma spec (compact controls, not the oversized
        // ~48px-tall buttons the old flat `root` padding produced on every
        // button regardless of its `size` prop — that's what made filter/
        // action rows overflow onto a second line instead of fitting on one
        // like the Figma layout).
        root: { borderRadius: 0 },
        outlined: { borderColor: '#000', color: '#000' },
        sizeLarge: { padding: '10px 24px', fontSize: 16 },
        sizeMedium: { padding: '7px 18px', fontSize: 14 },
        sizeSmall: { padding: '4px 12px', fontSize: 13 },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
    },
    MuiSelect: {
      defaultProps: { size: 'small' },
    },
  },
})

export default theme
