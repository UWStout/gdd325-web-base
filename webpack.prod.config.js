const path = require('path')
const webpack = require('webpack')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser/')
var phaser = path.join(phaserModule, 'src/phaser.js')

// These variables will be injected into the global namespace
// - if __DEV__ is true then the program is running in a development environment
// - if __NWJS__ is true then the program was compiled to run inside NWJS (as a standalone exe)
const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false')),
  __NWJS__: JSON.stringify(JSON.parse(process.env.NWJS || 'false')),
  WEBGL_RENDERER: true
})

// Export the configuration for webpack
module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/main.js'),
    vendor: ['phaser', 'phaser-plugin-update', '@babel/polyfill']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: './dist/',
    library: '[name]',
    libraryTarget: 'umd',
    filename: '[name].bundle.js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: 'vendor',
          enforce: true
        }
      }
    }
  },
  mode: 'production',
  watch: true,
  plugins: [
    definePlugin,
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: './src/index.html',
      chunks: ['vendor', 'app'],
      chunksSortMode: 'manual',
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: false,
        html5: false,
        minifyCSS: false,
        minifyJS: false,
        minifyURLs: false,
        removeComments: false,
        removeEmptyAttributes: false
      },
      hash: false
    }),
    new MinifyPlugin({}, { comments: false }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      files: ['index.html', 'index.css', 'src/*/*.js'],
      server: {
        baseDir: ['./', './dist']
      }
    })
  ],
  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(otf|eot|svg|ttf|woff|woff2)$/, use: ['url-loader?limit=8192'] },
      { test: [/\.vert$/, /\.frag$/, /\.glsl$/], use: 'raw-loader' }
    ]
  },
  resolve: {
    alias: {
      'phaser': phaser
    }
  }
}
