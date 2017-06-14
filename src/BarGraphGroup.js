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

  // shouldComponentUpdate(){
  //   return true
  // }

  onDownload = (dataLabel, volume, dataSerie, comparingTo) => () => {
    // logAction("graphs", "bar", "download")
    const defaultDimension = {c: 0}
    let stacksLabel = ''
    const delimiter = ','
    const endLine = '\r\n'

    const createLine = (name, count = 0, stack= []) => {
      const proportion = volume > 0  && count > 0 ? (count||0)/volume : 0
      let stacks = ''

      if(this.props.group){
        _.each(this.props.allData[this.props.group], (d, i) => {
          stacks += `${delimiter}${(stack[i]||defaultDimension).c}`
        })
      }

      stacks += `${delimiter}${count}`

      return `${name}${delimiter}${(proportion*100).toFixed(3)}%${stacks}${endLine}`
    }

    const body = _.map(dataSerie, (el)=>{
      if(comparingTo){
        let window = comparingTo[el.key] || {count: 0, stack:[]}
        return `${createLine(`${el.name}${delimiter}A`, window.count, window.stack)}${createLine(`${el.name}${delimiter}B`, el.count, el.stack)}`
      } else {
        return createLine(el.name, el.count, el.stack)
      }
    }).join("")

    if(this.props.group){
      _.each(this.props.allData[this.props.group], (d, i) => {
        stacksLabel += `${delimiter}${d[i].name}`
      })
    }

    stacksLabel += `${delimiter}event count`

    const header = `${dataLabel}${delimiter}${comparingTo ? `window${delimiter}` : ''}percentage${stacksLabel}${endLine}`
    const fileData = header+body

    const blob = new Blob([fileData], {type: 'text/plain'})
    
    saveData(`event_${this.props.name.key}_serie_${dataLabel}${this.props.group ? `_grouped_by_${this.props.group }`:''}.csv`, blob)
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
                        group={this.props.group}
                        lookup={this.props.lookup}
                        getColor={this.props.getColor}
                        />
                      {/*<Panel bsStyle={(this.props.selectedItems[p[0]] ? 'info' : 'default')} header={
                            <BarGraphHeader serie={p[0]}
                                             dimensions={_.map(list, 'name')}
                                             validSelectedItems={serie.filters}
                                             selectedItems={this.props.selectedItems[p[0]]}
                                             onSearch={this.onSearch(p[0])}
                                             searchTerm={searchTerm}
                                             size={_.size(dimensionData)}
                                             onDownload={this.onDownload(p[0], serie.volume, dimensionData, comparingTo)} 
                                             onStretch={this.props.group && this.props.group !== p[0] && this.onStretch(p[0])}
                                             stretched={this.props.group && this.props.group !== p[0] && this.state.stretched[p[0]]}
                                             onChange={this.props.onChange}
                                             groupedBy={this.props.group === p[0]}/>
                      }>
                        {searchTerm ?
                          <div className="bar-graph-group__search-help">Search result for "{searchTerm}"</div>
                        :
                          null
                        }
                        <BarGraph
                          serie={p[0]}
                          volume={serie.volume}
                          data={list}
                          comparingTo={comparingTo}
                          windowVolume={window.volume}
                          group={this.props.group}
                          groupedBy={this.props.group === p[0]}
                          stretched={this.props.group && this.props.group !== p[0] && this.state.stretched[p[0]]}
                          lookup={this.lookup(p[0]) }
                          getColor={this.props.getColor}
                          />
                      </Panel>*/}

                    </div>
          })}
      </div>
  }
}

export default class BarGraphGroup extends React.Component {

  static propTypes = {
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

  // shouldComponentUpdate(nextProps){
  //   return true //this.props.height != nextProps.height || this.props.width != nextProps.width || !_.isEqual(this.props.data, nextProps.data) || !_.isEqual(this.props.comparingTo, nextProps.comparingTo)
  // }


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
                            selectedItems={this.props.selectedItems}
                            getColor={this.props.getColor}/>
                })
            .value()

    return (<div className="bar-graph-group">
            {content}
          </div>)
  }
}
