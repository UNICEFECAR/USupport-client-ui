import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserDetails } from './UserDetails';

export default {
    title: 'Client UI/pages/UserDetails',
    component: UserDetails,
    argTypes: {},
};

const Template = (props) => <Router><UserDetails {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
