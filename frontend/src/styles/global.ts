import { globalCss } from ".";

export const globalStyles = globalCss({
  '*': {
    margin:0,
    padding: 0,
    boxSizing: 'border-box',
  },
  body:{
    '-webkit-font-smoothing': 'antialiased',
    backgroundColor: '#023047',
    backgroundImage: 'linear-gradient(325deg, #388C9E -16.83%, #388C9E 21.27%, #5B4EF2 105.2%);',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    height: '100vh',
    width: '100vw',
  },
  'body, input, textarea, button': {
    fontFamily: '$baloo2!important',
    fontWeight: 400
  }
})
