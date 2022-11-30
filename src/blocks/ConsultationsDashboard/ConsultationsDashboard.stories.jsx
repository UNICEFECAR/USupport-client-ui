import React from 'react';

import { ConsultationsDashboard } from './ConsultationsDashboard';

export default {
  title: 'Client UI/blocks/ConsultationsDashboard',
  component: ConsultationsDashboard,
  argTypes: {},
};

const Template = (props) => <ConsultationsDashboard {...props} />;

export const Default = Template.bind({});
Default.args = {};
