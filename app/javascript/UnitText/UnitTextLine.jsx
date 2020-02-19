import React from 'react';
import PropTypes from 'prop-types';
import buildElement from './buildElement';

const propTypes = {
  node: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  playing: PropTypes.bool
};

class UnitTextLine extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    this.state = this.props;
  }

  handleClick() {
    if (this.props.onClick) {
      this.props.onClick(this.state.node.line);
    }
  }

  render() {
    const { node } = this.props;

    const elementProps = {};

    if (this.props.playing) {
      elementProps.className = 'playing';
    }

    if (this.props.onClick) {
      elementProps.onClick = this.handleClick;
    }

    return buildElement(node, elementProps)
  }
}

UnitTextLine.propTypes = propTypes;

export default UnitTextLine;
