'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

var projectRoot = '.'
var glob = require('glob')
// 获取页面入口js路径
var entries = (function() {
  var entryFiles = glob.sync(projectRoot + '/src/*.js')
  var map = {}
  entryFiles.forEach(function(filePath){
    var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
    map[filename] = filePath
  })
  return map
})();

console.log(entries)

// 自动生成入口文件，入口js名必须和入口文件名相同
var plugins = (function() {
    // var entryHtml = glob.sync(projectRoot + 'src/*.html')
    var r = []
    for(var i in entries){
        var filename = i;
        //var filePath = entries[i].substring(0,entries[i].lastIndexOf('.')) + '.html'
        var filePath = 'index/'+entries[i].split('/')[2].split('.')[0]+'.html'
        var conf = {
            template: filePath,
            filename: filename + '.html'
        }
        
        conf.inject = 'body'
        conf.chunks = ['vender', 'common', filename]

        // if(/b|c/.test(filename)) conf.chunks.splice(2, 0, 'common-b-c')
        r.push(new HtmlWebpackPlugin(conf))
    }

    return r
    
})()

console.log(plugins)

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: 'logmonit.html',//生成的html
    //   template: 'index/logmonit.html',//来源html
    //   inject: true,//是否开启注入
    //   chunks: ['app']//需要引入的Chunk，不配置就会引入所有页面的资源
    // }),
    // new HtmlWebpackPlugin({
    //   filename: 'heatchart.html',
    //   template: 'index/heatchart.html',
    //   inject: true,
    //   chunks: ['app2']
    // }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ].concat(plugins)
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
