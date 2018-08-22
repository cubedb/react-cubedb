import _ from "lodash";
import * as d3 from "d3";

import React from "react";
import PropTypes from "prop-types";

import dateParser from "./utils/dateParser";
import { aggregation } from "./TimeGraph";

const BAR_MARGIN = 1;
const STACK_LIMIT = 10;

export default class TimeGraphContent extends React.Component {
  constructor(props) {
    super(props);

    const defaultMousePos =
      this.props.range &&
      this.props.xScale(this.props.range[0]) >= this.props.xScale.range()[0] &&
      this.props.xScale(this.props.range[1]) <= this.props.xScale.range()[1]
        ? this.props.xScale(this.props.range[0])
        : this.props.xScale.range()[0];

    let range = [];

    if (this.props.range && this.props.range[1]) {
      range = [
        this.roundDate(this.props.range[0]),
        this.roundDate(this.props.range[1])
      ];
    }

    this.state = {
      overlayVisible: !!this.props.range,
      range,
      mousePressed: false,
      focused: false,
      dragging: false,
      mark: { x: defaultMousePos, y: 0 },
      date: this.roundDate(this.props.xScale.invert(defaultMousePos)),
      visibleMetadata: null,
      clickPos: 0
    };

    this.flattenData = [];

    this.onMouseClick = this.props.mouseIteractions
      ? this.onMouseClick.bind(this)
      : () => {};
    this.onMouseMove = this.props.mouseIteractions
      ? this.onMouseMove.bind(this)
      : () => {};
    this.onMouseLeave = this.props.mouseIteractions
      ? this.onMouseLeave.bind(this)
      : () => {};
    this.onMouseEnter = this.props.mouseIteractions
      ? this.onMouseEnter.bind(this)
      : () => {};
    this.onMouseRelease = this.props.mouseIteractions
      ? this.onMouseRelease.bind(this)
      : () => {};
    if (!this.props.onClickCompare) {
      this.allowComparing = false;
    } else {
      this.allowComparing = true;
      this.onClickCompare = this.props.mouseIteractions
        ? this.onClickCompare.bind(this)
        : () => {};
    }
    this.onChange = this.props.mouseIteractions
      ? _.debounce(this.onChange, 100)
      : () => {};
  }

  getTextWidth(text, fontSize = 14, fontFace = "Arial") {
    var a = document.createElement("canvas");
    var b = a.getContext("2d");
    b.font = fontSize + "px " + fontFace;
    return b.measureText(text).width;
  }

  getXY(e) {
    const rect = e.target.getBoundingClientRect();
    const xy = {
      x: e.clientX - rect.left + this.props.xScale.range()[0],
      y: e.clientY - rect.top + this.props.margin.top
    };
    return xy;
  }

  roundDate(date) {
    return aggregation[this.props.aggregation](date);
  }

  onMouseEnter(e) {
    e.preventDefault();
    this.setState({
      focused: true
    });
  }

  onMouseLeave(e) {
    if (this.state.mousePressed || this.state.dragging) {
      this.onMouseRelease(e);
    } else {
      e.preventDefault();
    }
    this.setState({
      focused: false
    });
  }

  onMouseClick(e) {
    e.preventDefault();
    if (this.allowComparing) {
      let dragging = false;
      let range = this.state.range;
      const xy = this.getXY(e);
      const x = this.roundDate(this.props.xScale.invert(xy.x));

      if (
        this.state.overlayVisible &&
        this.state.focused &&
        (range.length && x >= Math.min(...range) && x <= Math.max(...range))
      ) {
        dragging = true;
      } else {
        range = [x];
      }

      this.setState({
        mousePressed: true,
        range,
        clickPos: xy.x,
        dragging,
        overlayVisible: dragging || this.state.overlayVisible
      });
    }
  }

  onMouseMove(e) {
    e.preventDefault();
    const xy = this.getXY(e);
    const mark = xy;
    const date = this.roundDate(this.props.xScale.invert(mark.x));

    if (this.state.mousePressed) {
      this.setRange(mark.x, this.state.dragging);
    } else {
      this.setState({
        date,
        mark
      });
    }
  }

