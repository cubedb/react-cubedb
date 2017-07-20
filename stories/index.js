import React from 'react'  // eslint-disable-line no-unused-vars

import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'  // eslint-disable-line no-unused-vars

import TrendingGraph from './TrendingGraph'
import TimeGraph from './TimeGraph'
import BarGraph from './BarGraph'
import BarGraphGroup from './BarGraphGroup'
import CubeDB from './CubeDB'

storiesOf('react-cubedb', module)
  .add('Overview', () => <CubeDB.Overview/>)
  .addDecorator(withKnobs)
  .add('BarGraph', () => <BarGraph/>)
  .add('BarGraphGroup', () => <BarGraphGroup/>)
  //.add('TagGroup', () => <Welcome showApp={linkTo('Button')} />)
  .add('TimeGraph', () => <TimeGraph/>)
  .add('TrendingGraph', () => <TrendingGraph/>)
