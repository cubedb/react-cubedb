import _ from 'lodash'

import React from 'react'
import BarGraph from './BarGraph'
import { FormGroup, FormControl, Button, ButtonGroup, ButtonToolbar, Panel, OverlayTrigger, Popover, Glyphicon, Col } from 'react-bootstrap'
// import { logAction } from '../../core/analytics'


import './style/BarGraphGroup.scss'

const DIMENSION_LIMIT = 300

class BarGraphHeader extends React.Component {

  onClickAddAll = (e) => {
    e.preventDefault()
    this.props.changeSelection([this.props.serie])(_.difference(this.props.dimensions, this.props.selectedItems))
  }
  onClickInvert = (e) => {
    e.preventDefault()
    this.props.changeSelection([this.props.serie])(this.props.dimensions)
  }
  onClickRemoveAll = (e) => {
    e.preventDefault()
    this.props.changeSelection([this.props.serie])(this.props.selectedItems)
  }

  render(){
    return <div>
            <h4>
              {this.props.serie} <small>({this.props.size > DIMENSION_LIMIT ? `${DIMENSION_LIMIT} of ` : ''}{this.props.size})</small>
            </h4>
            <ButtonGroup className="bar-graph-group__actions">
                <Button title="Click to save as csv" onClick={this.props.onDownload}><Glyphicon glyph="save"/></Button>
                <OverlayTrigger container={this} trigger="click" rootClose placement="bottom" overlay={
                    <Popover className="bar-graph-group__filter__dimension" id={`popover-${this.props.serie}`} title="">
                          <Col>
                          <ButtonGroup>
                            <Button bsSize="small" bsStyle="primary" onClick={this.onClickAddAll}>Add all</Button>
                            <Button bsSize="small" bsStyle="primary" onClick={this.onClickInvert}  disabled={!_.size(this.props.selectedItems)}>Invert selected</Button>
                            <Button bsSize="small" bsStyle="primary" onClick={this.onClickRemoveAll} disabled={!_.size(this.props.selectedItems)}>Remove all</Button>
                          </ButtonGroup>
                          </Col>
                          <br/>
                          <Col>
                          <FormGroup className="bar-graph-group__list__search"
                                    bsSize="small"
                                    validationState={this.props.searchTerm===false ? 'error' : this.props.searchTerm ? 'success' : null}>
                            <FormControl defaultValue={this.props.searchTerm ? this.props.searchTerm : undefined} onChange={this.props.onSearch} placeholder="Looking for..." type="text" />
                            <FormControl.Feedback>
                              <Glyphicon glyph="search" />
                           </FormControl.Feedback>
                          </FormGroup>
                          </Col>
                          <br/>
                          <Col>
                          <ButtonToolbar>
                            {_.map(this.props.selectedItems, (f)=>{
                              return <Button className="bar-graph-group__filter__dimension__button" bsStyle={this.props.validSelectedItems.indexOf(f) > -1 ? 'default' : 'danger'} key={`filter-${f}`} onClick={ () => {this.props.changeSelection([this.props.serie])(f)} } bsSize="xsmall">{f} <Glyphicon glyph={this.props.validSelectedItems.indexOf(f) > -1 ? 'remove-sign' : 'alert'}/></Button>
                            })}
                          </ButtonToolbar>
                          </Col>
                    </Popover>}>
                  <Button title="Click to change the applied filters" bsStyle={(this.props.selectedItems || this.props.searchTerm || []).length ? 'info' : 'default'}><Glyphicon  glyph="filter"/></Button>
                </OverlayTrigger>
                {this.props.onStretch ? <Button title="Click to change the view mode" bsStyle={this.props.stretched ? 'primary' : 'default'} onClick={this.props.onStretch}><Glyphicon glyph="tasks"/></Button> : null }
                {this.props.cube.ignoreGroup && this.props.cube.ignoreGroup[this.props.serie] ?
                  null
                  :
                  <Button title="Click to change the stacking based in this group" 
                          bsStyle={this.props.groupedBy ? 'primary' : 'default'} 
                          onClick={() => {this.props.changeSelection(['group'])(this.props.serie)}}>
                            <Glyphicon glyph="indent-left"/>
                  </Button>
                }
              
              </ButtonGroup>
            </div>
  }
}

