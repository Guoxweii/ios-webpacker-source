import React from 'react';
import generatePropsFromAttributes from 'react-html-parser/src/utils/generatePropsFromAttributes';
import _ from 'lodash';

export default function buildElement(node, props, children) {
  const attrs = _.transform(node.attributes, (result, attr) => { result[attr.name] = attr.value; }, {})
  const newProps = _.merge({}, generatePropsFromAttributes(attrs, `ut-${node.index}`), props)

  if (_.trim(node.content) !== '') {
    newProps.dangerouslySetInnerHTML = { __html: node.content }
  }

  return React.createElement(node.tag, newProps, children)
}
