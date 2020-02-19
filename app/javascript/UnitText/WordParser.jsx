import $ from 'jquery';
import _ from 'lodash';

export default class WordParser {
  constructor() {
    const SEPARATORS = ' \n\t\r';

    this.result = [];
    this.separators = _.escapeRegExp(SEPARATORS);
  }

  parse(content) {
    const nodes = $(`<div>${content}</div>`).get(0).childNodes;
    this.parseNodes(nodes);
  }

  parseNodes(nodes) {
    _.each(nodes, this.processNode.bind(this));
  }

  processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      this.processText(node);
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      this.processElement(node);
    }
  }

  nodeAttributesToHash(node) {
    return _.transform(node.attributes, (result, attr) => { result[attr.name] = attr.value; }, {});
  }

  add(token) {
    this.result.push(token);
  }

  append(token) {
    const prev = _.last(this.result);
    if (prev && prev.type === 'word' && token.type === 'word') {
      prev.content += token.content;
      prev.text += token.text;
      return;
    }

    if (prev && prev.type === 'text' && token.type === 'text') {
      prev.content += token.content;
      prev.text += token.text;
      return;
    }

    this.result.push(token);
  }

  appendAll(tokens) {
    _.each(tokens, token => this.append(token));
  }

  processText(node) {
    const tokens = this.splitText(node.textContent);
    this.appendAll(tokens);
  }

  processElement(node) {
    const classNames = (node.getAttribute('class') || '').split(' ');
    if (_.includes(classNames, 'skip')) {
      this.append({ type: 'element', content: node.outerHTML });
      return;
    }

    const alias = node.getAttribute('data-alias');
    if (alias) {
      this.add({ type: 'word', content: node.innerHTML, text: alias });
      return;
    }

    const childParser = new WordParser();
    childParser.parseNodes(node.childNodes);
    const childResult = childParser.result;

    if (_.every(childResult, ['type', 'word'])) {
      this.append({ type: 'word', content: node.outerHTML, text: _.map(childResult, 'text').join() });
      return;
    }

    this.append({
      type: 'container',
      tag: node.tagName.toLowerCase(),
      attributes: this.nodeAttributesToHash(node),
      children: childResult
    });
  }

  splitText(text) {
    if (_.isEmpty(text)) {
      return [];
    }

    const regexp = new RegExp(`^([^${this.separators}]+)?([${this.separators}]+)(.*)$`);
    const match = text.match(regexp);

    if (!match) {
      return [{ type: 'word', content: text, text }];
    }

    let result = [];

    if (match[1]) {
      result.push({ type: 'word', content: match[1], text: match[1] });
    }
    result.push({ type: 'text', content: match[2] });
    result = result.concat(this.splitText(match[3]));

    return result;
  }
}
