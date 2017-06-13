import PropTypes from 'prop-types';
import React from 'react';

import { BarGraph } from 'react-cubedb';
import { object, number } from '@storybook/addon-knobs';

const mock = require('./_mock.json');

export default ({children}) =>
  <div>
    <h2>Bar Graph</h2>
    <section>
    <p>Default:</p>
    <BarGraph data={mock.response.dimension_f}/>
    </section>
    <section>
    <p>Without data:</p>
    </section>
  </div>
