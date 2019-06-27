// @flow

// TODO remove lodash
import _each from 'lodash/each';
import _map from 'lodash/map';
import _difference from 'lodash/difference';
import _size from 'lodash/size';

import React from 'react';
import PropTypes from 'prop-types';

import {
  FormGroup,
  FormControl,
  Button,
  ButtonGroup,
  ButtonToolbar,
  OverlayTrigger,
  Popover,
  Glyphicon,
  Tooltip
} from 'react-bootstrap';

import { saveData } from '../utils';

export class BarGraphHeader extends React.Component {
  static propTypes = {
    allData: PropTypes.object,
    comparingTo: PropTypes.object,
    dimension: PropTypes.object,
    dimensions: PropTypes.array,
    selectedItems: PropTypes.array,
    filter: PropTypes.string,
    group: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    size: PropTypes.number,
    slice: PropTypes.number,
    total: PropTypes.number,
    stretched: PropTypes.bool,
    onChange: PropTypes.func,
    onSearch: PropTypes.func,
    onStretch: PropTypes.func
  };

  onDownload = (dataLabel, volume, dataSerie, comparingTo) => () => {
    const defaultDimension = { c: 0 };
    let stacksLabel = '';
    const delimiter = ',';
    const endLine = '\r\n';

    const createLine = (name, count = 0, stack = []) => {
      const proportion = volume > 0 && count > 0 ? (count || 0) / volume : 0;
      let stacks = '';

      if (this.props.group) {
        _each(this.props.allData[this.props.group].serie, (d, i) => {
          stacks += `${delimiter}${(stack[i] || defaultDimension).c}`;
        });
      }

      stacks += `${delimiter}${count}`;

      return `${name}${delimiter}${(proportion * 100).toFixed(3)}%${stacks}${endLine}`;
    };

    const body = _map(dataSerie, el => {
      if (comparingTo) {
        const window = comparingTo[el.key] || { count: 0, stack: [] };
        return `${createLine(`${el.name}${delimiter}A`, window.c, window.stack)}${createLine(
          `${el.name}${delimiter}B`,
          el.c,
          el.stack
        )}`;
      } else {
        return createLine(el.name, el.c, el.stack);
      }
    }).join('');

    if (this.props.group) {
      _each(this.props.allData[this.props.group].serie, (d, i) => {
        stacksLabel += `${delimiter}${d.name || i}`;
      });
    }

    stacksLabel += `${delimiter}event count`;

    const header = `${dataLabel}${delimiter}${
      comparingTo ? `window${delimiter}` : ''
    }percentage${stacksLabel}${endLine}`;
    const fileData = header + body;

    const blob = new Blob([fileData], { type: 'text/plain' });

    saveData(
      `event_${this.props.name}_serie_${dataLabel}${this.props.group ? `_grouped_by_${this.props.group}` : ''}.csv`,
      blob
    );
  };

  onClickAddAll = e => {
    e.preventDefault();
    this.props.onChange(this.props.name, _difference(this.props.dimensions, this.props.selectedItems));
  };
  onClickInvert = e => {
    e.preventDefault();
    this.props.onChange(this.props.name, this.props.dimensions);
  };
  onClickRemoveAll = e => {
    e.preventDefault();
    this.props.onChange(this.props.name, this.props.selectedItems);
  };

  render() {
    const name = this.props.description ? (
      <OverlayTrigger placement="top" overlay={<Tooltip id={this.props.name}>{this.props.description}</Tooltip>}>
        <span>{this.props.name}</span>
      </OverlayTrigger>
    ) : (
      this.props.name
    );

    return (
      <div>
        <h4>
          {name}{' '}
          <small>
            (
            {(this.props.slice && this.props.slice < this.props.size ? `${this.props.slice} of ` : '') +
              this.props.size}
            )
          </small>
        </h4>
        <ButtonGroup className="bar-graph__actions">
          <Button
            title="Click to save as csv"
            onClick={this.onDownload(this.props.name, this.props.total, this.props.dimension, this.props.comparingTo)}
          >
            <Glyphicon glyph="save" />
          </Button>
          <React.Fragment>
            <OverlayTrigger
              trigger="click"
              rootClose
              placement="bottom"
              overlay={
                <Popover className="bar-graph__filter__dimension" id={`popover-${this.props.name}`} title="">
                  <div>
                    <ButtonGroup>
                      <Button bsSize="small" bsStyle="primary" onClick={this.onClickAddAll}>
                        Add all
                      </Button>
                      <Button
                        bsSize="small"
                        bsStyle="primary"
                        onClick={this.onClickInvert}
                        disabled={!_size(this.props.selectedItems)}
                      >
                        Invert selected
                      </Button>
                      <Button
                        bsSize="small"
                        bsStyle="primary"
                        onClick={this.onClickRemoveAll}
                        disabled={!_size(this.props.selectedItems)}
                      >
                        Remove all
                      </Button>
                    </ButtonGroup>
                  </div>
                  <br />
                  <div>
                    <FormGroup
                      className="bar-graph__list__search"
                      bsSize="small"
                      validationState={this.props.filter === false ? 'error' : this.props.filter ? 'success' : null}
                    >
                      <FormControl
                        defaultValue={this.props.filter ? this.props.filter : undefined}
                        onChange={this.props.onSearch}
                        placeholder="Looking for..."
                        type="text"
                      />
                      <FormControl.Feedback>
                        <Glyphicon glyph="search" />
                      </FormControl.Feedback>
                    </FormGroup>
                  </div>
                  <br />
                  <div>
                    <ButtonToolbar>
                      {_map(this.props.selectedItems, f => {
                        return (
                          <Button
                            className="bar-graph__filter__dimension__button"
                            key={`filter-${f}`}
                            onClick={() => {
                              this.props.onChange(this.props.name, f);
                            }}
                            bsSize="xsmall"
                          >
                            {f} <Glyphicon glyph="remove-sign" />
                          </Button>
                        );
                      })}
                    </ButtonToolbar>
                  </div>{' '}
                </Popover>
              }
            >
              <Button
                title="Click to change the applied filters"
                bsStyle={(this.props.selectedItems || this.props.filter || []).length ? 'info' : 'default'}
              >
                <Glyphicon glyph="filter" />
              </Button>
            </OverlayTrigger>
          </React.Fragment>
          {this.props.onStretch ? (
            <Button
              title="Click to change the view mode"
              bsStyle={this.props.stretched ? 'primary' : 'default'}
              onClick={this.props.onStretch}
            >
              <Glyphicon glyph="tasks" />
            </Button>
          ) : null}
          <Button
            title="Click to change the stacking based in this group"
            bsStyle={this.props.group === this.props.name ? 'primary' : 'default'}
            onClick={() => {
              this.props.onChange('group', this.props.name);
            }}
          >
            <Glyphicon glyph="indent-left" />
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}
