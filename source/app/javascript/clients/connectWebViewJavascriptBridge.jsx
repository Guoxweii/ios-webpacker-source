import $ from 'jquery';
import { Base64 } from 'js-base64';

function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    callback(WebViewJavascriptBridge);
    return;
  }
  if (window.WVJBCallbacks) {
    window.WVJBCallbacks.push(callback);
    return;
  }
  window.WVJBCallbacks = [callback];
  const WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function() {
    document.documentElement.removeChild(WVJBIframe);
  }, 0);
}

export function tryConvertBase64ToJSON(data) {
  if (typeof data === 'string') {
    const decodeData = Base64.decode(data);
    return $.parseJSON(decodeData);
  }

  return data;
}

export default function connectWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    callback(window.WebViewJavascriptBridge);
  } else {
    $(document).one('WebViewJavascriptBridgeReady', function() {
      callback(window.WebViewJavascriptBridge);
    });
    setupWebViewJavascriptBridge(callback);
  }
}