  setRange(end, dragging, forcedStart) {
    let newRange = this.state.range;
    const firstPos = forcedStart || this.state.clickPos;
    const last = this.state.mark.x;

    if (dragging) {
      const diff =
        this.props.xScale.invert(end).getTime() -
        this.props.xScale.invert(firstPos).getTime();
      const rangeInterval = newRange[1].getTime() - newRange[0].getTime();
      const newStart =
        newRange[0].getTime() +
        diff -
        (this.props.xScale.invert(last).getTime() -
          this.props.xScale.invert(firstPos).getTime());
      const newEnd = newStart + rangeInterval;
      const startDate = this.roundDate(Math.min(newStart, newEnd));
      const endDate = this.roundDate(Math.max(newStart, newEnd));

      if (this.props.comparing) {
        if (
          dateParser(startDate - rangeInterval) >=
            this.props.xScale.invert(this.props.xScale.range()[0]) &&
          endDate <= this.props.xScale.invert(this.props.xScale.range()[1])
        ) {
          newRange = [startDate, endDate];
        }
      } else {
        if (
          startDate >= this.props.xScale.invert(this.props.xScale.range()[0]) &&
          endDate <= this.props.xScale.invert(this.props.xScale.range()[1])
        ) {
          newRange = [startDate, endDate];
        }
      }
    } else {
      newRange[1] = this.roundDate(this.props.xScale.invert(end));
    }

    if (Math.abs(end - firstPos) > 10) {
      this.setState({
        mark: Object.assign({}, this.state.mark, {
          x: end
        }),
        range: newRange,
        overlayVisible: true
      });
      return newRange;
    }
  }

  onMouseRelease(e) {
    e.preventDefault();
    if (this.allowComparing) {
      const xy = this.getXY(e);
      const firstPos = this.state.clickPos;
      let overlayVisible = this.state.overlayVisible;
      let range = this.state.range;
      let dragging = this.state.dragging;

      this.setRange(xy.x, this.state.dragging);

      if (Math.abs(xy.x - firstPos) > 10) {
        this.onChange(range);
        dragging = false;
      } else if (!this.state.dragging && this.state.overlayVisible) {
        range = [];
        this.onChange(range);
        if (this.props.comparing) {
          this.onClickCompare(null)(e);
        }
        overlayVisible = false;
        dragging = false;
      }

      this.setState({
        mousePressed: false,
        dragging,
        clickPos: xy.x,
        overlayVisible,
        range
      });
    }
  }

  formatPeriod = dt => {
    if (Array.isArray(dt) && dt.length) {
      const aggregationTime = aggregation[this.props.aggregation];
      const d0 = aggregationTime.floor(Math.min(...dt));
      const d1 = aggregationTime.ceil(Math.max(...dt));
      return [d0, d1];
    }
    return dt;
  };

  onClickCompare = range => () => {
    if (this.allowComparing) {
      const nextState = range && range.length ? !this.props.comparing : false;
      this.props.onClickCompare(
        nextState,
        nextState ? this.formatPeriod(range) : null
      );
    }
  };

  onChange(range) {
    this.props.onChange(this.formatPeriod(range));
  }

  getInterval() {
    switch (this.props.aggregation) {
      case "day":
        return 7;
      case "hour":
        return 24;
      case "month":
        return 12;
      default:
        return 1;
    }
  }

  countRange(range) {
    switch (this.props.aggregation) {
      case "month":
        return d3.utcMonth.count(range[1], range[0]);
      case "day":
        return d3.utcDay.count(range[1], range[0]);
      default:
        return d3.utcHour.count(range[1], range[0]);
    }
  }

