import $ from 'jquery';
import _ from 'lodash';
import WordParser from './WordParser';
import traverse from '../utils/traverse';

function parseItem(domNode, collect) {
  if (domNode.nodeType === Node.TEXT_NODE) {
    return {
      type: 'text',
      content: domNode.textContent
    };
  }

  collect.elementCount += 1
  const data = _.chain(domNode.attributes)
    .filter(attr => attr.name.match(/^data-/))
    .transform((result, attr) => { result[attr.name.replace(/^data-/, '')] = attr.value; }, {})
    .value();

  if (data.time && data.duration) {
    data.time = parseFloat(data.time);
    data.duration = parseFloat(data.duration);
  }

  const node = {
    tag: domNode.nodeName.toLowerCase(),
    index: collect.elementCount - 1,
    attributes: domNode.attributes
  };

  if (!_.isNil(data.time && data.duration)) {
    node.line = {
      id: collect.lines.length + 1,
      time: data.time,
      duration: data.duration
    };

    collect.lines.push(node.line);
  }

  const $element = $(domNode);
  if ($element.find('[data-position]').length > 0) {
    return _.assign(node, {
      type: 'container',
      children: _.map(domNode.childNodes, child => parseItem(child, collect))
    });
  }

  node.content = domNode.innerHTML;

  if (_.isEmpty(data.position)) {
    node.type = 'html';
  } else {
    node.item = data;

    const parser = new WordParser();
    parser.parse($element.html());
    const tokens = parser.result;

    const traversed = traverse(tokens, { seq: 0, words: [], wordTexts: [] }, function(item, context, action) {
      if (item.type === 'word') {
        context.seq += 1;
        item.id = context.seq;
        context.words.push(item);
        context.wordTexts.push(item.text);
      }

      if (item.type === 'container') {
        traverse(item.children, context, action);
      }
    });

    node.item.tokens = tokens;
    node.item.words = traversed.words;
    node.item.content = _.trim(_.join(traversed.wordTexts, ' '));
    node.type = 'item';

    collect.items.push(node.item);
  }

  return node;
}

export default function parseHtmlToItems(content) {
  const root = $(`<div>${content}</div>`).get(0);
  const collect = { items: [], lines: [], elementCount: 0 };
  const nodes = _.map(root.childNodes, domNode => parseItem(domNode, collect));

  return { nodes, collect };
}
