// @flow

import _ from 'lodash';
import * as d3 from 'd3';

import ReactFauxDOM from 'react-faux-dom';

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import TimeGraphContent from './TimeGraphContent';
import { saveData, dateParser } from './utils';

import './style/TimeGraph.scss';

const xTickSize = {
  month: 105,
  day: 85,
  hour: 105
};

const numberFormat = d3.format(',d');
const DEFAULT_MARGIN = { left: 80, right: 30, top: 50, bottom: 25 };
const STACK_LIMIT = 10;
const MAX_Y_AXIS_TICKS = 5;

export const aggregation = {
  hour: d3.utcHour,
  day: d3.utcDay,
  month: d3.utcMonth
};

export default class TimeGraph extends React.Component {
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    data: PropTypes.object,
    hideMetadata: PropTypes.bool,
    metadata: PropTypes.object,
    timeDisplay: PropTypes.func.isRequired,
    countFormatter: PropTypes.func,
    lookup: PropTypes.func,
    filter: PropTypes.array,
    comparing: PropTypes.bool,
    onClickCompare: PropTypes.any,
    onChange: PropTypes.func,
    group: PropTypes.string,
    type: PropTypes.string,
    getColor: PropTypes.func,
    aggregation: PropTypes.string.isRequired,
    mouseIteractions: PropTypes.bool,
    toDate: PropTypes.any,
    fromDate: PropTypes.any
  };

  static defaultProps = {
    mouseIteractions: true,
    type: 'bar',
    getColor: d3.scaleOrdinal(d3.schemeCategory20c)
  };

  constructor(props) {
    super(props);
    this.setP = this.setP.bind(this);

    this.state = {
      width: 600,
      height: 260,
      comparing: false,
      metadataFilter: {
        release: false,
        experiment: false
      }
    };
  }

  componentDidMount() {
    this.updateDimensions();
  }

  componentWillMount() {
    window.addEventListener('resize', this.updateDimensions, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  componentWillReceiveProps(np) {
    this.updateDimensions(np);
  }

  updateDimensions = (np = this.props) => {
    const el = ReactDOM.findDOMNode(this);
    const containerWidth = el.parentElement ? el.parentElement.getBoundingClientRect().width : 600;

    if (containerWidth) {
      this.setState({
        width: np.width ? np.width : containerWidth,
        height: np.height ? np.height : Math.max(containerWidth * 0.2, 260)
      });
    }
  };

  onDownload = (fromDate, toDate, volume, dataSerie) => () => {
    const dataLabel = `${this.props.timeDisplay(fromDate)}_to_${this.props.timeDisplay(toDate)}`.replace(/\W/gi, '');
    const defaultDimension = { c: 0 };
    let stacksLabel = '';
    const delimiter = ',';
    const endLine = '\r\n';

    const keys = {};

    _(dataSerie)
      .map(1)
      .map('stack')
      .each(d => {
        _.each(d, (n, k) => {
          keys[k] = n.name;
        });
      });

    const createLine = (name, count = 0, stack = []) => {
      let stacks = '';

      if (this.props.group) {
        _.each(keys, (d, i) => {
          stacks += `${delimiter}${(stack[i] || defaultDimension).c}`;
        });
      }

      stacks += `${delimiter}${count}`;

      return `${name}${stacks}${endLine}`;
    };

    const body = _(dataSerie)
      .sortBy(0)
      .map(d => {
        return createLine(d[0], d[1].c, d[1].stack);
      })
      .join('');

    if (this.props.group) {
      _.each(keys, d => {
        stacksLabel += `${delimiter}${d}`;
      });
    }

    stacksLabel += `${delimiter}total`;

    const header = `Date${stacksLabel}${endLine}`;
    const fileData = header + body;

    const file = new Blob([fileData], { type: 'text/plain' });

    saveData(`timeseries_${dataLabel}${this.props.group ? `_grouped_by_${this.props.group}` : ''}.csv`, file);
  };

  lookup(p) {
    const defaultLookup = key => {
      return key === 'null' ? '<not defined>' : key;
    };
    if (this.props.lookups && this.props.lookups[p]) {
      const lookup = this.props.lookups[p];
      return key => {
        return lookup[key] || defaultLookup(key);
      };
    } else return defaultLookup;
  }

  toggleMetadata = type => () => {
    this.setState({
      metadataFilter: Object.assign({}, this.state.metadataFilter, {
        [type]: !this.state.metadataFilter[type]
      })
    });
  };

  drawAxis(width, height, data, margin, fromDate, toDate, xFormatter, yFormatter = numberFormat) {
    const dateRange = [
      aggregation[this.props.aggregation].floor(fromDate),
      aggregation[this.props.aggregation].offset(toDate, this.props.type === 'bar' ? +1 : 0)
    ];

    let maxValue = _(data)
      .map('1')
      .map('c')
      .max();

    if (this.props.group) {
      const dimensionCount = {};

      _.each(data, d => {
        _.each(d[1].stack, (b, k) => {
          dimensionCount[k] = {
            key: k,
            c: dimensionCount[k] ? dimensionCount[k].c + b.c : b.c
          };
        });
      });

      const stacks = _(dimensionCount)
        .sortBy('c')
        .reverse()
        .slice(0, STACK_LIMIT)
        .map('key')
        .value();

      if (this.props.type === 'line') {
        maxValue = _(data)
          .map('1')
          .map(d => {
            const stacksC = _(d.stack)
              .mapValues('c')
              .value();

            const stacksValue = _(stacksC)
              .filter((d, k) => {
                return stacks.indexOf(k) > -1;
              })
              .value();

            const otherSum = _(stacksC)
              .filter((d, k) => {
                return stacks.indexOf(k) < 0;
              })
              .sum();

            return _(stacksValue)
              .concat(otherSum)
              .max();
          })
          .max();
      }
    }

    const valueRange = [0, 1.1 * maxValue];

    const maxTicks = Math.max(
      2,
      Math.floor((width - margin.left - margin.right) / xTickSize[this.props.aggregation]) - 4
    );

    const x = d3
      .scaleTime()
      .domain(dateRange)
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain(valueRange)
      .rangeRound([height - margin.bottom, margin.top]);

    const xAxis = d3
      .axisBottom(x)
      .tickFormat(xFormatter)
      .ticks(maxTicks);

    const yAxis = d3
      .axisLeft(y)
      .tickFormat(yFormatter)
      .ticks(maxValue < MAX_Y_AXIS_TICKS ? maxValue : MAX_Y_AXIS_TICKS)
      .tickSize(-width + margin.right + margin.left);

    const lineFunc = d3
      .line()
      .x(function(d) {
        return x(d[0]);
      })
      .y(function(d) {
        return y(d[1]);
      })
      .curve(d3.curveStep);

    return {
      lineFunc: lineFunc,
      scale: { x: x, y: y },
      axis: { x: xAxis, y: yAxis }
    };
  }

  preProcess(data, timeBounds) {
    return _(this.props.data)
      .toPairs()
      .map(p => {
        const dt = aggregation[this.props.aggregation](dateParser(p[0]));
        if (p[1].hasOwnProperty('c')) {
          return [dt, p[1]];
        } else {
          let c = 0;
          _.each(p[1], (e, k) => {
            c += e.c;
            e.name = this.lookup(this.props.group)(k);
          });
          const dimension = {
            c: c,
            stack: p[1]
          };
          return [dt, dimension];
        }
      })
      .filter(p => {
        return p[0] >= timeBounds[0];
      })
      .value();
  }

  setP = range => {
    range.sort();
    this.props.onChange(range);
  };

  getDateDomain() {
    const dates = _(this.props.data)
      .map((p, k) => {
        return aggregation[this.props.aggregation](dateParser(k));
      })
      .sortBy(dt => dt.getTime())
      .value();

    return [dates[0], dates[dates.length - 1]];
  }

  render() {
    if (!_.size(this.props.data)) {
      return (
        <svg width={this.state.width} height={this.state.height}>
          <text x="50%" y="50%" alignmentBaseline="middle" textAnchor="middle">
            no data to render
          </text>
        </svg>
      );
    }

    let [fromDate, toDate] = this.getDateDomain();
    if (this.props.toDate) {
      toDate = this.props.toDate;
      if (typeof toDate === 'number') {
        toDate = aggregation[this.props.aggregation](dateParser(toDate));
      }
    }
    if (this.props.fromDate) {
      fromDate = this.props.fromDate;
      if (typeof fromDate === 'number') {
        fromDate = aggregation[this.props.aggregation](dateParser(fromDate));
      }
    }

    const margin = Object.assign({}, DEFAULT_MARGIN, this.props.margin);

    const data = this.preProcess(this.props.data, [fromDate, toDate]);
    const graph = this.drawAxis(
      this.state.width,
      this.state.height,
      data,
      margin,
      fromDate,
      toDate,
      this.props.timeDisplay,
      this.props.countFormatter
    );
    const xAxis = new ReactFauxDOM.Element('g');

    d3.select(xAxis)
      .attr('class', 'xaxis')
      .attr('transform', `translate(0, ${this.state.height - margin.bottom})`)
      .call(graph.axis.x);

    const yAxis = new ReactFauxDOM.Element('g');
    d3.select(yAxis)
      .attr('class', 'yaxis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(graph.axis.y);

    let range;
    if (this.props.filter) {
      range = _.chain(this.props.filter)
        .map(v => {
          return aggregation[this.props.aggregation](dateParser(v));
        })
        .value();
    }

    const metadata = {};
    if (this.props.metadata) {
      _.each(this.props.metadata, ({ date, data }, mk) => {
        let hasData = false;
        const filteredData = {};
        _.each(data, (d, k) => {
          if (this.state.metadataFilter[d.type]) {
            hasData = true;
            filteredData[k] = d;
          }
        });
        if (hasData) {
          metadata[mk] = {
            date,
            data: filteredData
          };
        }
      });
    }

    return (
      <svg className="time_graph" width={this.state.width} height={this.state.height}>
        <g className="axis">
          <g>{xAxis.toReact()}</g>
          <g>{yAxis.toReact()}</g>
        </g>
        <g onClick={this.onDownload(fromDate, toDate, this.maxValue, data)}>
          <rect
            className={'time_graph__download-button'}
            width={20}
            height={20}
            transform={`translate(${this.state.width - margin.right - 20}, 3)`}
          />
          <path
            className={'time_graph__download-button__icon'}
            transform={`matrix(.5 0 0 .5 ${this.state.width - margin.right - 17} 5)`}
            d="M22.857 24q0-0.464-0.339-0.804t-0.804-0.339-0.804 0.339-0.339 0.804 0.339 0.804 0.804 0.339 0.804-0.339 0.339-0.804zM27.429 24q0-0.464-0.339-0.804t-0.804-0.339-0.804 0.339-0.339 0.804 0.339 0.804 0.804 0.339 0.804-0.339 0.339-0.804zM29.714 20v5.714q0 0.714-0.5 1.214t-1.214 0.5h-26.286q-0.714 0-1.214-0.5t-0.5-1.214v-5.714q0-0.714 0.5-1.214t1.214-0.5h8.304l2.411 2.429q1.036 1 2.429 1t2.429-1l2.429-2.429h8.286q0.714 0 1.214 0.5t0.5 1.214zM23.911 9.839q0.304 0.732-0.25 1.25l-8 8q-0.321 0.339-0.804 0.339t-0.804-0.339l-8-8q-0.554-0.518-0.25-1.25 0.304-0.696 1.054-0.696h4.571v-8q0-0.464 0.339-0.804t0.804-0.339h4.571q0.464 0 0.804 0.339t0.339 0.804v8h4.571q0.75 0 1.054 0.696z"
            fill="#000000"
          />
        </g>
        {this.props.metadata && (
          <g onClick={this.toggleMetadata('release')}>
            <rect
              className={'time_graph__metadata-button'}
              width={70}
              height={14}
              transform={`translate(${this.state.width - margin.right - 100}, 5)`}
            />
            <text
              className={'time_graph__metadata-button__text'}
              style={{ textAnchor: 'left' }}
              width={60}
              height={12}
              transform={`translate(${this.state.width - margin.right - 94}, 15)`}
            >
              {this.state.metadataFilter.release ? 'Hide' : 'Show'} Releases
            </text>
          </g>
        )}
        ``
        {this.props.metadata && (
          <g onClick={this.toggleMetadata('experiment')}>
            <rect
              className={'time_graph__metadata-button'}
              width={80}
              height={14}
              transform={`translate(${this.state.width - margin.right - 190}, 5)`}
            />
            <text
              className={'time_graph__metadata-button__text'}
              style={{ textAnchor: 'left' }}
              width={60}
              height={12}
              transform={`translate(${this.state.width - margin.right - 184}, 15)`}
            >
              {this.state.metadataFilter.experiment ? 'Hide' : 'Show'} Experiments
            </text>
          </g>
        )}
        <TimeGraphContent
          xScale={graph.scale.x}
          yScale={graph.scale.y}
          range={range}
          timeDisplay={this.props.timeDisplay}
          aggregation={this.props.aggregation}
          onChange={this.setP}
          onClickCompare={this.props.onClickCompare}
          comparing={this.props.comparing}
          numberFormat={this.props.countFormatter || numberFormat}
          margin={margin}
          data={data}
          group={this.props.group}
          getColor={this.props.getColor}
          type={this.props.type}
          mouseIteractions={this.props.mouseIteractions}
          metadata={this.props.metadata ? metadata : null}
        />
      </svg>
    );
  }
}
