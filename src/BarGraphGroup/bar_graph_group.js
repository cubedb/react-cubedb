// @flow

import _ from 'lodash';
import { scaleOrdinal, schemeCategory20c } from 'd3';
import React from 'react';
import PropTypes from 'prop-types';

import BarGraphColumn from './bar_graph_column';

import '../style/BarGraphGroup.scss';

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
  };

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
  };

  getColumns = () => {
    return this.props.columns || Math.floor(this.props.width / 420);
  };

  render() {
    let n = 0;
    const content = _(this.props.data)
      .toPairs()
      .sortBy(p => {
        const index = this.props.fieldOrders.indexOf(p[0]);
        if (index < 0) return 99999;
        else return index;
      })
      .groupBy(() => {
        return n++ % this.getColumns();
      })
      .map(g => {
        const key = _.reduce(g, (k, e) => {
          return k + e[0];
        });
        return (
          <BarGraphColumn
            key={key}
            data={_.fromPairs(g)}
            dataDescription={this.props.dataDescription}
            allData={this.props.data}
            comparingTo={this.props.comparingTo}
            lookup={this.props.lookup}
            group={this.props.group}
            onChange={this.props.onChange}
            slice={this.props.slice}
            selectedItems={this.props.selectedItems}
            getColor={this.props.getColor}
          />
        );
      })
      .value();

    return <div className="bar-graph-group">{content}</div>;
  }
}
