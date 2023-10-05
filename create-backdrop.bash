#!/bin/bash

# Clear the screen
clear

# Read the backdrop name from the user input
echo -n "Enter backdrop name (CamelCase): "
read backdrop_name

if [ -z "$backdrop_name" ]; then
    echo "Backdrop name is required"
    exit 1
fi

# Transform the first letter of the backdrop name to uppercase
backdrop_name=$(echo $backdrop_name | tr '[:lower:]' '[:upper:]' | cut -c1)$(echo $backdrop_name | cut -c2-)

# Transform the backdrop name to lowercase
backdrop_name_lower=$(echo $backdrop_name | tr '[:upper:]' '[:lower:]')

# Transform the name to caterpillar-case
backdrop_name_kebab=$(echo $backdrop_name | sed -r 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]')

# Create the description of the backdrop
backdrop_description="The $backdrop_name backdrop"

# Read if the backdrop requires locale files
echo -n "Does the backdrop require locale files? (y/n): "
read backdrop_locale

if [ -z "$backdrop_locale" ]; then
    echo "Backdrop locale is required"
    exit 1
fi

# Check whether the backdrop_locale is y or n
if [ "$backdrop_locale" != "y" ] && [ "$backdrop_locale" != "n" ]; then
    echo "Backdrop locale must be y or n"
    exit 1
fi

# Check if the backdrop directory already exists
if [ -d "src/backdrops/$backdrop_name" ]; then
    echo "Backdrop already exists. Please choose a different backdrop name."
    exit 1
fi

# Create the backdrop directory
mkdir "src/backdrops/$backdrop_name"

# Create the backdrop files
touch "src/backdrops/$backdrop_name/index.js"
touch "src/backdrops/$backdrop_name/$backdrop_name.jsx"
touch "src/backdrops/$backdrop_name/$backdrop_name_kebab.scss"

# Add the backdrop to the backdrop index file
echo "export * from './$backdrop_name.jsx';" >> "src/backdrops/$backdrop_name/index.js"

# Add the backdrop to the backdrop group index file
echo "export * from './$backdrop_name';" >> "src/backdrops/index.js"

# Create the locale file if backdrop_locales is y
if [ "$backdrop_locale" == "y" ]; then
    mkdir "src/backdrops/$backdrop_name/locales"

    touch "src/backdrops/$backdrop_name/locales/en.json"
    echo "{}" >> "src/backdrops/$backdrop_name/locales/en.json"

    touch "src/backdrops/$backdrop_name/locales.js"
    echo "export * as en from './locales/en.json';" >> "src/backdrops/$backdrop_name/locales.js"

    echo "export * as $backdrop_name from './$backdrop_name/locales.js';" >> "src/backdrops/locales.js"
fi

# Add the backdrop to the main backdrop file
echo "import React from 'react';
import { Backdrop } from '@USupport-components-library/src';

import './$backdrop_name_kebab.scss';

/**
 * $backdrop_name
 *
 * $backdrop_description
 *
 * @return {jsx}
 */
export const $backdrop_name = ({ isOpen, onClose }) => {
  return (
    <Backdrop
      classes='$backdrop_name_kebab'
      title='$backdrop_name'
      isOpen={isOpen}
      onClose={onClose}
    ></Backdrop>
  );
};" >> "src/backdrops/$backdrop_name/$backdrop_name.jsx"

# Add the theme to the backdrop styles file
echo "@import '@USupport-components-library/styles';

.$backdrop_name_kebab{
}" >> "src/backdrops/$backdrop_name/$backdrop_name_kebab.scss"

# Output to the user's console
echo "Successfully created $backdrop_name into src/backdrops/$backdrop_name"