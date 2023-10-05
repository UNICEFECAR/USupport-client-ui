#!/bin/bash

# Clear the screen
clear

# Read the page name from the user input
echo -n "Enter page name (CamelCase): "
read page_name

if [ -z "$page_name" ]; then
    echo "Page name is required"
    exit 1
fi

# Transform the first letter of the page name to uppercase
page_name=$(echo $page_name | tr '[:lower:]' '[:upper:]' | cut -c1)$(echo $page_name | cut -c2-)

# Transform the page name to lowercase
page_name_lower=$(echo $page_name | tr '[:upper:]' '[:lower:]')

# Transform the name to caterpillar-case
page_name_kebab=$(echo $page_name | sed -r 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]')

# Read the description of the page from the user input
echo -n "Enter page description: "
read page_description

if [ -z "$page_description" ]; then
    echo "Page description is required"
    exit 1
fi

# Read if the page requires locale files
echo -n "Does the page require locale files? (y/n): "
read page_locale

if [ -z "$page_locale" ]; then
    echo "Page locale is required"
    exit 1
fi

# Check whether the page_locale is y or n
if [ "$page_locale" != "y" ] && [ "$page_locale" != "n" ]; then
    echo "Page locale must be y or n"
    exit 1
fi

# Check if the page directory already exists
if [ -d "src/pages/$page_name" ]; then
    echo "Page already exists. Please choose a different page name."
    exit 1
fi

# Create the page directory
mkdir "src/pages/$page_name"

# Create the page files
touch "src/pages/$page_name/index.js"
touch "src/pages/$page_name/$page_name.jsx"
touch "src/pages/$page_name/$page_name_kebab.scss"

# Add the page to the page index file
echo "export * from './$page_name.jsx';" >> "src/pages/$page_name/index.js"

# Add the page to the page group index file
echo "export * from './$page_name';" >> "src/pages/index.js"

# Create the page locale files if page_locale is y
if [ "$page_locale" == "y" ]; then
    mkdir "src/pages/$page_name/locales"

    touch "src/pages/$page_name/locales/en.json"
    echo "{}" >> "src/pages/$page_name/locales/en.json"

    touch "src/pages/$page_name/locales.js"
    echo "export * as en from './locales/en.json';" >> "src/pages/$page_name/locales.js"

    echo "export * as $page_name from './$page_name/locales.js';" >> "src/pages/locales.js"
fi

# Add the page to the main page file
echo "import React from 'react';
import { Page } from '#blocks';

import './$page_name_kebab.scss';

/**
 * $page_name
 *
 * $page_description
 *
 * @returns {JSX.Element}
 */
export const $page_name = () => {
    return (
        <Page classes='page__$page_name_kebab'>
            $page_name Page
        </Page>
    );
}; " >> "src/pages/$page_name/$page_name.jsx"

# Add the theme to the page styles file 
echo "/* $page_name styles */
@import '@USupport-components-library/styles';

.page__$page_name_kebab{
}
" >> "src/pages/$page_name/$page_name_kebab.scss"

# Outout to the user's console 
echo "Successfully created $page_name into src/blocks/$page_name"