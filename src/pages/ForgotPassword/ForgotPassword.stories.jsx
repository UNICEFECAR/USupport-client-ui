import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ForgotPassword } from './ForgotPassword';

export default {
    title: 'Client UI/pages/ForgotPassword',
    component: ForgotPassword,
    argTypes: {},
};

const Template = (props) => <Router><ForgotPassword {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
