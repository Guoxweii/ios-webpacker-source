import connectWebViewJavascriptBridge from './connectWebViewJavascriptBridge';

connectWebViewJavascriptBridge(function(bridge) {
  if (bridge.init) {
    bridge.init(function() {
      // Init for WebViewJavascriptBridge 4.x
    });
  }
});
