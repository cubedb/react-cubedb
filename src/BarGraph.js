import _ from 'lodash'
import React from 'react'
import { FormGroup, FormControl, Button, ButtonGroup, ButtonToolbar, Panel, OverlayTrigger, Popover, Glyphicon } from 'react-bootstrap'
import * as d3 from 'd3'

import saveData from './utils/saveData'
import normalizeData from './utils/normalizeData'
import './style/BarGraph.scss'
  
const numberFormat = d3.format(",d")

const getCommonPrefix = (array) => {
    // return empty string for arrays withe less then two elements
  if (!array || array.length <= 1)
    return '' // Sorting an array and comparing the first and last elements
  var A = array.concat().sort(),
    a1 = A[0],
    a2 = A[A.length - 1],
    L = a1.length,
    i = 0;
  while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
  const prefix = a1.substring(0, i);
    // Now checking if it contains number and ends with _
  if (prefix[prefix.length - 1] === '_' && !/\d/.test(prefix))
    return prefix
  else
    return ''
}

class Bar extends React.Component {

  static propTypes = {
    data: React.PropTypes.object,
    max: React.PropTypes.number,
    group: React.PropTypes.string,
    getColor: React.PropTypes.func,
    name: React.PropTypes.string,
    proportion: React.PropTypes.number,
  }

  // shouldComponentUpdate(){
  //   return true;
  // }
  
  render() {
    let bars = []
    const limit = 5
    const {c, name, key, stack} = this.props.data

    if(this.props.group) {
      const highlights = _.chain(stack).sortBy('c').reverse().slice(0,limit).map('key').value()
      let amount = c
      _.mapValues(stack, (bar, i) => {
                    if(highlights.includes(bar.key)){
                      amount -= bar.c
                      let proportion = this.props.max > 0 ? bar.c/this.props.max : 0
                      let width = `${(proportion*100)}%`
                      bars.push(<div key={bar.key+this.props.group} title={`${bar.name}: ${numberFormat(bar.c)} (${(bar.c/c*100).toFixed(3)}%)`} className="bar-graph__bar" style={{width: width, backgroundColor: this.props.getColor(bar.key, this.props.group) }}></div>)
                    } 
                  })

      if(amount > 0){
        let percentage = this.props.max > 0 ? amount/this.props.max*100 : 0
        let width = `${(percentage)}%`
        bars.push(<div title={`others: ${numberFormat(amount)}, (${(amount/c*100).toFixed(3)}%)`} key={'others'+this.props.group} className="bar-graph__bar" style={{width: width, backgroundColor: this.props.getColor('other') }}></div>)
      }
    } else  {
      let percentage = this.props.max > 0 ? c/this.props.max*100 : 0
      let width = `${(percentage)}%`
      bars.push(<div title={`${name}: ${numberFormat(c)}`} key={key} className="bar-graph__bar" style={{width: width, backgroundColor: this.props.getColor(key) }}></div>)
    }

    return <div className="bar-graph__bar-wrap">
            {bars}
            <span className="bar-graph__bar__percentage">{`${(this.props.proportion*100).toFixed(3)}%`}</span>
           </div>
  }
}

class BarLine extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func,
    container: React.PropTypes.any,
    data: React.PropTypes.object,
    getColor: React.PropTypes.func,
    group: React.PropTypes.string,
    label: React.PropTypes.string,
    max: React.PropTypes.number,
    selected: React.PropTypes.true,
    name: React.PropTypes.any,
    stretched: React.PropTypes.bool,
    total: React.PropTypes.number,
    comparingData: React.PropTypes.any,
    comparingTotal: React.PropTypes.number,
  }

  shouldComponentUpdate(){
    return true;
  }

  getIcon(val1, val2){
    let percentage = (Math.abs(1-val1/val2)*100).toFixed(1)
    if(val1 > val2){
      return <div className="bar-graph__variation__wrapper"><span className="bar-graph__variation--up">{'▲'}{isFinite(percentage) ? <span className="variation__icon">{`${percentage}% `}</span> : <span className="variation__icon--infinity">∞</span>}</span></div>
    } else if(val2 > val1){
      return <div className="bar-graph__variation__wrapper"><span className="bar-graph__variation--down">{'▼'}{isFinite(percentage) ? <span className="variation__icon">{`${percentage}% `}</span> : <span className="variation__icon--infinity">∞</span>}</span></div>
    } else {
      return <div className="bar-graph__variation__wrapper"><span className="bar-graph__variation">{'='}</span></div>
    }
  }

  render(){

    return <div className={'bar-graph' + (this.props.selected ? ' selected' : '')} onClick={() => this.props.onChange(this.props.name, this.props.data.key)}>
            {this.props.comparingData ? this.getIcon(this.props.data.c, this.props.comparingData.c) : null }
            <div className="bar-graph__label__wrapper">
                  <div className="bar-graph__label">
                  {this.props.label}
                  </div>
            </div>
            {this.props.comparingData ? 
              <div className="bar-graph__value__wrapper">
                <div className={`bar-graph__value`}>
                  {numberFormat(this.props.comparingData.c||0)}
                </div>
                <div className={`bar-graph__value`}>
                  {numberFormat(this.props.data.c||0)}
                </div>
              </div>
              : 
              <div className="bar-graph__value__wrapper">
                <div className="bar-graph__value">{numberFormat(this.props.data.c||0)}</div>
              </div>}  
            <div className="bar-graph__bar-container__wrapper">
              <div className="bar-graph__bar-container">
                {this.props.comparingData ? 
                  <Bar key="comparing" 
                       container={this.props.container} 
                       data={this.props.comparingData} 
                       group={this.props.group}
                       name={this.props.name}
                       max={this.props.stretched ? this.props.comparingData.c : this.props.max} 
                       getColor={this.props.getColor}
                       proportion={(this.props.comparingTotal > 0  && this.props.comparingData.c > 0 ? ((this.props.comparingData.c||0)/this.props.comparingTotal) : 0)}/>
                : null}
                <Bar container={this.props.container} 
                     data={this.props.data} 
                     group={this.props.group}
                     name={this.props.name}
                     max={this.props.stretched ? this.props.data.c : this.props.max} 
                     getColor={this.props.getColor}
                     proportion={(this.props.total > 0  && this.props.data.c > 0 ? ((this.props.data.c||0)/this.props.total) : 0)}/>
              </div>
            </div>
          </div>
  }
}

