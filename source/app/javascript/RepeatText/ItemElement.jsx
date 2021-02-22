import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import Word from './Word';
import scoreToLevel from './scoreToLevel';

const propTypes = {
  tag: PropTypes.string.isRequired,
  status: PropTypes.string,
  entry: PropTypes.object,
  item: PropTypes.shape({
    position: PropTypes.string.isRequired,
    tokens: PropTypes.array.isRequired,
    words: PropTypes.array.isRequired
  }),
  onItemClick: PropTypes.func
};

class ItemElement extends React.Component {
  constructor(props) {
    super(props);

    this.handleOnClick = this.handleOnClick.bind(this);
    this.buildScores = this.buildScores.bind(this);
    this.buildContent = this.buildContent.bind(this);
  }

  handleOnClick(event) {
    event.preventDefault();
    if (this.props.onItemClick) {
      this.props.onItemClick(this.props.item, this.props.entry);
    }
  }

  convertToken(token, scores) {
    if (token.type === 'word') {
      const { id } = token;
      return <Word id={id} key={`w${id}`} content={token.content} score={scores[id]} />;
    }

    if (token.type === 'text') {
      return token.content;
    }

    if (token.type === 'element') {
      return <span dangerouslySetInnerHTML={{ __html: token.content }} />;
    }

    if (token.type === 'container') {
      const children = _.map(token.children, child => this.convertToken(child, scores));
      return React.createElement(token.tag, token.attributes, children);
    }

    throw new Error('unknow token type');
  }

  cleanupWord(text) {
    return _.replace(text || '', /[:.,?!"'-]+$/, '').toLowerCase();
  }

  findIndexByWord(words, fromIndex, detail) {
    for (let i = fromIndex; i < words.length; i += 1) {
      const word = words[i];
      if (this.cleanupWord(word.text) === this.cleanupWord(detail.word)) {
        return i;
      }
    }

    return -1;
  }

  buildScores(words) {
    const scores = {};
    if (!this.props.entry) { return scores; }

    const { details } = this.props.entry;

    let fromIndex = 0;
    _.each(details, (detail) => {
      const index = this.findIndexByWord(words, fromIndex, detail);

      if (index >= 0) {
        const word = words[index];
        fromIndex = index + 1;
        scores[word.id] = detail.score;
      }
    });

    return scores;
  }

  buildContent() {
    const { tokens } = this.props.item;
    const { words } = this.props.item;

    const scores = this.buildScores(words);
    return _.map(tokens, token => this.convertToken(token, scores));
  }

  render() {
    let level = '';
    const status = this.props.status || 'pending';

    if (this.props.entry) {
      level = scoreToLevel(this.props.entry.score);
    }

    const content = this.buildContent();
    const className = classNames('rt-item', `rt-${status}`, `${level}`, {
      clickable: this.props.onItemClick
    });

    if (_.includes(['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'], this.props.tag)) {
      const children = React.createElement('span', { className }, content);
      return React.createElement(this.props.tag, {}, children);
    }

    const tagProps = { onClick: this.handleOnClick, className };
    return React.createElement(this.props.tag, tagProps, content);
  }
}

ItemElement.propTypes = propTypes;

export default ItemElement;
