import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Notifications } from './Notifications';

export default {
    title: 'Client UI/pages/Notifications',
    component: Notifications,
    argTypes: {},
};

const Template = (props) => <Router><Notifications {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
