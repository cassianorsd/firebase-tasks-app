import { createStitches } from '@stitches/react'
import { colors } from './colors'
import { fontSizes } from './font-sizes'
import { fonts } from './fonts'

export const {
  config,
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme
} = createStitches({
  theme: {
    colors,
    fontSizes,
    fonts
  }
})