import React from 'react';

import { CheckoutForm } from './CheckoutForm';

export default {
  title: 'Client UI/blocks/CheckoutForm',
  component: CheckoutForm,
  argTypes: {},
};

const Template = (props) => <CheckoutForm {...props} />;

export const Default = Template.bind({});
Default.args = {};
