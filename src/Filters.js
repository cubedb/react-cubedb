// @flow

import React from 'react'
import _ from 'lodash'
import { Glyphicon } from 'react-bootstrap'


import './style/Filters.scss'

export default class Filters extends React.Component {

  props: {
    lookup: Function,
    onChange: Function,
    getColor: Function,
    group: string,
    filters: Object,
    aggregation: string,
  }

  lookup(k,d) {
    return this.props.lookup ? this.props.lookup(k,d) : d
  }

  onClick = (dimension, value) => {
    return () => {
       this.props.onChange && this.props.onChange([dimension])(value)
    }
  }

  render() {
    let filterEl = []
    let {filters, aggregation, group, getColor, onChange} = this.props
                
    if(aggregation) {
      filterEl.push(<span className="graph-filters__element" 
                           key={'aggregation'}>
                      <div className="graph-filters__element__icon">
                        <Glyphicon glyph={ aggregation == 'day' ? 'calendar' : 'time'}/>
                      </div> {aggregation}
                    </span>)
    }

    if(group) {
      filterEl.push(<span className="graph-filters__element" 
                           key={'group'}>
                      <div className="graph-filters__element__icon">
                        <Glyphicon glyph="indent-left"/>
                      </div> split by {(group)}
                    </span>)
    }

           
    _.map(filters, (f, dimension) => {
      _.map(f, (value, i) => {
        let iconEl = <Glyphicon glyph="filter"/>

        if(getColor) {
          iconEl = <div className="graph-filters__element__color" style={{backgroundColor: this.props.getColor(value, dimension) }} />
        }

        filterEl.push(<span className={`graph-filters__element ${_.isUndefined(onChange) ? "" : "graph-filters__element--with-action"}`} 
                        key={'filter-'+dimension+value+i}
                        onClick={this.onClick(dimension, value)}>
                        {iconEl} {dimension}: {this.lookup(dimension, value)} 
                      </span>)
      })
    })

    return <div className="graph-filters">{filterEl}</div>
  }
}
