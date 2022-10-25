import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { NotificationPreferences } from './NotificationPreferences';

export default {
    title: 'Website UI/pages/NotificationPreferences',
    component: NotificationPreferences,
    argTypes: {},
};

const Template = (props) => <Router><NotificationPreferences {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
