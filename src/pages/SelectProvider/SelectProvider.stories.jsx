import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SelectProvider } from './SelectProvider';

export default {
    title: 'Client UI/pages/SelectProvider',
    component: SelectProvider,
    argTypes: {},
};

const Template = (props) => <Router><SelectProvider {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
