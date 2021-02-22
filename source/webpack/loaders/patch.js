const { resolve } = require('path')

module.exports = {
  test: /\.jsx?$/,
  loader: 'babel-loader',
  include: [ resolve("node_modules/runes"), resolve("node_modules/react-html-parser") ],
  options: {
    presets: [ ['env', { modules: false }] ]
  }
}
