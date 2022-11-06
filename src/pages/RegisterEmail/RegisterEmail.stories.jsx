import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { RegisterEmail } from './RegisterEmail';

export default {
    title: 'Client UI/pages/RegisterEmail',
    component: RegisterEmail,
    argTypes: {},
};

const Template = (props) => <Router><RegisterEmail {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