class BarList extends React.Component {
  static propTypes = {
    dimension: React.PropTypes.object,

    hideCommonPrefix: React.PropTypes.bool,
    stretched: React.PropTypes.bool,
    filter: React.PropTypes.string,
    getColor: React.PropTypes.func,
    group: React.PropTypes.string,
    name: React.PropTypes.string,
    comparingTo: React.PropTypes.object,
    lookup: React.PropTypes.object,
    selected: React.PropTypes.object
  }

  static defaultProps = {
    hideCommonPrefix: false,
    stretched: false,
    getColor: d3.scaleOrdinal(d3.schemeCategory20c)
  }

  // shouldComponentUpdate(){
  //   return true;
  // }

  render() {
    const {serie, max, total} = this.props.dimension
    if (!_.isEmpty(serie)) {
      const comparingMax = this.props.comparingTo ? this.props.comparingTo.max : 0
      const prefix = this.props.hideCommonPrefix ? getCommonPrefix(_.map(this.props.data, (d) => { if (d.name!=='<not defined>') return d.name })) : ''

      return <div className="cube_bars__list__content">
              {_(serie).sortBy('c').reverse().map((d, i) => {      
                let comparingData = null
                if(this.props.comparingTo && this.props.comparingTo.serie) {
                  comparingData = this.props.comparingTo.serie[d.key] ? this.props.comparingTo.serie[d.key] : {c:0}
                }
                if(!this.props.filter || RegExp(this.props.filter, 'i').test(d.name)) {
                  return <BarLine 
                            key={d.key}
                            name={this.props.name}
                            label={prefix ? d.name.startsWith(prefix)?d.name.substring(prefix.length):d.name : d.name}
                            total={total}
                            comparingTotal={this.props.comparingTo ? this.props.comparingTo.total : null}
                            max={Math.max(max, comparingMax)}
                            data={d}
                            group={this.props.group}
                            stretched={this.props.stretched}
                            container={this}
                            onChange={this.props.onChange}
                            comparingData={comparingData}
                            getColor={this.props.getColor}
                            selected={this.props.selected.indexOf(d.key) >= 0} />
                }
              }).value()}
            </div>
    } else {
      return <div className="cube_bars__list__content--empty">No dimension available</div>
    }
  }
}

