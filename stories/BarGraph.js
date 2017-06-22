import PropTypes from 'prop-types';
import React from 'react';
import * as d3 from 'd3';

import { BarGraph } from 'react-cubedb';
import { object, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

const mock = require('./_mock.json');

const lookup = {'My Data': { 1: 'Foo (1)', 2: 'Bar (2)'}}

export default ({children}) =>
  <div>
    <h2>Bar Graph</h2>
    <section>
    <h3>Without data:</h3>
    <BarGraph name={'My Data'}/>
    </section>
    <section>
    <h3>Default:</h3>
    <BarGraph name={'My Data'}
              onChange={action('change-value')}
              data={object('Data', mock.response.dimension_g)}/>
    </section>
    <section>
    <h3>With lookup:</h3>
    <BarGraph name={'My Data'} 
              data={object('Data', mock.response.dimension_g)}
              onChange={action('change-value')}
              lookup={object('Lookup', lookup)}/>
    </section>
    <section>
    <h3>With custom colors:</h3>
    <BarGraph name={'My Data'} 
              data={object('Data', mock.response.dimension_g)}
              lookup={object('Lookup', lookup)}
              onChange={action('change-value')}
              getColor={(name)=>{
                if(name == '1') {
                  return select('"1" Color', ['red', 'green'])
                } else {
                  return select('Other Color', ['blue', 'yellow'])
                }
              }}/>
    </section>
    <section>
    <h3>With slice definition:</h3>
    <BarGraph name={'My Data'} 
              data={object('Data', mock.response.dimension_g)}
              onChange={action('change-value')}
              slice={2}
              lookup={object('Lookup', lookup)}/>
    </section>
    <section>
    <h3>With change event:</h3>
    <BarGraph name={'My Data'} 
              data={object('Data', mock.response.dimension_g)}
              onChange={action('change-value')}
              lookup={object('Lookup', lookup)}/>
    </section>
    <section>
    <h3>Comparing data:</h3>
    <BarGraph name={'My Data'} 
              data={object('Data', mock.response.dimension_g)}
              comparingTo={object('Comparing to', mock.response.dimension_g_comparing)}
              onChange={action('change-value')}
              lookup={object('Lookup', lookup)}/>
    </section>
  </div>
