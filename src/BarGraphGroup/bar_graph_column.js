// @flow

// TODO remove lodash
import _map from 'lodash/map'

import React from 'react'

import BarGraph from '../BarGraph'

export default class BarGraphColumn extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      stretched: [],
      search: []
    }
  }

  onStretch = serie => () => {
    this.setState({
      stretched: Object.assign({}, this.state.stretched, {
        [this.props.name + serie]: !this.state.stretched[this.props.name + serie]
      })
    })
  };

  onSearch = serie => e => {
    const search = e.target.value
    if (search.length) {
      try {
        new RegExp(search, 'i')
        this.setState({
          search: Object.assign({}, this.state.search, {
            [serie]: search
          })
        })
      } catch (e) {
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
  };

  render() {
    return (
      <div className="cube_graph__column">
        {_map(this.props.data, (serie, key) => {
          const description = this.props.dataDescription ? this.props.dataDescription[key] : undefined

          return (
            <div key={key} className={'bar-graph-group__list'}>
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
          )
        })}
      </div>
    )
  }
}
