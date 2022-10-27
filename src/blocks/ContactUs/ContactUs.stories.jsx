import React from 'react';

import { ContactUs } from './ContactUs';

export default {
  title: 'Website UI/blocks/ContactUs',
  component: ContactUs,
  argTypes: {},
};

const Template = (props) => <ContactUs {...props} />;

export const Default = Template.bind({});
Default.args = {};
