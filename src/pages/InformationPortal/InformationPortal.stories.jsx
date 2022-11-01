import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { InformationPortal } from './InformationPortal';

export default {
    title: 'Website UI/pages/InformationPortal',
    component: InformationPortal,
    argTypes: {},
};

const Template = (props) => <Router><InformationPortal {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
