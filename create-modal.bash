#!/bin/bash

# Clear the screen
clear

# Read the modal name from the user input
echo -n "Enter modal name (CamelCase): "
read modal_name

if [ -z "$modal_name" ]; then
    echo "Modal name is required"
    exit 1
fi

# Transform the first letter of the modal name to uppercase
modal_name=$(echo $modal_name | tr '[:lower:]' '[:upper:]' | cut -c1)$(echo $modal_name | cut -c2-)

# Transform the modal name to lowercase
modal_name_lower=$(echo $modal_name | tr '[:upper:]' '[:lower:]')

# Transform the name to caterpillar-case
modal_name_kebab=$(echo $modal_name | sed -r 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]')

# Create the description of the modal
modal_description="The $modal_name modal"

# Read if the modal requires locale files
echo -n "Does the modal require locale files? (y/n): "
read modal_locale

if [ -z "$modal_locale" ]; then
    echo "Modal locale is required"
    exit 1
fi

# Check whether the modal_locale is y or n
if [ "$modal_locale" != "y" ] && [ "$modal_locale" != "n" ]; then
    echo "Modal locale must be y or n"
    exit 1
fi

# Check if the modal directory already exists
if [ -d "src/modals/$modal_name" ]; then
    echo "Modal already exists. Please choose a different modal name."
    exit 1
fi

# Create the modal directory
mkdir "src/modals/$modal_name"

# Create the modal files
touch "src/modals/$modal_name/index.js"
touch "src/modals/$modal_name/$modal_name.jsx"
touch "src/modals/$modal_name/$modal_name_kebab.scss"

# Add the modal to the modal index file
echo "export * from './$modal_name.jsx';" >> "src/modals/$modal_name/index.js"

# Add the modal to the modal group index file
echo "export * from './$modal_name';" >> "src/modals/index.js"

# Create the locale file if modal_locales is y
if [ "$modal_locale" == "y" ]; then
    mkdir "src/modals/$modal_name/locales"

    touch "src/modals/$modal_name/locales/en.json"
    echo "{}" >> "src/modals/$modal_name/locales/en.json"

    touch "src/modals/$modal_name/locales.js"
    echo "export * as en from './locales/en.json';" >> "src/modals/$modal_name/locales.js"

    echo "export * as $modal_name from './$modal_name/locales.js';" >> "src/modals/locales.js"
fi

# Add the modal to the main modal file
echo "import React from 'react';
import { Modal } from '@USupport-components-library/src';

import './$modal_name_kebab.scss';

/**
 * $modal_name
 *
 * $modal_description
 *
 * @return {jsx}
 */
export const $modal_name = ({ isOpen, onClose }) => {
  return (
    <Modal
      classes='$modal_name_kebab'
      heading='$modal_name'
      isOpen={isOpen}
      closeModal={onClose}
    ></Modal>
  );
};" >> "src/modals/$modal_name/$modal_name.jsx"

# Add the theme to the modal styles file
echo "@import '@USupport-components-library/styles';

.$modal_name_kebab{
}" >> "src/modals/$modal_name/$modal_name_kebab.scss"

# Output to the user's console
echo "Successfully created $modal_name into src/modals/$modal_name"