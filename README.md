# USupport-client-ui

USupport Client User Interface

# Contribute

## Installation

To clone the source code use:

```
git clone git@github.com:UNICEFECAR/USupport-client-ui.git
```

To install all the dependencies use:

```
npm install
```

The USupport Client UI can be run in one of the 2 following ways:

1. via Storybook package that allows to preview blocks/pages in isolation. For more information about Storybook please see the documentation https://storybook.js.org/docs/react/get-started/introduction.

To run the project via Storybook use the following command:

```
npm run storybook
```

2. via Vite build tool. For more information about Vite please see the documentation https://vitejs.dev/guide/.

To run the project via Vite use the following command:

```
npm run dev
```

## Adding a new block to the USupport Client UI

To create a new block, please use the provided bash script `create-block.bash`. By executing the following command from the root directory of the project:

```
chmod +x create-block.bash
./create-block.bash
```

Then, you will be prompted to provide block name, block description, and whether the block requires locale files.

## Adding a new page to the USupport Client UI

To create a new page, please use the provided bash script `create-page.bash`. By executing the following command from the root directory of the project:

```
chmod +x create-page.bash
./create-page.bash
```

Then, you will be prompted to provide page name, page description, and whether the page requires locale files.
