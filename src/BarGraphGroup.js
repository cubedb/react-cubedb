import _ from 'lodash'
import { scaleOrdinal, schemeCategory20c } from 'd3'
import React from 'react'
import PropTypes from 'prop-types'
import BarGraph from './BarGraph'

import './style/BarGraphGroup.scss'


class BarGraphColumn extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      stretched: [],
      search: []
    }
  }

  onStretch = (serie) => () => {
    // logAction("graphs", "bar stretch", serie)
    this.setState({
      stretched: Object.assign({}, this.state.stretched, {
        [this.props.name+serie]: !this.state.stretched[this.props.name+serie]
      })
    })
  }

  onSearch = (serie) => (e) => {
    const search = e.target.value
    // logAction("graphs", "bar search", search)
    if(search.length) {
      try {
        new RegExp(search, 'i')
        this.setState({
          search: Object.assign({}, this.state.search, {
            [serie]: search
          })
        })
      } catch(e) {
        this.setState({
          search: Object.assign({}, this.state.search, {
            [serie]: false
          })
        })
      }
    } else {
      this.setState({
        search: Object.assign({}, this.state.search, {
          [serie]: undefined
        })
      })
    }
  }

  render() {
    return <div className='cube_graph__column'>
      {_.map(this.props.data, (serie, key) => {
        const description = this.props.dataDescription ? this.props.dataDescription[key] : undefined

        return <div key={key} className={'bar-graph-group__list'}>
          <BarGraph
            name={key}
            description={description}
            data={serie}
            comparingTo={this.props.comparingTo && this.props.comparingTo[key]}
            selected={this.props.selectedItems && this.props.selectedItems[key]}
            onChange={this.props.onChange}
            slice={this.props.slice}
            group={this.props.group}
            lookup={this.props.lookup}
            getColor={this.props.getColor}
            allData={this.props.allData}
          />
        </div>
      })}
    </div>
  }
}

export default class BarGraphGroup extends React.Component {
  static propTypes = {
    slice: PropTypes.number,
    width: PropTypes.number,
    columns: PropTypes.number,
    onChange: PropTypes.func,
    data: PropTypes.object.isRequired,
    dataDescription: PropTypes.object,
    fieldOrders: PropTypes.array,
    getColor: PropTypes.func,
    group: PropTypes.string,
    lookup: PropTypes.object,
    selectedItems: PropTypes.object,
    comparingTo: PropTypes.object
  }

  static defaultProps = {
    onChange: undefined,
    data: {},
    fieldOrders: [],
    getColor: scaleOrdinal(schemeCategory20c),
    group: null,
    lookup: {},
    selectedItems: {},
    width: 420,
    comparingTo: null,
    columns: null
  }

  getColumns = () => {
    return this.props.columns || Math.floor(this.props.width/420)
  }

  render() {
    let n = 0
    const content = _(this.props.data)
      .toPairs()
      .sortBy((p) => {
        const index = this.props.fieldOrders.indexOf(p[0])
        if (index < 0)
          return 99999
        else
          return index
      })
      .groupBy(() => {
        return (n++)%(this.getColumns())
      })
      .map((g) => {
        const key = _.reduce(g, (k, e) => {
          return k + e[0]
        })
        return <BarGraphColumn key={key}
          data={_.fromPairs(g)}
          dataDescription={this.props.dataDescription}
          allData={this.props.data}
          comparingTo={this.props.comparingTo}
          lookup={this.props.lookup}
          group={this.props.group}
          onChange={this.props.onChange}
          slice={this.props.slice}
          selectedItems={this.props.selectedItems}
          getColor={this.props.getColor}/>
      })
      .value()

    return (<div className="bar-graph-group">
      {content}
    </div>)
  }
}
