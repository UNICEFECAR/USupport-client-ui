import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ContactUs } from './ContactUs';

export default {
    title: 'Website UI/pages/ContactUs',
    component: ContactUs,
    argTypes: {},
};

const Template = (props) => <Router><ContactUs {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
