import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SharePlatform } from './SharePlatform';

export default {
    title: 'Client UI/pages/SharePlatform',
    component: SharePlatform,
    argTypes: {},
};

const Template = (props) => <Router><SharePlatform {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
