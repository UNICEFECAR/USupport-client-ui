import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PlatformRating } from './PlatformRating';

export default {
    title: 'Client UI/pages/PlatformRating',
    component: PlatformRating,
    argTypes: {},
};

const Template = (props) => <Router><PlatformRating {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
