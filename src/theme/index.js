import { createMuiTheme, responsiveFontSizes } from '@material-ui/core';
import { light, dark } from './palette';

const getTheme = mode => responsiveFontSizes(
  createMuiTheme({
    palette: mode === 'light' ? light : dark,
    layout: {
      contentWidth: 1236,
    },
    typography: {
      fontFamily: 'Lato',
    },
    zIndex: {
      appBar: 1200,
      drawer: 1100,
    },
  }),
);

export default getTheme;
