// @flow

import React from 'react'
import PropTypes from 'prop-types'

import { numberFormat } from '../utils'

import Bar from './bar'

export default class BarLine extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    container: PropTypes.any,
    data: PropTypes.object,
    getColor: PropTypes.func,
    group: PropTypes.string,
    label: PropTypes.string,
    max: PropTypes.number,
    selected: PropTypes.bool,
    name: PropTypes.any,
    stretched: PropTypes.bool,
    total: PropTypes.number,
    comparingData: PropTypes.any,
    comparingTotal: PropTypes.number
  };

  shouldComponentUpdate() {
    return true
  }

  getIcon(val1, val2) {
    const percentage = (Math.abs(1 - val1 / val2) * 100).toFixed(1)
    if (val1 > val2) {
      return (
        <div className="bar-graph__variation__wrapper">
          <span className="bar-graph__variation--up">
            {'▲'}
            {isFinite(percentage) ? (
              <span className="variation__icon">{`${percentage}% `}</span>
            ) : (
              <span className="variation__icon--infinity">∞</span>
            )}
          </span>
        </div>
      )
    } else if (val2 > val1) {
      return (
        <div className="bar-graph__variation__wrapper">
          <span className="bar-graph__variation--down">
            {'▼'}
            {isFinite(percentage) ? (
              <span className="variation__icon">{`${percentage}% `}</span>
            ) : (
              <span className="variation__icon--infinity">∞</span>
            )}
          </span>
        </div>
      )
    }

    return (
      <div className="bar-graph__variation__wrapper">
        <span className="bar-graph__variation">{'='}</span>
      </div>
    )
  }

  render() {
    return (
      <div
        className={'bar-graph' + (this.props.selected ? ' selected' : '')}
        onClick={() => this.props.onChange(this.props.name, this.props.data.key)}
      >
        {this.props.comparingData ? this.getIcon(this.props.data.c, this.props.comparingData.c) : null}
        <div className="bar-graph__label__wrapper">
          <div className="bar-graph__label">{this.props.label}</div>
        </div>
        {this.props.comparingData ? (
          <div className="bar-graph__value__wrapper">
            <div className={'bar-graph__value'}>{numberFormat(this.props.comparingData.c || 0)}</div>
            <div className={'bar-graph__value'}>{numberFormat(this.props.data.c || 0)}</div>
          </div>
        ) : (
          <div className="bar-graph__value__wrapper">
            <div className="bar-graph__value">{numberFormat(this.props.data.c || 0)}</div>
          </div>
        )}
        <div className="bar-graph__bar-container__wrapper">
          <div className="bar-graph__bar-container">
            {this.props.comparingData ? (
              <Bar
                key="comparing"
                container={this.props.container}
                data={this.props.comparingData}
                group={this.props.group}
                name={this.props.name}
                max={this.props.stretched ? this.props.comparingData.c : this.props.max}
                getColor={this.props.getColor}
                proportion={
                  this.props.comparingTotal > 0 && this.props.comparingData.c > 0
                    ? (this.props.comparingData.c || 0) / this.props.comparingTotal
                    : 0
                }
              />
            ) : null}
            <Bar
              container={this.props.container}
              data={this.props.data}
              group={this.props.group}
              name={this.props.name}
              max={this.props.stretched ? this.props.data.c : this.props.max}
              getColor={this.props.getColor}
              proportion={
                this.props.total > 0 && this.props.data.c > 0 ? (this.props.data.c || 0) / this.props.total : 0
              }
            />
          </div>
        </div>
      </div>
    )
  }
}
