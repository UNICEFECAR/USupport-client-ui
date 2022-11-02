import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ProviderOverview } from './ProviderOverview';

export default {
    title: 'Client UI/pages/ProviderOverview',
    component: ProviderOverview,
    argTypes: {},
};

const Template = (props) => <Router><ProviderOverview {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
