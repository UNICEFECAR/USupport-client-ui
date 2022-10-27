const path = require("path");
const { mergeConfig } = require("vite");

module.exports = {
  stories: [
    "../src/*.stories.@(js|jsx|ts|tsx)",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  refs: {
    "design-system": {
      title: "Design System",
      url: "https://main--6330c25ad58d101679aa001f.chromatic.com",
    },
  },
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-viewport",
    "storybook-addon-breakpoints",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
  features: {
    storyStoreV7: true,
  },
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@USupport-components-library": path.resolve(
            path.dirname(__dirname),
            "./USupport-components-library"
          ),
          "#blocks": path.resolve(__dirname, "../src/blocks"),
          "#pages": path.resolve(__dirname, "../src/pages"),
          "#services": path.resolve(__dirname, "../src/services"),
        },
      },
    });
  },
};
