import React from 'react'  // eslint-disable-line no-unused-vars

import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'  // eslint-disable-line no-unused-vars

import TrendingGraph from './TrendingGraph'
import BarGraph from './BarGraph'
import BarGraphGroup from './BarGraphGroup'
import CubeDB from './CubeDB'

storiesOf('Cube DB', module)
  .add('overview', () => <CubeDB.Overview/>)
  //.add('client package', () => <Welcome showApp={linkTo('Button')} />)

storiesOf('react-cubedb', module)
  .addDecorator(withKnobs)
  .add('BarGraph', () => <BarGraph/>)
  .add('BarGraphGroup', () => <BarGraphGroup/>)
  //.add('TagGroup', () => <Welcome showApp={linkTo('Button')} />)
  //.add('TimeGraph', () => <Welcome showApp={linkTo('Button')} />)
  .add('TrendingGraph', () => <TrendingGraph/>)
