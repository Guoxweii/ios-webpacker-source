import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import covertElement from './covertElement';

const propTypes = {
  lines: PropTypes.array.isRequired,
  onItemClick: PropTypes.func
};

class RepeatText extends React.Component {
  constructor(props) {
    super(props);

    this.state = { entries: [], markable: true, finished: false };
  }

  render() {
    const statusMapping = _.get(this.state, 'positions') || {};
    const entryMapping = _.keyBy(this.state.entries, 'origin_position');

    const { lines } = this.props;
    const options = {
      markable: this.state.markable,
      finished: this.state.finished,
      scoreType: this.state.scoreType
    };

    const children = _.map(lines, (line, index) => {
      if (line.type === 'item') {
        return covertElement(
          { type: 'container', children: [line], tag: 'div' },
          statusMapping,
          entryMapping,
          { key: index, options, onItemClick: this.props.onItemClick }
        );
      }

      return covertElement(line, statusMapping, entryMapping,
        { key: index, options, onItemClick: this.props.onItemClick });
    });

    return <div className="unit-text repeat-text tp-article">{children}</div>;
  }
}

RepeatText.propTypes = propTypes;

export default RepeatText;
