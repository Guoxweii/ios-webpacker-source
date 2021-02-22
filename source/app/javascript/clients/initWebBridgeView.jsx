import connectWebViewJavascriptBridge, { tryConvertBase64ToJSON } from './connectWebViewJavascriptBridge';

export default function initWebBridgeView(name, initializer) {
  connectWebViewJavascriptBridge(function(bridge) {
    bridge.registerHandler(name, function(rawData, callback) {
      const data = tryConvertBase64ToJSON(rawData)
      initializer(bridge, data, callback)

      const container = document.getElementById('container')
      const height = container.clientHeight
      bridge.callHandler('container.rendered', { height })
    })
  })
}