class BarGraphHeader extends React.Component {

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
        return `${createLine(`${el.name}${delimiter}A`, window.c, window.stack)}${createLine(`${el.name}${delimiter}B`, el.c, el.stack)}`
      } else {
        return createLine(el.name, el.c, el.stack)
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
    
    saveData(`event_${this.props.name}_serie_${dataLabel}${this.props.group ? `_grouped_by_${this.props.group }`:''}.csv`, blob)
  }

  onClickAddAll = (e) => {
    e.preventDefault()
    this.props.onChange(this.props.name, _.difference(this.props.dimensions, this.props.selectedItems))
  }
  onClickInvert = (e) => {
    e.preventDefault()
    this.props.onChange(this.props.name, this.props.dimensions)
  }
  onClickRemoveAll = (e) => {
    e.preventDefault()
    this.props.onChange(this.props.name, this.props.selectedItems)
  }

  render(){
    return <div>
            <h4>
              {this.props.name} <small>({this.props.size})</small>
            </h4>
            <ButtonGroup className="bar-graph-group__actions">
                <Button title="Click to save as csv" onClick={this.onDownload(this.props.name, this.props.total, this.props.dimension, this.props.comparingTo)}><Glyphicon glyph="save"/></Button>
                <OverlayTrigger container={this} trigger="click" rootClose placement="bottom" overlay={
                    <Popover className="bar-graph-group__filter__dimension" id={`popover-${this.props.name}`} title="">
                          <div>
                          <ButtonGroup>
                            <Button bsSize="small" bsStyle="primary" onClick={this.onClickAddAll}>Add all</Button>
                            <Button bsSize="small" bsStyle="primary" onClick={this.onClickInvert}  disabled={!_.size(this.props.selectedItems)}>Invert selected</Button>
                            <Button bsSize="small" bsStyle="primary" onClick={this.onClickRemoveAll} disabled={!_.size(this.props.selectedItems)}>Remove all</Button>
                          </ButtonGroup>
                          </div>
                          <br/>
                          <div>
                          <FormGroup className="bar-graph-group__list__search"
                                    bsSize="small"
                                    validationState={this.props.filter===false ? 'error' : this.props.filter ? 'success' : null}>
                            <FormControl defaultValue={this.props.filter ? this.props.filter : undefined} onChange={this.props.onSearch} placeholder="Looking for..." type="text" />
                            <FormControl.Feedback>
                              <Glyphicon glyph="search" />
                           </FormControl.Feedback>
                          </FormGroup>
                          </div>
                          <br/>
                          <div>
                          <ButtonToolbar>
                            {_.map(this.props.selectedItems, (f)=>{
                              return <Button className="bar-graph-group__filter__dimension__button" 
                                        key={`filter-${f}`} 
                                        onClick={ () => {this.props.onChange([this.props.name])(f)} } 
                                        bsSize="xsmall">
                                          {f} <Glyphicon glyph='remove-sign'/>
                                      </Button>
                            })}
                          </ButtonToolbar>
                          </div>
                    </Popover>}>
                  <Button title="Click to change the applied filters" bsStyle={(this.props.selectedItems || this.props.filter || []).length ? 'info' : 'default'}><Glyphicon  glyph="filter"/></Button>
                </OverlayTrigger>
                {this.props.onStretch ? <Button title="Click to change the view mode" bsStyle={this.props.stretched ? 'primary' : 'default'} onClick={this.props.onStretch}><Glyphicon glyph="tasks"/></Button> : null }
                <Button title="Click to change the stacking based in this group" 
                        bsStyle={this.props.group === this.props.name ? 'primary' : 'default'} 
                        onClick={() => {this.props.onChange('group', this.props.name)}}>
                          <Glyphicon glyph="indent-left"/>
                </Button>
              
              </ButtonGroup>
            </div>
  }
}


export default class BarGraph extends React.Component {
  static propTypes = {
    comparingTo: React.PropTypes.object,
    data: React.PropTypes.object,
    getColor: React.PropTypes.func,
    group: React.PropTypes.string,
    lookup: React.PropTypes.object,
    name: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    selected: React.PropTypes.array
  }

  static defaultProps = {
    name: '',
    group: null,
    selected: [],
    comparingTo: null,
    lookup: {}
  }

  state = {
    stretched: false,
    search: null,
  }

  onSearch = (e) => {
    let search = e.target.value
    
    if(search.length) {
      try {
        new RegExp(search, 'i');
        this.setState({
          search: search
        })
      } catch(e) {
        this.setState({
          search: false
        })
      }
    } else {
      this.setState({
        search: null
      })
    }
  }

  onStretch = () => {
    this.setState({
      stretched: !this.state.stretched
    })
  }

  onChange = (name, selected) => {
    return this.props.onChange && this.props.onChange(name, selected)
  }

  render() {
    const dimension = normalizeData(this.props.data, this.props.lookup[this.props.name], this.props.lookup[this.props.group])
    const comparing = this.props.comparingTo ? normalizeData(this.props.comparingTo, this.props.lookup[this.props.name], this.props.lookup[this.props.group]) : null
    let filter = this.state.search
    const isGroupSource = (this.props.group && this.props.group === this.props.name)


    return <Panel bsStyle={isGroupSource ? 'info' : 'default'} 
                  header={
                    <BarGraphHeader 
                      name={this.props.name}
                      dimensionKeys={_.map(dimension.serie, 'key')}
                      total={dimension.total}
                      comparingTo={comparing && comparing.serie}
                      dimension={dimension.serie}
                      selectedItems={this.props.selected}
                      onSearch={this.onSearch}
                      filter={filter}
                      size={_.size(dimension.serie)}
                      onStretch={!isGroupSource && this.onStretch}
                      stretched={!isGroupSource && this.state.stretched}
                      onChange={this.onChange}
                      group={this.props.group}/>} 
                    >
                {filter ?
                  <div className="bar-graph-group__search-help">Search result for "{filter}"</div>
                :
                  null
                }
                <BarList
                  name={this.props.name}
                  dimension={dimension}
                  filter={filter}
                  comparingTo={comparing}
                  group={this.props.group}
                  stretched={this.state.stretched}
                  lookup={this.props.lookup}
                  selected={this.props.selected}
                  onChange={this.onChange}
                  getColor={this.props.getColor}  />
              </Panel>
  }
}