  getYMark() {
    const x0 = this.props.xScale.range()[0];
    const x2 = this.props.xScale.range()[1];

    if (this.state.mark && this.state.focused && !this.state.mousePressed) {
      const date = this.roundDate(this.props.xScale.invert(this.state.mark.x));
      const xPoint = this.props.xScale(date);
      const topDistance = 80;

      if (this.flattenData[date]) {
        const value = this.flattenData[date].c;
        const posY = this.props.yScale(value);
        const labels = this.props.group
          ? _(this.flattenData[date].stack)
              .filter("c")
              .map("name")
              .value()
          : [""];
        const maxValue = (
          _(this.flattenData[date].stack)
            .sortBy(d => {
              return `${d.c}`.length;
            })
            .reverse()
            .head() || this.flattenData[date]
        ).c;
        const rectHeight = this.props.group ? labels.length * 16 : 16;
        const longestLabel =
          _(labels)
            .sortBy("length")
            .value()
            .pop() || "";
        const rectWidth =
          this.getTextWidth(
            `${longestLabel}: ${this.props.numberFormat(maxValue)}`,
            11
          ) + 20;
        let rectPos = Math.min(Math.max(xPoint, x0), x2);

        if (x2 - xPoint < rectWidth) {
          rectPos = rectPos - rectWidth - this.props.margin.right;
        } else {
          rectPos = rectPos + this.props.margin.right;
        }
        let stackN = 0;
        return (
          <g key="y-ruler">
            <line
              className="ruler__mark"
              strokeDasharray="6, 2"
              y1={posY || 0}
              y2={posY || 0}
              x2={x2}
              x1={x0}
            />
            <rect
              className="tooltip__background"
              rx="4"
              ry="4"
              transform={`translate(${rectPos}, ${topDistance - 22})`}
              width={rectWidth}
              height={rectHeight}
            />
            {this.props.group ? (
              _(this.flattenData[date].stack)
                .sortBy("name")
                .reverse()
                .map(e => {
                  if (e.c) {
                    return [
                      <rect
                        key={e.key + "color"}
                        fill={this.props.getColor(e.key, this.props.group)}
                        style={{ textAnchor: "left" }}
                        width={8}
                        height={8}
                        className="tooltip__color"
                        transform={`translate(${rectPos + 4}, ${topDistance +
                          16 * stackN -
                          18})`}
                      />,
                      <text
                        width={rectWidth + 20}
                        height="15"
                        key={e.name}
                        style={{ textAnchor: "left" }}
                        className="tooltip__label"
                        transform={`translate(${rectPos + 14}, ${topDistance +
                          16 * stackN++ -
                          10})`}
                      >
                        {e.name}: {this.props.numberFormat(e.c)}
                      </text>
                    ];
                  }
                })
                .value()
            ) : (
              <text
                width={rectWidth}
                height="15"
                style={{ textAnchor: "middle" }}
                className="tooltip__label"
                transform={`translate(${rectPos +
                  rectWidth / 2}, ${topDistance - 10})`}
              >
                {this.props.numberFormat(value)}
              </text>
            )}
          </g>
        );
      }
    }
  }

  onMouseEnterMetadata = k => () => {
    this.setState({
      visibleMetadata: k
    });
  };

  onMouseLeaveMetadata = () => {
    this.setState({
      visibleMetadata: null
    });
  };

  getMetadatas() {
    const yPos = this.props.yScale.range()[0];
    return _(this.props.metadata)
      .sortBy("date")
      .map((metadatas, k) => {
        const composeDescription = e => {
          return ` ${_.startCase(e.sub_type)} ${e.type} (${e.id}): ${e.name}`;
        };
        const xPos = this.props.xScale(metadatas.date);
        if (xPos >= this.props.xScale.range()[0]) {
          const metadatasKeys = _.keys(metadatas.data);
          const biggerDescriptionLength =
            _(metadatas.data)
              .map(composeDescription)
              .sortBy("length")
              .value()
              .pop() || "";
          const rectWidth = this.getTextWidth(biggerDescriptionLength, 12);
          const types = metadatasKeys.length
            ? _(metadatas.data)
                .map("type")
                .uniq()
                .value()
            : [];
          const specificType = types.length === 1 ? types.pop() : "multiple";
          const rectHeight = (metadatasKeys.length + 1) * 15 + 4;
          let textPos = rectHeight - 20;
          return (
            <g key={k}>
              {this.state.visibleMetadata === k ? (
                <g key={`metadata-${k}`}>
                  <rect
                    className="tooltip__background"
                    rx="4"
                    ry="4"
                    transform={`translate(${xPos - rectWidth / 2}, ${yPos -
                      rectHeight -
                      14})`}
                    width={rectWidth}
                    height={rectHeight}
                  />
                  <text
                    key={k + "-date"}
                    width={rectWidth}
                    height={14}
                    style={{ textAnchor: "left" }}
                    className="tooltip__label--title"
                    transform={`translate(${xPos + 5 - rectWidth / 2}, ${yPos -
                      textPos -
                      21})`}
                  >
                    {this.props.timeDisplay(metadatas.date)}:
                  </text>
                  {_.map(metadatas.data, (ml, id) => {
                    const text = (
                      <text
                        key={k + "-" + id}
                        width={rectWidth}
                        height={14}
                        style={{ textAnchor: "left" }}
                        className="tooltip__label"
                        transform={`translate(${xPos +
                          5 -
                          rectWidth / 2}, ${yPos - textPos - 6})`}
                      >
                        {composeDescription(ml)}
                      </text>
                    );
                    textPos = textPos - 15;
                    return text;
                  })}
                </g>
              ) : null}
              <polygon
                className={`ruler__metadata ruler__metadata--${specificType}`}
                transform={`translate(${xPos - 5}, ${Math.round(yPos - 7)})`}
                points="5 -0.0327148438 10 3.81154584 10 9.96728516 0.164458466 9.96728516 0 3.81154584"
                onMouseEnter={this.onMouseEnterMetadata(k)}
                onMouseLeave={this.onMouseLeaveMetadata}
              />
            </g>
          );
        }
      })
      .value();
  }

