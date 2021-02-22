const { join, relative, resolve } = require('path')
const { environment } = require('@rails/webpacker')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
require('dotenv').config()

environment.config.set('output.filename', '[name]-[chunkhash].js')
environment.config.set('output.chunkFilename', '[name]-[chunkhash].chunk.js')
environment.config.set('output.hotUpdateChunkFilename', '[id]-[hash].hot-update.js')
environment.config.delete('output.publicPath')

const fileLoader = environment.loaders.get('file')
fileLoader.use[0].options.name = '[name]-[hash].[ext]'

const miniCssExtract = environment.plugins.get('MiniCssExtract')
miniCssExtract.options.filename = '[name]-[contenthash].css'
miniCssExtract.options.chunkFilename = '[name]-[contenthash].chunk.css'

environment.plugins.prepend(
  'Provide',
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    jquery: 'jquery',
    'window.Tether': 'tether',
    Popper: ['popper.js', 'default']
  })
)

environment.plugins.insert('HtmlWebpack',
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: resolve('./app/javascript/packs/index.html'),
    templateParameters: {
      CUSTOM_FONT_BOLD_URL: process.env.CUSTOM_FONT_BOLD_URL,
      CUSTOM_FONT_NORMAL_URL: process.env.CUSTOM_FONT_NORMAL_URL
    }
  })
)

module.exports = environment
