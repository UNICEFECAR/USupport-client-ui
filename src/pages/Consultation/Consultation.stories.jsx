import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Consultation } from './Consultation';

export default {
    title: 'Provider UI/pages/Consultation',
    component: Consultation,
    argTypes: {},
};

const Template = (props) => <Router><Consultation {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