  getXMark(date, interval, collateral = false) {
    const x = this.props.xScale;
    const y1 = this.props.yScale.range()[0];
    const y2 = this.props.yScale.range()[1];

    return this.props.xScale
      .ticks(aggregation[this.props.aggregation].every(this.getInterval()))
      .map(dt => {
        const pos = this.props.xScale(dt);
        if (pos > x.range()[0]) {
          if (collateral) {
            return (
              <line
                className="ruler__mark"
                strokeDasharray="2, 2"
                key={"mark-colateral" + pos}
                x1={pos}
                x2={pos}
                y2={y2}
                y1={y1}
              />
            );
          } else {
            return (
              <line
                className="ruler__mark"
                key={"mark" + pos}
                x1={pos}
                x2={pos}
                y2={y2}
                y1={y1}
              />
            );
          }
        }
      });
  }

  getRuler(date0, date1) {
    const aggregationTime = aggregation[this.props.aggregation];
    const x = this.props.xScale;
    const [x0, x1] = x.range();
    let dt = date1 ? Math.min(date0, date1) : date0;
    if (typeof dt === "number") {
      dt = dateParser(dt);
    }
    const start = x(dt);
    const end = date1 ? Math.max(x(date0), x(date1)) : null;
    const label = this.props.timeDisplay(dt);
    const y1 = this.props.yScale.range()[0];
    const y2 = this.props.yScale.range()[1];
    const textAnchor = "middle";
    const pos = start;

    const betterPos = Math.max(Math.min(pos - 60, x1 - 112), x0 - 8);

    const marks = [];
    const interval = end - start;
    const intervalSize = date1
      ? Math.abs(interval)
      : x(aggregationTime.offset(dt, this.getInterval())) - x(dt);

    if (this.state.focused || this.state.overlayVisible) {
      marks.push(
        <g key="ruler">
          <polygon
            key="mark-ruler"
            points="0,0 12, 0 6, 8"
            className="ruler"
            transform={`translate(${pos - 6}, ${this.props.margin.top - 8})`}
          />
          <rect
            className="ruler__background"
            rx="4"
            ry="4"
            transform={`translate(${betterPos}, ${this.props.margin.top - 22})`}
            width="120"
            height="15"
          />
          <text
            key="label-ruler"
            style={{ textAnchor }}
            className="ruler__label"
            transform={`translate(${betterPos + 60}, ${this.props.margin.top -
              11})`}
          >
            {label}
          </text>
          <line
            className="ruler__mark"
            key={"mark" + pos}
            x1={pos}
            x2={pos}
            y2={y2}
            y1={y1}
          />
        </g>
      );
    }

    if (this.allowComparing && date1) {
      const rulerMarkCompare = pos - interval;
      const dateToCompare = [x.invert(rulerMarkCompare), dt];
      const rulerMarkRangeEnd = end;

      if (intervalSize > 60) {
        const intervalLength = Math.abs(this.countRange(this.state.range));
        marks.push(
          <g key="interval-label">
            <text
              key="label-ruler"
              style={{ textAnchor }}
              className="ruler__label"
              width={60}
              transform={`translate(${pos + interval / 2}, ${this.props.margin
                .top + 15})`}
            >{`${intervalLength} ${this.props.aggregation +
              (intervalLength > 1 ? "s" : "")}`}</text>
          </g>
        );
      }

      const markYPos = this.props.margin.top - (intervalSize > 120 ? 22 : 40);
      const markXPos = Math.min(Math.max(intervalSize / 2, 8), 60);

      if (rulerMarkCompare < x.range()[1] && rulerMarkCompare >= x.range()[0]) {
        marks.push(
          <g
            key="ruler-end"
            className="ruler--compare"
            onClick={this.onClickCompare(dateToCompare)}
          >
            <rect
              className="ruler__mark__background"
              rx="4"
              ry="4"
              transform={`translate(${rulerMarkCompare -
                120 +
                markXPos}, ${markYPos})`}
              width="120"
              height="15"
            />
            <polygon
              key="mark-ruler-end"
              points="0,0 12, 0 6, 8"
              className="ruler__helper"
              transform={`translate(${rulerMarkCompare - 6}, ${markYPos + 14})`}
            />
            {this.props.comparing ? (
              <g>
                <circle
                  className="ruler__mark__close__background"
                  cx="6"
                  cy="6"
                  r="6"
                  transform={`translate(${rulerMarkCompare -
                    4 +
                    markXPos}, ${markYPos - 6})`}
                />
                <path
                  className="ruler__mark__close"
                  transform={`translate(${rulerMarkCompare -
                    2 +
                    markXPos}, ${markYPos - 4})`}
                  d="M 2,2 L 6,6 M 6,2 L 2,6"
                />
              </g>
            ) : null}
            <text
              key="label-ruler-end"
              className="ruler__label"
              style={{ textAnchor }}
              transform={`translate(${rulerMarkCompare -
                60 +
                markXPos}, ${markYPos + 12})`}
            >
              {this.props.comparing
                ? this.props.timeDisplay(x.invert(rulerMarkCompare))
                : "click to compare"}
            </text>
            <line
              className="ruler__mark"
              key={"mark" + rulerMarkCompare}
              x1={rulerMarkCompare}
              x2={rulerMarkCompare}
              y2={y2}
              y1={y1}
            />
          </g>
        );
      }

      if (rulerMarkRangeEnd > x.range()[0]) {
        marks.push(
          <g key="ruler-start">
            <rect
              className="ruler__mark__background"
              rx="4"
              ry="4"
              transform={`translate(${rulerMarkRangeEnd -
                markXPos}, ${markYPos})`}
              width="120"
              height="15"
            />
            <polygon
              key="mark-ruler-start"
              points="0,0 12, 0 6, 8"
              className="ruler__helper"
              transform={`translate(${rulerMarkRangeEnd - 6}, ${markYPos +
                14})`}
            />
            <line
              className="ruler__mark"
              key={"mark" + rulerMarkRangeEnd}
              x1={rulerMarkRangeEnd}
              x2={rulerMarkRangeEnd}
              y2={y2}
              y1={y1}
            />
            <text
              key="label-ruler-start"
              className="ruler__label"
              style={{ textAnchor }}
              transform={`translate(${rulerMarkRangeEnd +
                60 -
                markXPos}, ${markYPos + 12})`}
            >
              {this.props.timeDisplay(x.invert(rulerMarkRangeEnd))}
            </text>
          </g>
        );
      }
    }

    return marks;
  }

