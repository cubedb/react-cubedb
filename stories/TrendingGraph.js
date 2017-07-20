import React from 'react'  // eslint-disable-line no-unused-vars

import { TrendingGraph } from '../src'
import { number } from '@storybook/addon-knobs'

const mock = require('./_mock.json')

export default () =>
  <div>
    <h2>Trending Graph</h2>
    <section>
      <h3>Default:</h3>
      <TrendingGraph data={mock.response.p}/>
    </section>
    <section>
      <h3>Without data:</h3>
      <TrendingGraph/>
    </section>
    <section>
      <h3>With custom dimension:</h3>
      <TrendingGraph
        data={mock.response.p}
        width={number('width', 200)}
        height={number('height',80)}/>
    </section>
  </div>
