import React from 'react';
import ReactDOM from 'react-dom';
import Reference from '../../Reference';
import initWebBridgeView from '../initWebBridgeView';
import './style.scss';

initWebBridgeView('reference_page.init', function(bridge, data, callback) {
  const meta = data.reference;
  const props = { meta }
  const referenceElement = <Reference {...props} />
  const container = document.getElementById('container')
  ReactDOM.unmountComponentAtNode(container);
  ReactDOM.render(referenceElement, container)
  callback({})
})
