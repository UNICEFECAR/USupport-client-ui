const customViewports = {
  sm: {
    name: 'Small',
    styles: {
      width: '375px',
      height: '963px',
    },
  },
  md: {
    name: 'Medium',
    styles: {
      width: '768px',
      height: '801px',
    },
  },
  lg: {
    name: 'Large',
    styles: {
      width: '1366px',
      height: '801px',
    },
  },
  xl: {
    name: 'Extra Large',
    styles: {
      width: '1600px',
      height: '801px',
    },
  },
};

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: { viewports: customViewports },
  breakpoints: {
    breakpointNames: {
      'sm': '375',
      'md': '768',
      'lg': '1366',
      'xl': '1600'
    }
  },
}