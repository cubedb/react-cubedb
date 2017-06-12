import React from 'react'
import _ from 'lodash'
import { Glyphicon } from 'react-bootstrap'


import './style/Filters.scss'

export default class Filters extends React.Component {

  static propTypes = {
    lookup: React.PropTypes.func,
    onChange: React.PropTypes.func,
    getColor: React.PropTypes.func,
    group: React.PropTypes.string,
    filters: React.PropTypes.object,
    aggregation: React.PropTypes.string,
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
                      <span className="graph-filters__element__icon">
                        <Glyphicon glyph={ aggregation == 'day' ? 'calendar' : 'time'}/>
                      </span> {aggregation}
                    </span>)
    }

    if(group) {
      filterEl.push(<span className="graph-filters__element" 
                           key={'group'}>
                      <span className="graph-filters__element__icon">
                        <Glyphicon glyph="indent-left"/>
                      </span> split by {(group)}
                    </span>)
    }

           
    _.map(filters, (f, dimension) => {
      _.map(f, (value, i) => {
        let iconEl = <span className="graph-filters__element__icon">
                       <Glyphicon glyph="filter"/>
                     </span>
        if(getColor) {
          iconEl = <span className="graph-filters__element__color" style={{backgroundColor: this.props.getColor(value, dimension) }} />
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
