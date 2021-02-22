import $ from 'jquery';

window.bridgeInit = function() {
  window.WebViewJavascriptBridge = {
    registerHandlers: {},

    init(callback) {
      this.registerHandler('_init', callback);
    },

    registerHandler(name, callback) {
      this.registerHandlers[name] = callback;
    },

    /* eslint-disable no-console */
    invokeHandler(name, data) {
      const callback = function(params) {
        console.log(`invokeHandler callback ${name}`, params);
      };

      this.registerHandlers[name](data, callback);
    },

    /* eslint-disable no-console */
    callHandler(name, data) {
      console.log(`callHandler ${name}`, data);
    }
  };
  $(document).trigger('WebViewJavascriptBridgeReady');
};
