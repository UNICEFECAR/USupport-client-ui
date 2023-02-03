import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Checkout } from './Checkout';

export default {
    title: 'Client UI/pages/Checkout',
    component: Checkout,
    argTypes: {},
};

const Template = (props) => <Router><Checkout {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
