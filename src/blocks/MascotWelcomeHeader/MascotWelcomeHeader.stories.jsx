import React from 'react';

import { MascotWelcomeHeader } from './MascotWelcomeHeader';

export default {
  title: 'Client UI/blocks/MascotWelcomeHeader',
  component: MascotWelcomeHeader,
  argTypes: {},
};

const Template = (props) => <MascotWelcomeHeader {...props} />;

export const Default = Template.bind({});
Default.args = {};