  getArea = () => {
    const baseY = this.props.yScale.range()[0];
    let stacks = [];
    const series = {};

    const addSerie = (serie, val) => {
      if (!series[serie]) {
        series[serie] = Object.assign({}, defaultSerie);
      }
      series[serie][val.x] = val;
    };

    const valueArea = d3
      .area()
      .x(d => d.x)
      .y0(d => d.y0)
      .y1(d => d.y1);

    const defaultSerie = _.transform(
      this.props.xScale.ticks(aggregation[this.props.aggregation].every(1)),
      (obj, dt) => {
        const x = this.props.xScale(dt);
        obj[x] = {
          x,
          y0: baseY,
          y1: baseY
        };
        return obj;
      },
      {}
    );

    if (this.props.group) {
      const dimensionCount = {};
      _.each(this.props.data, d => {
        const x = this.props.xScale(d[0]);
        const maxY = this.props.yScale(d[1].c);
        defaultSerie[x] = {
          x,
          y0: maxY,
          y1: maxY
        };
        _.each(d[1].stack, (b, k) => {
          dimensionCount[k] = {
            key: k,
            c: dimensionCount[k] ? dimensionCount[k].c + b.c : b.c
          };
        });
      });

      stacks = _(dimensionCount)
        .sortBy("c")
        .reverse()
        .slice(0, STACK_LIMIT)
        .map("key")
        .value();
    }

    this.flattenData = [];
    _(this.props.data).each(d => {
      const dt = aggregation[this.props.aggregation](d[0]);
      const xPos = this.props.xScale(dt);
      const x = xPos;

      this.flattenData[dt] = {
        c: d[1].c,
        stack: []
      };

      if (d[1].stack) {
        let amount = d[1].c;
        let currentY = this.props.yScale(amount);

        _(stacks).each(k => {
          const e = d[1].stack[k];
          if (e) {
            this.flattenData[dt].stack.push({
              c: e.c,
              name: e.name,
              key: k
            });
            amount -= e.c;
          }
          const y1 = currentY;
          currentY = this.props.yScale(amount);
          const y0 = currentY;
          addSerie(k, { x, y0, y1 });
        });

        const y1 = this.props.yScale(amount);
        const y0 = baseY;
        addSerie("other", { x, y0, y1 });
        if (amount > 0) {
          this.flattenData[dt].stack.push({
            name: "other",
            key: "other",
            c: amount
          });
        }
      } else {
        const y = this.props.yScale(d[1].c);
        addSerie(0, { x, y1: y, y0: baseY });
      }
    });

    const paths = _.map(series, (serie, k) => {
      const sortedSerie = _.sortBy(serie, "x");
      const color = this.props.getColor(k, this.props.group);
      return (
        <path
          key={k}
          d={valueArea(sortedSerie)}
          fill={color}
          stroke={color}
          className="area"
          title={k}
        />
      );
    });
    return paths;
  };

