// @flow

import _ from 'lodash'
import React from 'react'
import { Glyphicon } from 'react-bootstrap'

import * as d3 from 'd3'

import './style/BarGraph.scss'

const numberFormat = d3.format(",d")

const getCommonPrefix = (array) => {
    // return empty string for arrays withe less then two elements
  if (!array || array.length <= 1)
    return ''
            // Sorting an array and comparing the first and last elements
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

  props: {
    count: number,
    stack: Object,
    max: number,
    group: string,
    getColor: Function,
    serie: Object,
    proportion: number,
  }

  shouldComponentUpdate(){
    return true;
  }
  
  render(){
    let bars = []
    const limit = 5
    let amount = this.props.count
    const highlights = _.chain(this.props.stack).sortBy('c').reverse().slice(0,limit).map('name').value()

    _.mapValues(this.props.stack, (bar, i) => {
                      if(highlights.includes(bar.name)){
                        amount -= bar.c
                        let proportion = this.props.max > 0 ? bar.c/this.props.max : 0
                        let width = `${(proportion*100)}%`
                        bars.push(<div key={bar.name+this.props.group} title={`${bar.name}: ${numberFormat(bar.c)} (${(bar.c/this.props.count*100).toFixed(3)}%)`} className="bar-graph__bar" style={{width: width, backgroundColor: this.props.getColor(i, this.props.group||this.props.serie) }}></div>)
                      } 
                    })

    if(amount > 0){
      let percentage = this.props.max > 0 ? amount/this.props.max*100 : 0
      let width = `${(percentage)}%`
      bars.push(<div title={`others: ${numberFormat(amount)}, (${(amount/this.props.count*100).toFixed(3)}%)`} key={'others'+this.props.group} className="bar-graph__bar" style={{width: width, backgroundColor: this.props.getColor('other') }}></div>)
    }

    return <div className="bar-graph__bar-wrap">
            {bars}
            <span className="bar-graph__bar__percentage">{`${(this.props.proportion*100).toFixed(3)}%`}</span>
           </div>
  }
}

class BarContainer extends React.Component {
  props: {
    changeSelection: Function,
    container: any,
    count: number,
    getColor: Function,
    group: string,
    label: string,
    max: number,
    selected: true,
    serie: any,
    stack: any,
    stretched: boolean,
    volume: number,
    window: any,
    windowVolume: number,
  }

  shouldComponentUpdate(){
    return true;
  }

  getIcon(val1, val2){
    let percentage = (Math.abs(1-val1/val2)*100).toFixed(1)
    if(val1 > val2){
      return <div className="bar-graph__variation__wrapper"><span className="bar-graph__variation--up"><Glyphicon glyph="arrow-up" />{isFinite(percentage) ? <span className="variation__icon">{`${percentage}% `}</span> : <span className="variation__icon--infinity">∞</span>}</span></div>
    } else if(val2 > val1){
      return <div className="bar-graph__variation__wrapper"><span className="bar-graph__variation--down"><Glyphicon glyph="arrow-down" />{isFinite(percentage) ? <span className="variation__icon">{`${percentage}% `}</span> : <span className="variation__icon--infinity">∞</span>}</span></div>
    } else {
      return <div className="bar-graph__variation__wrapper"><span className="bar-graph__variation"><Glyphicon glyph="option-horizontal" /></span></div>
    }
  }

  render(){

    return <div className={'bar-graph' + (this.props.selected ? ' selected' : '')} onClick={this.props.changeSelection}>
            {this.props.window ? this.getIcon(this.props.count, this.props.window.count) : null }
            <div className="bar-graph__label__wrapper">
                  <div className="bar-graph__label">
                  {this.props.label}
                  </div>
            </div>
            {this.props.window ? 
              <div className="bar-graph__value__wrapper">
                <div className={`bar-graph__value`}>
                  {numberFormat(this.props.window.count||0)}
                </div>
                <div className={`bar-graph__value`}>
                  {numberFormat(this.props.count||0)}
                </div>
              </div>
            : 
            <div className="bar-graph__value__wrapper">
              <div className="bar-graph__value">{numberFormat(this.props.count||0)}</div>
            </div>}  
            <div className="bar-graph__bar-container__wrapper">
              <div className="bar-graph__bar-container">
                {this.props.window ? 
                  <Bar key="window" stack={this.props.window.stack} 
                       container={this.props.container} 
                       count={this.props.window.count} 
                       group={this.props.group}
                       serie={this.props.serie} 
                       max={this.props.stretched ? this.props.window.count : this.props.max} 
                       getColor={this.props.getColor}
                       proportion={(this.props.windowVolume > 0  && this.props.window.count > 0 ? ((this.props.window.count||0)/this.props.windowVolume) : 0)}/>
                : null}
                <Bar stack={this.props.stack} 
                     container={this.props.container} 
                     count={this.props.count} 
                     group={this.props.group}
                     serie={this.props.serie}
                     max={this.props.stretched ? this.props.count : this.props.max} 
                     getColor={this.props.getColor}
                     proportion={(this.props.volume > 0  && this.props.count > 0 ? ((this.props.count||0)/this.props.volume) : 0)}/>
              </div>
            </div>
          </div>
  }
}


export default class BarGraph extends React.Component {
  props: {
    data: Object,
    getColor: Function,
    group: string,
    serie: Object,
    stretched: boolean,
    volume: number,
    windowData: Object,
    windowVolume: number,
  }

  shouldComponentUpdate(){
    return true;
  }

  render(){
    if (this.props.data.length) {
      const max = _.max(this.props.data, 'count').count
      const maxWindow = this.props.windowData && _.max(this.props.windowData, 'count') ? _.max(this.props.windowData, 'count').count : 0
      const prefix = getCommonPrefix(_.map(this.props.data.filter((d) => { return d.name!=='<not defined>'}), 'name'));
      return <div className="cube_bars__list__content">
              {_.map(this.props.data, (d, i) => {
                return <BarContainer 
                          key={d.key}
                          serie={this.props.serie}
                          label={d.name.startsWith(prefix)?d.name.substring(prefix.length):d.name}
                          volume={this.props.volume}
                          windowVolume={this.props.windowVolume}
                          max={Math.max(max, maxWindow)}
                          count={d.count}
                          stack={d.stack}
                          group={this.props.group}
                          stretched={this.props.stretched}
                          container={this}
                          changeSelection={d.changeSelection}
                          window={this.props.windowData ? this.props.windowData[d.key] ? this.props.windowData[d.key] : {count: 0} : null }
                          getColor={this.props.getColor}
                          selected={d.selected} />
              })}
            </div>
    } else {
      return <div className="cube_bars__list__content--empty">No dimension available</div>
    }
  }
}
