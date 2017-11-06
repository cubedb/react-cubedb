import React from 'react'  // eslint-disable-line no-unused-vars
import * as d3 from 'd3'
import { TimeGraph } from '../src'

import { action } from '@storybook/addon-actions'

const mock = require('./_mock.json')
const display = d3.timeFormat('%a %Y-%m-%d %H:00')
const formatter = d3.timeFormat('%Y-%m-%d %H')

export default () =>
  <div>
    <h2>Trending Graph</h2>
    <section>
      <h3>Bar Graph:</h3>
      <TimeGraph
        type="bar"
        aggregation='hour'
        data={mock.response.p}
        timeFormatter={formatter}
        timeDisplay={display}
        getColor={() => 'blue'}
        allowComparing={true}
        onChange={action('change')}
        onClickCompare={action('click-to-compare')}
      />
    </section>
    <section>
      <h3>Line Graph:</h3>
      <TimeGraph
        type="line"
        aggregation='day'
        data={mock.response.p}
        timeFormatter={formatter}
        timeDisplay={display}
        getColor={() => 'blue'}
      />
    </section>
    <section>
      <h3>Area Graph:</h3>
      <TimeGraph
        type="area"
        aggregation='hour'
        data={mock.response.p}
        timeFormatter={formatter}
        timeDisplay={display}
        getColor={() => 'blue'}
      />
    </section>
  </div>