  getLines = () => {
    const baseY = this.props.yScale.range()[0];
    let stacks = [];
    const series = {};

    const defaultSerie = _.transform(
      this.props.xScale.ticks(aggregation[this.props.aggregation].every(1)),
      (obj, dt) => {
        const x = this.props.xScale(dt);
        obj[x] = {
          x,
          y: baseY
        };
        return obj;
      },
      {}
    );

    const addSerie = (serie, val) => {
      if (!series[serie]) {
        series[serie] = Object.assign({}, defaultSerie);
      }

      series[serie][val.x] = val;
    };

    if (this.props.group) {
      const dimensionCount = {};
      _.each(this.props.data, d => {
        _.each(d[1].stack, (b, k) => {
          dimensionCount[k] = {
            key: k,
            c: dimensionCount[k] ? dimensionCount[k].c + b.c : b.c
          };
        });
      });

      stacks = _(dimensionCount)
        .sortBy("c")
        .reverse()
        .slice(0, STACK_LIMIT)
        .map("key")
        .value();
    }

    this.flattenData = [];
    _(this.props.data).each(d => {
      const dt = aggregation[this.props.aggregation](d[0]);
      const xPos = this.props.xScale(dt);
      const x = xPos;

      this.flattenData[dt] = {
        c: d[1].stack
          ? _(d[1].stack)
              .map("c")
              .max()
          : d[1].c,
        stack: []
      };

      if (d[1].stack) {
        let amount = d[1].c;
        _(stacks).each(k => {
          const e = d[1].stack[k];
          if (e) {
            this.flattenData[dt].stack.push({
              name: e.name,
              c: e.c,
              key: k
            });
            const y = this.props.yScale(e.c);
            amount -= e.c;

            addSerie(k, { x, y });
          }
        });
        if (amount > 0) {
          const y = this.props.yScale(amount);
          addSerie("other", { x, y });
          this.flattenData[dt].stack.push({
            name: "other",
            key: "other",
            c: amount
          });
        }
      } else {
        const y = this.props.yScale(d[1].c);
        addSerie(0, { x, y });
      }
    });

    const valueLine = d3
      .line()
      .x(d => d.x)
      .y(d => d.y);

    const paths = _.map(series, (serie, k) => {
      const sortedSerie = _.sortBy(serie, "x");
      if (this.props.group) {
        const maxValue = _(sortedSerie)
          .sortBy("y")
          .map("y")
          .head();
        if (maxValue < baseY) {
          return (
            <path
              key={k}
              d={valueLine(sortedSerie)}
              stroke={this.props.getColor(k, this.props.group)}
              fill="none"
              className="line"
            />
          );
        }
      } else {
        return (
          <path
            key={k}
            d={valueLine(sortedSerie)}
            stroke={this.props.getColor(k)}
            fill="none"
            className="line"
          />
        );
      }
    });
    return paths;
  };

