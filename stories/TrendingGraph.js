import PropTypes from 'prop-types';
import React from 'react';

import { TrendingGraph } from '../src';
import { object, number } from '@storybook/addon-knobs';

const mock = require('./_mock.json');

export default ({children}) =>
  <div>
    <h2>Trending Graph</h2>
    <section>
    <p>Default:</p>
    <TrendingGraph data={mock.response.p}/>
    </section>
    <section>
    <p>Without data:</p>
    <TrendingGraph/>
    </section>
    <section>
    <p>With custom dimension:</p>
    <TrendingGraph
      data={mock.response.p}
      width={number('width', 200)}
      height={number('height',80)}/>
    </section>
  </div>
