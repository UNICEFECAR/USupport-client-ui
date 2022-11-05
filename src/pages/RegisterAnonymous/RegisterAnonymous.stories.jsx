import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { RegisterAnonymous } from './RegisterAnonymous';

export default {
    title: 'Client UI/pages/RegisterAnonymous',
    component: RegisterAnonymous,
    argTypes: {},
};

const Template = (props) => <Router><RegisterAnonymous {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
