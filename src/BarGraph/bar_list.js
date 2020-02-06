// @flow

// TODO remove lodash
import _ from 'lodash';
import _isEmpty from 'lodash/isEmpty';
import _map from 'lodash/map';

import React from 'react';
import PropTypes from 'prop-types';

import { schemePaired } from 'd3';
import { scaleOrdinal } from 'd3-scale';

import { getCommonPrefix } from '../utils';

import BarLine from './bar_line';

export default class BarList extends React.Component {
  static propTypes = {
    dimension: PropTypes.object,
    slice: PropTypes.number,
    hideCommonPrefix: PropTypes.bool,
    stretched: PropTypes.bool,
    filter: PropTypes.string,
    getColor: PropTypes.func,
    group: PropTypes.string,
    name: PropTypes.string,
    comparingTo: PropTypes.object,
    lookup: PropTypes.object,
    selected: PropTypes.array
  };

  static defaultProps = {
    hideCommonPrefix: false,
    stretched: false,
    getColor: scaleOrdinal(schemePaired)
  };

  // shouldComponentUpdate(){
  //   return true;
  // }

  render() {
    const { serie, max, total } = this.props.dimension;
    if (!_isEmpty(serie)) {
      const comparingMax = this.props.comparingTo ? this.props.comparingTo.max : 0;
      const prefix = this.props.hideCommonPrefix
        ? getCommonPrefix(
            _map(this.props.data, d => {
              if (d.name !== '<not defined>') return d.name;
            })
          )
        : '';

      return (
        <div className="cube_bars__list__content">
          {_(serie)
            .sortBy('c')
            .reverse()
            .filter(d => !this.props.filter || RegExp(this.props.filter, 'i').test(d.name))
            .slice(0, this.props.slice || serie.length)
            .map(d => {
              let comparingData = null;
              if (this.props.comparingTo && this.props.comparingTo.serie) {
                comparingData = this.props.comparingTo.serie[d.key] ? this.props.comparingTo.serie[d.key] : { c: 0 };
              }
              return (
                <BarLine
                  key={d.key}
                  name={this.props.name}
                  label={prefix ? (d.name.startsWith(prefix) ? d.name.substring(prefix.length) : d.name) : d.name}
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
                  selected={this.props.selected.indexOf(d.key) >= 0}
                />
              );
            })
            .value()}
        </div>
      );
    }

    return <div className="cube_bars__list__content--empty">No dimension available</div>;
  }
}