class BarGraphColumn extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      stretched: [],
      search: []
    }
  }

  shouldComponentUpdate(){
    return true
  }

  onDownload = (dataLabel, volume, dataSerie, windowData) => () => {
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
      if(windowData){
        let window = windowData[el.key] || {count: 0, stack:[]}
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

    const header = `${dataLabel}${delimiter}${windowData ? `window${delimiter}` : ''}percentage${stacksLabel}${endLine}`
    const fileData = header+body

    const blob = new Blob([fileData], {type: 'text/plain'})
    
    saveData(`event_${this.props.cube.key}_serie_${dataLabel}${this.props.group ? `_grouped_by_${this.props.group }`:''}.csv`, blob)
  }

  onStretch = (serie) => () => {
    // logAction("graphs", "bar stretch", serie)
    this.setState({
      stretched: Object.assign({}, this.state.stretched, {
        [this.props.cube.key+serie]: !this.state.stretched[this.props.cube.key+serie]
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
            [this.props.cube.key+serie]: search
          })
        })
      } catch(e) {
        this.setState({
          search: Object.assign({}, this.state.search, {
            [this.props.cube.key+serie]: false
          })
        })
      }
    } else {
      this.setState({
        search: Object.assign({}, this.state.search, {
          [this.props.cube.key+serie]: undefined
        })
      })
    }
  }


  lookup(p) {
    const defaultLookup = (key) => {
      return (key === 'null' ? '<not defined>' : key)
    }
    if (this.props.lookups[p]) {
      const lookup = this.props.lookups[p];
      return (key) => {
        return lookup[key] || defaultLookup(key);
      }
    }
    else
      return defaultLookup;
  }

  flattenData(p){
    let filters = [];
    let volume = 0;
    const header = this.props.headers[p[1]] || p[1];
    let data = _(p[1]).toPairs().map((pair) => {
      let key = pair[0]
      let stack = pair[1]
      let name = this.lookup(p[0])(key)
      let count = 0
      if(this.props.group && stack){
        stack = _.each(stack, (d, k) => {
          if(!d.hasOwnProperty('c')){
            d = {
              c: d
            }
          }
          count += d.c
          d.name = this.lookup(this.props.group)(k);
        })
      } else {
        count = stack.c;
        stack = {
          [key]: {
            c: stack.c,
            name
          }
        }
      }

      const changeSelection = (e) => { this.props.changeSelection(p)(name); }
      const selected = (this.props.selectedItems[p[0]] || []).includes(name)

      volume += count

      if(selected){
        filters.push(name)
      }
      return { name, count, stack, key, changeSelection, selected }
    })
      .sortBy('count')
      .reverse()
      .value()

    return {data, volume, filters}
  }

  render() {
    return <div className='cube_graph__column'>
          {_.map(this.props.data, (p) => {
            const serie = this.flattenData(p)
            let window = {}
            let dimensionData = serie.data
            let windowData = null
            if(this.props.windowData){
              window = this.flattenData([p[0], this.props.windowData[p[0]]])
              windowData = _.mapKeys(window.data, 'key')
            }

              //const changeSelection = (value) => { return this.props.changeSelection(p[0], value) };
            let searchTerm = this.state.search[this.props.cube.key+p[0]]
            if(searchTerm){
              let searchPattern = RegExp(searchTerm, 'i')
              dimensionData = _.filter(dimensionData, (dt) => {
                return searchPattern.test(dt.key) || searchPattern.test(dt.name)
              })
            }

            let list = dimensionData.slice(0, DIMENSION_LIMIT)  


            return <div key={p[0]} className={`bar-graph-group__list`}>

                      <Panel bsStyle={(this.props.selectedItems[p[0]] ? 'info' : 'default')} header={
                            <BarGraphHeader serie={p[0]}
                                             dimensions={_.map(list, 'name')}
                                             validSelectedItems={serie.filters}
                                             selectedItems={this.props.selectedItems[p[0]]}
                                             onSearch={this.onSearch(p[0])}
                                             searchTerm={searchTerm}
                                             cube={this.props.cube}
                                             size={_.size(dimensionData)}
                                             onDownload={this.onDownload(p[0], serie.volume, dimensionData, windowData)} 
                                             onStretch={this.props.group && this.props.group !== p[0] && this.onStretch(p[0])}
                                             stretched={this.props.group && this.props.group !== p[0] && this.state.stretched[this.props.cube.key+p[0]]}
                                             changeSelection={this.props.changeSelection}
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
                          windowData={windowData}
                          windowVolume={window.volume}
                          group={this.props.group}
                          groupedBy={this.props.group === p[0]}
                          stretched={this.props.group && this.props.group !== p[0] && this.state.stretched[this.props.cube.key+p[0]]}
                          lookup={this.lookup(p[0]) }
                          getColor={this.props.getColor}
                          />
                      </Panel>

                    </div>
          })}
      </div>
  }
}

export default class BarGraphGroup extends React.Component {
  state = {
    columns: 1,
  }

  getColumns = (size) => {
    return Math.floor(size/420)
  }

  shouldComponentUpdate(nextProps){
    return true //this.props.height != nextProps.height || this.props.width != nextProps.width || !_.isEqual(this.props.data, nextProps.data) || !_.isEqual(this.props.windowData, nextProps.windowData)
  }


  render() {
    let n = 0;
    const content = _(this.props.data)
                .toPairs()
                .filter((p) => { return p[0] != 'p' })
                .sortBy((p) => {
                  const index = this.props.fieldOrders.indexOf(p[0]);
                  if (index < 0)
                    return 99999;
                  else
                    return index;
                })
                .groupBy((p) => {
                  return (n++)%(this.getColumns(this.props.width))
                })
                .map((g, i) => {
                  let key = _.reduce(g, (k, e) => {
                    return k + e[0]
                  })
                  return <BarGraphColumn key={key}
                            data={g}
                            allData={this.props.data}
                            windowData={this.props.windowData}
                            headers={this.props.headers}
                            lookups={this.props.lookups}
                            group={this.props.group}
                            cube={this.props.cube}
                            changeSelection={this.props.changeSelection}
                            selectedItems={this.props.selectedItems}
                            getColor={this.props.getColor}/>
                })
            .value()

    return (<div className="bar-graph-group">
            {content}
          </div>)
  }
}
