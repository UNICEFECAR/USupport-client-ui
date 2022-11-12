import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ResetPassword } from './ResetPassword';

export default {
    title: 'Client UI/pages/ResetPassword',
    component: ResetPassword,
    argTypes: {},
};

const Template = (props) => <Router><ResetPassword {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
