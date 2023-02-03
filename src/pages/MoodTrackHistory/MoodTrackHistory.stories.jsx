import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MoodTrackHistory } from './MoodTrackHistory';

export default {
    title: 'Client UI/pages/MoodTrackHistory',
    component: MoodTrackHistory,
    argTypes: {},
};

const Template = (props) => <Router><MoodTrackHistory {...props} /></Router>;

export const Default = Template.bind({});
Default.args = {}; 
