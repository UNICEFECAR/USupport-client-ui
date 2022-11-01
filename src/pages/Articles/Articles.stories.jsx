import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Articles } from './Articles';

export default {
    title: 'Website UI/pages/Articles',
    component: Articles,
    argTypes: {},
};

const Template = (props) => <Router><Articles {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