  getBars = () => {
    let stacks = [];
    if (this.props.group) {
      const dimensionCount = {};
      _.each(this.props.data, d => {
        _.each(d[1].stack, (b, k) => {
          dimensionCount[k] = {
            key: k,
            c: dimensionCount[k] ? dimensionCount[k].c + b.c : b.c
          };
        });
      });

      stacks = _(dimensionCount)
        .sortBy("c")
        .reverse()
        .slice(0, STACK_LIMIT)
        .map("key")
        .value();
    }

    this.flattenData = [];
    return _(this.props.data)
      .map((d, i) => {
        const dt = aggregation[this.props.aggregation](d[0]);
        const [x0, x1] = this.props.xScale.domain();
        const timeAggregation = aggregation[this.props.aggregation];
        const hovered =
          this.props.mouseIteractions &&
          this.state.focused &&
          !this.state.mousePressed &&
          this.props.xScale(
            this.roundDate(this.props.xScale.invert(this.state.mark.x))
          ) === this.props.xScale(this.roundDate(dt));
        const range0 = this.props.xScale(Math.min(...this.state.range));
        const range1 = this.props.xScale(Math.max(...this.state.range));
        const totalHeight = this.props.yScale.range()[0];
        const rangeDiff = Math.abs(range1 - range0);

        const totalColumns = timeAggregation.count(
          timeAggregation.floor(x0),
          timeAggregation.ceil(x1)
        );

        const totalWidth = Math.abs(
          this.props.xScale(x1) - this.props.xScale(x0)
        );

        const width =
          (totalWidth - BAR_MARGIN * (totalColumns + 2)) / totalColumns;

        const noActive =
          this.state.overlayVisible &&
          (this.props.comparing
            ? x < range0 - rangeDiff || x >= range1
            : x < range0 || x >= range1);
        const bars = [];

        const fixer = BAR_MARGIN;

        const x = this.props.xScale(d[0]) + fixer;

        this.flattenData[dt] = {
          c: d[1].c,
          stack: []
        };

        if (d[1].stack) {
          let amount = d[1].c;
          let currentY = this.props.yScale(amount);

          _(stacks).each(k => {
            const e = d[1].stack[k];
            if (e) {
              this.flattenData[dt].stack.push({
                name: e.name,
                c: e.c,
                key: k
              });
              const startY = this.props.yScale(amount);
              amount -= e.c;
              currentY = this.props.yScale(amount);
              const height = currentY - startY;
              bars.push(
                <rect
                  fill={this.props.getColor(k, this.props.group)}
                  key={i + k}
                  x={x}
                  title={e.name}
                  y={startY}
                  width={width}
                  height={height}
                  className={`bar ${
                    hovered ? "hovered" : noActive ? "no-active" : ""
                  }`}
                />
              );
            }
          });

          if (amount > 0) {
            const startY = this.props.yScale(amount);
            const height = totalHeight - startY;

            this.flattenData[dt].stack.push({
              name: "other",
              key: "other",
              c: amount
            });
            bars.push(
              <rect
                fill={this.props.getColor("other")}
                key={i + "other"}
                x={x}
                y={startY}
                width={width}
                height={height}
                className={`bar ${
                  hovered ? "hovered" : noActive ? "no-active" : ""
                }`}
              />
            );
          }
        } else {
          const startY = this.props.yScale(d[1].c);
          const height = totalHeight - startY;
          bars.push(
            <rect
              key={i}
              fill={this.props.getColor(i)}
              x={x}
              y={startY}
              width={width}
              height={height}
              className={`bar ${
                hovered ? "hovered" : noActive ? "no-active" : ""
              } ${this.props.group ? "group" : "no-group"}`}
            />
          );
        }

        return bars;
      })
      .value();
  };

  types = {
    bar: this.getBars,
    line: this.getLines,
    area: this.getArea
  };

