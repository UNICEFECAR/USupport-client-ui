import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ArticleInformation } from './ArticleInformation';

export default {
    title: 'Website UI/pages/ArticleInformation',
    component: ArticleInformation,
    argTypes: {},
};

const Template = (props) => <Router><ArticleInformation {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
