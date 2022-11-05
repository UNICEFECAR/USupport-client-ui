import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProfile } from './UserProfile';

export default {
    title: 'Client UI/pages/UserProfile',
    component: UserProfile,
    argTypes: {},
};

const Template = (props) => <Router><UserProfile {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
