import React from 'react'  // eslint-disable-line no-unused-vars
import {pickBy} from 'lodash'

import { BarGraphGroup } from '../src'
import { object, select } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

const mock = require('./_mock.json');

export default () =>
  <div>
    <h2>Bar Graph Group</h2>
    <section>
      <h3>Default:</h3>
      <BarGraphGroup
        name={'My Data'}
        columns={select('Columns', [2, 3, 4], 2)}
        data={object('Data', pickBy(mock.response, (r,k) => k !== 'p' ))}/>
    </section>
  </div>
