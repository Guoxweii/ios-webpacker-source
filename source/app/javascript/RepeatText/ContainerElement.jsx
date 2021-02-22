import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Big from 'big.js';
/* eslint-disable import/no-cycle */
import covertElement from './covertElement';

const propTypes = {
  tag: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
  statusMapping: PropTypes.object.isRequired,
  entryMapping: PropTypes.object.isRequired,
  options: PropTypes.shape({
    markable: PropTypes.bool.isRequired,
    finished: PropTypes.bool.isRequired,
    scoreType: PropTypes.string.isRequired,
  }),
  onItemClick: PropTypes.func
};

class ContainerElement extends React.Component {
  buildScore(items) {
    const totalScore = _.reduce(items, (sum, item) => {
      const { score } = this.props.entryMapping[item.position];
      return sum.plus(new Big(score));
    }, new Big(0));

    const average = totalScore.div(items.length);
    window.average = average
    return `得分: ${this.accuracyScore(average)}`;
  }

  accuracyScore(score) {
    if (this.props.options.scoreType === 'percent') {
      return score.round(2).toString()
    }

    if (score.lt(Big(60))) {
      return 'D';
    }

    if (score.lt(Big(70))) {
      return 'C';
    }

    if (score.lt(Big(80))) {
      return 'B';
    }

    if (score.lt(Big(85))) {
      return 'B+';
    }

    if (score.lt(Big(95))) {
      return 'A';
    }

    return 'A+';
  }

  buildResultText(items) {
    if (!this.props.options.markable) {
      return '';
    }

    const itemsStatus = _.map(items, item => this.props.statusMapping[item.position] || 'pending');
    let resultText = '尚未完成';

    if (_.includes(itemsStatus, 'recording')) {
      resultText = '正在跟读';
    }

    if (this.props.options.finished || _.every(itemsStatus, status => status === 'recorded')) {
      resultText = this.buildScore(items);
    }

    return resultText;
  }

  render() {
    const children = _.map(this.props.children, (line, index) => {
      const options = { key: index, options: this.props.options, onItemClick: this.props.onItemClick };
      return covertElement(line, this.props.statusMapping, this.props.entryMapping, options);
    });

    const items = [];
    _.each(this.props.children, function(line) {
      if (line.type === 'item') {
        items.push(line.item);
      }
    });

    const resultText = this.buildResultText(items);

    return (
      <div className="row">
        <div className="col-xs-9 rt-entry">
          {React.createElement(this.props.tag, {}, children)}
        </div>
        <div className="col-xs-3 rt-result">{resultText}</div>
      </div>
    );
  }
}

ContainerElement.propTypes = propTypes;

export default ContainerElement;
