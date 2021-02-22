import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import scoreToLevel from './scoreToLevel';

const propTypes = {
  score: PropTypes.string,
  content: PropTypes.string
};

function Word(props) {
  const level = scoreToLevel(props.score);
  const className = classNames('rt-word', level);
  return <span className={className} dangerouslySetInnerHTML={{ __html: props.content }} />;
}

Word.propTypes = propTypes;

export default Word;
