// @flow

import _mapValues from 'lodash/mapValues';
import _chain from 'lodash/chain';
import React from 'react';

import PropTypes from 'prop-types';

import { numberFormat } from '../utils';

export default class Bar extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    max: PropTypes.number,
    group: PropTypes.string,
    getColor: PropTypes.func,
    name: PropTypes.string,
    proportion: PropTypes.number
  };

  render() {
    const bars = [];
    const limit = 5;
    const { c, name, key, stack } = this.props.data;

    if (this.props.group) {
      const highlights = _chain(stack)
        .sortBy('c')
        .reverse()
        .slice(0, limit)
        .map('key')
        .value();
      let amount = c;
      _mapValues(stack, bar => {
        if (highlights.includes(bar.key)) {
          amount -= bar.c;
          const proportion = this.props.max > 0 ? bar.c / this.props.max : 0;
          const width = `${proportion * 100}%`;
          bars.push(
            <div
              key={bar.key + this.props.group}
              title={`${bar.name}: ${numberFormat(bar.c)} (${((bar.c / c) * 100).toFixed(3)}%)`}
              className="bar-graph__bar"
              style={{
                width: width,
                backgroundColor: this.props.getColor(bar.key, this.props.group)
              }}
            />
          );
        }
      });

      if (amount > 0) {
        const percentage = this.props.max > 0 ? (amount / this.props.max) * 100 : 0;
        const width = `${percentage}%`;
        bars.push(
          <div
            title={`others: ${numberFormat(amount)}, (${((amount / c) * 100).toFixed(3)}%)`}
            key={'others' + this.props.group}
            className="bar-graph__bar"
            style={{
              width: width,
              backgroundColor: this.props.getColor('other')
            }}
          />
        );
      }
    } else {
      const percentage = this.props.max > 0 ? (c / this.props.max) * 100 : 0;
      const width = `${percentage}%`;
      bars.push(
        <div
          title={`${name}: ${numberFormat(c)}`}
          key={key}
          className="bar-graph__bar"
          style={{ width: width, backgroundColor: this.props.getColor(key) }}
        />
      );
    }

    return (
      <div className="bar-graph__bar-wrap">
        {bars}
        <span className="bar-graph__bar__percentage">{`${(this.props.proportion * 100).toFixed(3)}%`}</span>
      </div>
    );
  }
}
