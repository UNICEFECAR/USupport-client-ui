import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { RegistrationPreview } from './RegistrationPreview';

export default {
    title: 'Client UI/pages/RegistrationPreview',
    component: RegistrationPreview,
    argTypes: {},
};

const Template = (props) => <Router><RegistrationPreview {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
