import React from 'react';
import { Meta, Story } from '@storybook/react';
import { LeafletMap, LeafletMapProps } from '../src/components';

const meta: Meta = {
  title: 'LeafletMap',
  component: LeafletMap,
  // argTypes: {
  //   children: {
  //     control: {
  //       type: 'text',
  //     },
  //   },
  // },
  // parameters: {
  //   controls: { expanded: true },
  // },
};

export default meta;

// const Template: Story<LeafletMapProps> = args => <LeafletMap {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
// export const Default = Template.bind({});
export const Default = () => <LeafletMap center={[51.505, -0.09]} zoom={13}>
  <layer-tileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
</LeafletMap>

// Default.args = {};
