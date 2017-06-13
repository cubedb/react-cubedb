/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Welcome from './Welcome';
import TrendingGraph from './TrendingGraph';
import BarGraph from './BarGraph';
import CubeDB from './CubeDB';

storiesOf('Cube DB', module)
  .add('overview', () => <CubeDB.Overview/>)
  .add('client package', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('react-cubedb', module)
  .addDecorator(withKnobs)
  .add('BarGraph', () => <BarGraph/>)
  .add('BarGraphGroup', () => <Welcome showApp={linkTo('Button')} />)
  .add('Filters', () => <Welcome showApp={linkTo('Button')} />)
  .add('TimeGraph', () => <Welcome showApp={linkTo('Button')} />)
  .add('TrendingGraph', () => <TrendingGraph/>)

