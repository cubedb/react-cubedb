// @flow

// TODO remove lodash
import _map from 'lodash/map';
import _mapValues from 'lodash/mapValues';
import _size from 'lodash/size';

import React from 'react';
import PropTypes from 'prop-types';

import { Panel } from 'react-bootstrap';

import { normalizeData } from '../utils';

import BarGraphHeader from './bar_graph_header';
import BarList from './bar_list';

import './style/BarGraph.scss';

export default class BarGraph extends React.Component {
  static propTypes = {
    comparingTo: PropTypes.object,
    data: PropTypes.object,
    getColor: PropTypes.func,
    group: PropTypes.string,
    lookup: PropTypes.object,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    onChange: PropTypes.func,
    selected: PropTypes.array
  };

  static defaultProps = {
    name: '',
    group: null,
    selected: [],
    comparingTo: null,
    lookup: {}
  };

  state = {
    stretched: false,
    search: null
  };

  onSearch = e => {
    const search = e.target.value;

    if (search.length) {
      try {
        new RegExp(search, 'i');
        this.setState({
          search: search
        });
      } catch (e) {
        this.setState({
          search: false
        });
      }
    } else {
      this.setState({
        search: null
      });
    }
  };

  onStretch = () => {
    this.setState({
      stretched: !this.state.stretched
    });
  };

  onChange = (name, selected) => {
    return this.props.onChange && this.props.onChange(name, selected);
  };

  render() {
    const dimension = normalizeData(
      this.props.data,
      this.props.lookup[this.props.name],
      this.props.lookup[this.props.group]
    );
    const allData = _mapValues(this.props.allData, (data, name) => {
      return normalizeData(data, this.props.lookup[name], this.props.lookup[this.props.group]);
    });
    const comparing = this.props.comparingTo
      ? normalizeData(this.props.comparingTo, this.props.lookup[this.props.name], this.props.lookup[this.props.group])
      : null;
    const filter = this.state.search;
    const isGroupSource = this.props.group && this.props.group === this.props.name;

    return (
      <Panel bsStyle={isGroupSource ? 'info' : 'default'} className="bar-graph__container">
        <Panel.Heading>
          <BarGraphHeader
            name={this.props.name}
            description={this.props.description}
            dimensions={_map(dimension.serie, 'key')}
            total={dimension.total}
            comparingTo={comparing && comparing.serie}
            dimension={dimension.serie}
            selectedItems={this.props.selected}
            onSearch={this.onSearch}
            filter={filter}
            size={_size(dimension.serie)}
            onStretch={!isGroupSource && this.onStretch}
            stretched={!isGroupSource && this.state.stretched}
            onChange={this.onChange}
            slice={this.props.slice}
            group={this.props.group}
            allData={allData}
          />
        </Panel.Heading>
        <Panel.Body>
          {filter ? <div className="bar-graph__search-help">Search result for "{filter}"</div> : null}
          <BarList
            name={this.props.name}
            dimension={dimension}
            filter={filter}
            comparingTo={comparing}
            group={this.props.group}
            stretched={this.state.stretched}
            lookup={this.props.lookup}
            selected={this.props.selected}
            onChange={this.onChange}
            slice={this.props.slice}
            getColor={this.props.getColor}
          />
        </Panel.Body>
      </Panel>
    );
  }
}
