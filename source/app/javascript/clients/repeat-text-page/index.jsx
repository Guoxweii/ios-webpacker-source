import React from 'react';
import ReactDOM from 'react-dom';

import initWebBridgeView from '../initWebBridgeView';
import { tryConvertBase64ToJSON } from '../connectWebViewJavascriptBridge';

import RepeatText from '../../RepeatText';
import parseHtmlToItems from '../../UnitText/parseHtmlToItems';
import './style.scss';

initWebBridgeView('repeat_text_page.init', function(bridge, data, callback) {
  const contentHtml = data.content_html;

  const { nodes, collect } = parseHtmlToItems(contentHtml);
  const element = <RepeatText lines={nodes} />;

  const container = document.getElementById('container');
  ReactDOM.unmountComponentAtNode(container);
  const component = ReactDOM.render(element, container);
  component.setState({
    entries: data.entries || [],
    finished: !!data.finished,
    markable: !!data.markable,
    scoreType: data.score_type
  });

  callback(collect.items);

  bridge.registerHandler('repeat_text_page.changed', function(rawData) {
    const data2 = tryConvertBase64ToJSON(rawData);
    component.setState(data2.state);
  });
});
