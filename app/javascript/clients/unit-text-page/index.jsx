import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';

import './style.scss';

import ListenText from '../../UnitText';
import parseHtmlToItems from '../../UnitText/parseHtmlToItems';

import initWebBridgeView from '../initWebBridgeView';
import { tryConvertBase64ToJSON } from '../connectWebViewJavascriptBridge';

const UnitTextPage = {
  init(content, options) {
    this.seekLine = null;
    this.seekLineTimeoutId = null;
    this.options = options;
    this.content = content;

    const { nodes, collect } = parseHtmlToItems(this.content);
    this.nodes = nodes;
    this.lines = collect.lines;
  },

  handleLineClick(line) {
    if (this.options.handleLineClick) {
      this.seekLine = line;
      clearTimeout(this.seekLineTimeoutId);
      this.seekLineTimeoutId = setTimeout(() => {
        this.seekLine = null;
      }, 1200);

      this.options.handleLineClick(line);
    }
  },

  render(container) {
    /* eslint-disable react/jsx-no-bind */
    const handleLineClick = this.handleLineClick.bind(this);
    const element = <ListenText nodes={this.nodes} clickable={this.options.seekable} onLineClick={handleLineClick} />;
    this.component = ReactDOM.render(element, container);
  },

  startPlaying() {
    this.component.setState({ playing: true });
  },

  stopPlaying() {
    this.component.setState({ playing: false });
  },

  updateProgress(currentTime) {
    if (this.seekLine) {
      this.component.setState({ id: this.seekLine.id });
    } else {
      const currentLine = _.findLast(this.lines, line => line.time <= currentTime);
      this.component.setState({ id: currentLine.id });
    }
  }
};

initWebBridgeView('unit_text_page.init', function(bridge, data, callback) {
  const contentHtml = data.content_html;
  UnitTextPage.init(contentHtml, {
    seekable: data.seekable,
    handleLineClick(line) {
      const { time } = line;
      bridge.callHandler('unit_text.seek', { time });
    }
  });

  const container = document.getElementById('container');
  ReactDOM.unmountComponentAtNode(container);
  UnitTextPage.render(container);

  callback(UnitTextPage.lines);

  bridge.registerHandler('unit_text_page.player', function(rawData) {
    const message = tryConvertBase64ToJSON(rawData);

    if (message.target === 'player') {
      switch (message.event) {
        case 'playing':
          UnitTextPage.startPlaying();
          break;
        case 'ended':
          UnitTextPage.stopPlaying();
          break;
        case 'timeupdate': {
          UnitTextPage.updateProgress(message.data);
          break;
        }
        default:
        // nothing
      }
    }
  });
});
