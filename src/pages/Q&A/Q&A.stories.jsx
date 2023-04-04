import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Q&A } from './Q&A';

export default {
    title: 'Client UI/pages/Q&A',
    component: Q&A,
    argTypes: {},
};

const Template = (props) => <Router><Q&A {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
