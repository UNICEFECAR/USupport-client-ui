import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { RegisterSupport } from './RegisterSupport';

export default {
    title: 'Website UI/pages/RegisterSupport',
    component: RegisterSupport,
    argTypes: {},
};

const Template = (props) => <Router><RegisterSupport {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
