'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
//提取公共入口文件获取 页面输出文件遍历代码
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
exports.entries=entries;


const HtmlWebpackPlugin = require('html-webpack-plugin')
// 自动生成入口文件，入口js名必须和入口文件名相同 输出多html
var plugins;
if(process.env.NODE_ENV === 'production'){
  plugins = (function() {
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
        //conf.chunks = ['vender', 'common', filename]
        conf.minify={
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        }
        conf.chunksSortMode='dependency'
        conf.chunks=['manifest','vendor',filename]
        // if(/b|c/.test(filename)) conf.chunks.splice(2, 0, 'common-b-c')
        r.push(new HtmlWebpackPlugin(conf))
    }

    return r
    
})()
}else{
  plugins = (function() {
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
}

exports.plugins=plugins;