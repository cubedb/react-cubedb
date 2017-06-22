import _ from 'lodash'

import React from 'react'
import BarGraph from './BarGraph'
import { FormGroup, FormControl, Button, ButtonGroup, ButtonToolbar, Panel, OverlayTrigger, Popover, Glyphicon, Col } from 'react-bootstrap'
// import { logAction } from '../../core/analytics'
import normalizeData from './utils/normalizeData'

import './style/BarGraphGroup.scss'

const DIMENSION_LIMIT = 300


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
    let search = e.target.value
    // logAction("graphs", "bar search", search)
    if(search.length) {
      try {
        new RegExp(search, 'i');
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
            return <div key={key} className={`bar-graph-group__list`}>
                      <BarGraph 
                        name={key}
                        data={serie}
                        comparingTo={this.props.comparingTo && this.props.comparingTo[key]}
                        selected={this.props.selectedItems && this.props.selectedItems[key]}
                        onChange={this.props.onChange}
                        slice={this.props.slice}
                        group={this.props.group}
                        lookup={this.props.lookup}
                        getColor={this.props.getColor}
                        />
                    </div>
          })}
      </div>
  }
}

export default class BarGraphGroup extends React.Component {

  static propTypes = {
    slice: React.PropTypes.number,
    width: React.PropTypes.number,
    columns: React.PropTypes.number,
    onChange: React.PropTypes.func,
    data: React.PropTypes.object,
    fieldOrders: React.PropTypes.array,
    getColor: React.PropTypes.func,
    group: React.PropTypes.string,
    lookup: React.PropTypes.object,
    selectedItems: React.PropTypes.object,
    comparingTo: React.PropTypes.object
  }

  static defaultProps = {
      onChange: undefined,
      data: {},
      fieldOrders: [],
      getColor: undefined,
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
    let n = 0;
    const content = _(this.props.data)
                .toPairs()
                .sortBy((p) => {
                  const index = this.props.fieldOrders.indexOf(p[0]);
                  if (index < 0)
                    return 99999;
                  else
                    return index;
                })
                .groupBy((p) => {
                  return (n++)%(this.getColumns())
                })
                .map((g, i) => {
                  let key = _.reduce(g, (k, e) => {
                    return k + e[0]
                  })
                  return <BarGraphColumn key={key}
                            data={_.fromPairs(g)}
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
