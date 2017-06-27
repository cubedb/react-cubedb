import React from 'react'  // eslint-disable-line no-unused-vars
import { shallow } from 'enzyme'

import TrendingGraph from './TrendingGraph'


const defaultProps = {
  data: {
    '2017-01-01 01': { c: 1 },
    '2017-01-01 02': { c: 2 },
    '2017-01-01 03': { c: 3 }
  }
}


describe('TrendingGraph', () => {

  it('default', () => {
    const component = shallow(<TrendingGraph {...defaultProps} />)

    expect(component).toMatchSnapshot()
  })

  it('no data', () => {
    const component = shallow(<TrendingGraph {...defaultProps} data={undefined} />)

    expect(component).toMatchSnapshot()
  })
})
