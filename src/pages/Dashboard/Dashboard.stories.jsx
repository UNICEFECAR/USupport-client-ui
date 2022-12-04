import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Dashboard } from './Dashboard';

export default {
    title: 'Client UI/pages/Dashboard',
    component: Dashboard,
    argTypes: {},
};

const Template = (props) => <Router><Dashboard {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
