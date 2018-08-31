const path = require('path')
const webpack = require('webpack')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

// Phaser webpack config
const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

// These variables will be injected into the global namespace
// - if __DEV__ is true then the program is running in a development environment
// - if __NWJS__ is true then the program was compiled to run inside NWJS (as a standalone exe)
const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __NWJS__: JSON.stringify(JSON.parse(process.env.NWJS || 'false'))
})

// Export the configuration for webpack
module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/main.js'),
    vendor: ['pixi', 'p2', 'phaser', 'webfontloader', '@babel/polyfill']
  },
  devtool: 'cheap-source-map',
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    publicPath: './dist/',
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
  mode: 'development',
  watch: true,
  plugins: [
    definePlugin,
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor', filename: 'vendor.bundle.js'
    // }),
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      files: ['index.html', 'index.css', 'src/*/*.js'],
      server: {
        baseDir: ['./', './dist']
      }
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default']
    })
  ],
  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(otf|eot|svg|ttf|woff|woff2)$/, use: ['url-loader?limit=8192'] },
      { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
      { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
      { test: /p2\.js/, use: ['expose-loader?p2'] }
    ]
  },
  resolve: {
    alias: {
      'phaser': phaser,
      'pixi': pixi,
      'p2': p2
    }
  }
}
