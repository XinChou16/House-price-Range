const path = require('path');
const vueLoaderConfig = require('./vue-loader.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('../config')
 

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}


module.exports = {
  entry:{
    app: './src/main.js'
  },
  output:{
    path:path.resolve(__dirname,"../dist"),
    filename:'[name].js '
  },
  module:{
    rules:[
      {
        test: /.vue$/,
        loader: 'vue-loader',
        // vueLoaderConfig:vueLoaderConfig
      },
      {
        test:  /.js$/,
        loader: 'babel-loader',
        include: [resolve('src'),resolve('test')]
      },
    ]
  },

  // 指定别名
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  plugins:[
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: "index.html",
      inject: true,
    })
  ]
}
