import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MoodTracker } from './MoodTracker';

export default {
    title: 'Client UI/pages/MoodTracker',
    component: MoodTracker,
    argTypes: {},
};

const Template = (props) => <Router><MoodTracker {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
