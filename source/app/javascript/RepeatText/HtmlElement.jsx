import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const propTypes = {
  content: PropTypes.string.isRequired,
  tag: PropTypes.string.isRequired
};

function HtmlElement(props) {
  const tagProps = {};
  if (!_.isEmpty(props.content)) {
    tagProps.dangerouslySetInnerHTML = { __html: props.content };
  }

  return React.createElement(props.tag, tagProps);
}

HtmlElement.propTypes = propTypes;

export default HtmlElement;
