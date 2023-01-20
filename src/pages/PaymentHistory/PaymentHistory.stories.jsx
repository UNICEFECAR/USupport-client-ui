import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PaymentHistory } from './PaymentHistory';

export default {
    title: 'Client UI/pages/PaymentHistory',
    component: PaymentHistory,
    argTypes: {},
};

const Template = (props) => <Router><PaymentHistory {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
