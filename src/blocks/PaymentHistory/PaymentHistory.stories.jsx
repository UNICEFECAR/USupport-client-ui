import React from 'react';

import { PaymentHistory } from './PaymentHistory';

export default {
  title: 'Client UI/blocks/PaymentHistory',
  component: PaymentHistory,
  argTypes: {},
};

const Template = (props) => <PaymentHistory {...props} />;

export const Default = Template.bind({});
Default.args = {};
