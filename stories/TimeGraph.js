import React from 'react'  // eslint-disable-line no-unused-vars
import * as d3 from 'd3'
import { TimeGraph } from '../src'
import { number } from '@storybook/addon-knobs'

const mock = require('./_mock.json')
const display = d3.timeFormat('%a %Y-%m-%d %H:00')
const formatter = d3.timeFormat('%Y-%m-%d %H')
const parser = d3.timeParse('%Y-%m-%d %H')
const timeUnitLengthSec = 3600

export default () =>
  <div>
    <h2>Trending Graph</h2>
    <section>
      <p>Bar Graph:</p>
      <TimeGraph
        type="bar"
        aggregation='hour'
        data={mock.response.p}
        timeParser={parser}
        timeFormatter={formatter}
        timeDisplay={display}
        timeUnitLengthSec={timeUnitLengthSec}
        getColor={() => 'blue'}
      />
    </section>
    <section>
      <p>Line Graph:</p>
      <TimeGraph
        type="line"
        aggregation='hour'
        data={mock.response.p}
        timeParser={parser}
        timeFormatter={formatter}
        timeDisplay={display}
        timeUnitLengthSec={timeUnitLengthSec}
        getColor={() => 'blue'}
      />
    </section>
    <section>
      <p>Area Graph:</p>
      <TimeGraph
        type="area"
        aggregation='hour'
        data={mock.response.p}
        timeParser={parser}
        timeFormatter={formatter}
        timeDisplay={display}
        timeUnitLengthSec={timeUnitLengthSec}
        getColor={() => 'blue'}
      />
    </section>
  </div>
