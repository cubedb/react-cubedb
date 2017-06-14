import PropTypes from 'prop-types';
import React from 'react';
import * as d3 from 'd3';
import {pickBy} from 'lodash';

import { BarGraphGroup } from 'react-cubedb';
import { object, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

const mock = require('./_mock.json');

const lookup = {'My Data': { 1: 'Foo (1)', 2: 'Bar (2)'}}

export default ({children}) =>
  <div>
    <h2>Bar Graph Group</h2>
    <section>
    <h3>Default:</h3>
    <BarGraphGroup name={'My Data'}
              data={object('Data', pickBy(mock.response, (r,k) => k !== 'p' ))}/>
    </section>
  </div>