  render() {
    const x = this.props.xScale.range()[0];
    const y = this.props.yScale.range()[1];
    const width = this.props.xScale.range()[1] - x;
    const height = this.props.yScale.range()[0] - y;

    let extentFocused = false;
    const extent = [];

    if (
      this.state.overlayVisible &&
      this.state.range[0] &&
      this.state.range[1]
    ) {
      const fromX = this.props.xScale(this.state.range[0]);
      const toX = this.props.xScale(this.state.range[1]);
      const distance = Math.abs(toX - fromX);
      const marksDefault = this.getXMark(this.state.range[0], null, true);
      const ruler = this.getRuler(this.state.range[0], this.state.range[1]);
      extentFocused =
        this.state.focused &&
        this.state.mark.x >= Math.min(fromX, toX) &&
        this.state.mark.x <= Math.max(fromX, toX);

      extent.push(
        <g key="extent">
          {marksDefault}
          {ruler}
          <rect
            className="extent"
            x={Math.min(fromX, toX)}
            width={distance}
            y={y}
            height={height}
          />
          <rect
            className="extent__reflect"
            x={Math.max(Math.min(fromX, toX) - Math.abs(toX - fromX), x)}
            width={Math.min(distance, Math.min(fromX, toX) - x)}
            y={y}
            height={height}
            fill="url(#diagonalHatch)"
          />
          {this.props.comparing ? (
            <g>
              <text
                key="extent-label-a"
                style={{ textAnchor: "middle" }}
                className="ruler__label"
                width={60}
                x={Math.max(Math.min(fromX, toX) - Math.abs(toX - fromX), x)}
                transform={`translate(${Math.min(
                  distance,
                  Math.min(fromX, toX) - x
                ) / 2}, ${this.props.margin.top + 35})`}
              >
                A
              </text>
              <text
                key="extent-label-b"
                style={{ textAnchor: "middle" }}
                className="ruler__label"
                width={60}
                x={Math.min(fromX, toX)}
                transform={`translate(${distance / 2}, ${this.props.margin.top +
                  35})`}
              >
                B
              </text>
            </g>
          ) : null}
        </g>
      );
    } else if (this.state.date && this.props.timeDisplay) {
      extent.push([
        <g key="focus" className="focus">
          {this.getXMark(this.state.date, null, true)}
          {this.props.mouseIteractions ? this.getRuler(this.state.date) : null}
        </g>
      ]);
    }

    return (
      <g className="overlay">
        <pattern
          id="diagonalHatch"
          patternUnits="userSpaceOnUse"
          x="0px"
          y="0px"
          fill="#ccc"
          width="12px"
          height="12px"
          viewBox="0 0 12 12"
          enableBackground="new 0 0 12 12"
        >
          <path d="M12,3.535V0H8.465L0,8.465V12h3.535L12,3.535z M0,0h3.535L0,3.535V0z M8.465,12L12,8.465V12H8.465z" />
        </pattern>
        <rect
          key="background"
          className={`background ${
            this.state.overlayVisible ? "filtered" : "no-filtered"
          } ${
            this.state.dragging
              ? "dragging"
              : this.state.mousePressed
                ? "resizing"
                : extentFocused
                  ? "focused"
                  : ""
          }`}
          x={x}
          y={y}
          width={width}
          height={height}
          onMouseDown={this.onMouseClick}
          onMouseMove={this.onMouseMove}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onMouseUp={this.onMouseRelease}
        />
        {extent}
        {this.types[this.props.type || "bar"]()}
        {this.props.metadata ? this.getMetadatas() : null}
        {this.props.mouseIteractions ? this.getYMark() : null}
      </g>
    );
  }
}

TimeGraphContent.propTypes = {
  comparing: PropTypes.bool,
  aggregation: PropTypes.string,
  timeDisplay: PropTypes.func,
  timeFormatter: PropTypes.func,
  onClickCompare: PropTypes.any,
  onFilterChange: PropTypes.func,
  tooltipValue: PropTypes.number,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  margin: PropTypes.object,
  numberFormat: PropTypes.func,
  data: PropTypes.array,
  range: PropTypes.array,
  type: PropTypes.string,
  metadata: PropTypes.object,
  mouseIteractions: PropTypes.bool
};

TimeGraphContent.defaultProps = {
  mouseIteractions: true
};
