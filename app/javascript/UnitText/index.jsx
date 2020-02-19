import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Line from './UnitTextLine';
import buildElement from './buildElement';

const propTypes = {
  nodes: PropTypes.array.isRequired,
  clickable: PropTypes.bool,
  onLineClick: PropTypes.func
};

class UnitText extends React.Component {
  constructor(props) {
    super(props);
    this.covert = this.covert.bind(this);

    this.state = {
      id: null, nodes: this.props.nodes, clickable: this.props.clickable, playing: false
    };
  }

  covert(node) {
    if (node.type === 'text') {
      return node.content;
    }

    if (node.children) {
      const children = _.map(node.children, child => this.covert(child));
      return buildElement(node, {}, children)
    }

    const { line } = node;
    if (!line) {
      return buildElement(node, {})
    }

    const lineProps = {
      node, line
    };

    if (this.state.playing) {
      if (this.state.clickable) {
        lineProps.onClick = this.props.onLineClick;
      }

      lineProps.playing = line.id === this.state.id;
    }

    return <Line {...lineProps} />;
  }

  render() {
    const children = _.map(this.state.nodes, node => this.covert(node));
    return <div className="unit-text tp-article">{React.createElement('div', {}, children)}</div>;
  }
}

UnitText.propTypes = propTypes;

export default UnitText;
