// webpack 是node写出来的 node的写法
let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let OptimizeCss = require('optimize-css-assets-webpack-plugin')
let UglifyjsPlugin = require('uglifyjs-webpack-plugin')
let CleanWebpackPlugin = require('clean-webpack-plugin')
let CopyWebpackPlugin = require('copy-webpack-plugin')
let webpack = require('webpack')
module.exports = {
    devServer: { // 开发服务器的配置
        port: 8182,
        progress: true,
        contentBase: './build',
        compress: true
    },
    optimization: { //优化项
      minimizer: [
        new UglifyjsPlugin({
          cache: true, // 使用缓存
          parallel:true, // 可同时压缩多个
          sourceMap: true //源码映射方便调试
        }),
        new OptimizeCss() // 压缩css
      ]
    },
    mode: 'development', //默认两种 production development
    entry: './src/index.js', //入口
    output: {
      filename: 'bundle[hash:8].js', // 打包后的文件名,加入hash值只显示8位
      path: path.resolve(__dirname, 'build'), // 路径必须是觉得路径
      // publicPath: 'http://www.zhufengpeixun.cn' //资源都会放在publicPath下，可用于将资源放在cdn下
    },
    devtool: 'source-map', //源码映射,会单独生成一个sourcemap文件，出错了会标识当前报错的行和列（大且全）
    // devtool: 'eval-source-map', //不会产生单独的文件,可以显示行和列
    // devtool: 'cheap-module-source-map', //不会产生列，但是是一个单独的映射文件，用的不多
    // devtool: 'cheap-module-eval-source-map', //不会产生文件，集成在打包文件中，不会产生列
    watch: true, //实时编译
    watchOptions: {
      poll: 1000, //每秒问我1000次
      aggregateTimeout: 500, //防抖，输入代码完成后500ms开始打包
      ignored: /node_modules/ //不需要监控哪个文件
    },
    // 插件的使用顺序没有先后
    plugins: [
      new HtmlWebpackPlugin({ // 根据./index.html模版生成打包目录下的index.html，并自动注入bundle.js
          template: './src/index.html',
          filename: 'index.html',
          minify: {
            removeAttributeQuotes:true,// 去掉双引号
            collapseWhitespace:true, //折叠空行
          },
          hash:true,
      }),
      new MiniCssExtractPlugin({
          filrname: 'css/main.css'
      }),
      new webpack.ProvidePlugin({ // 在每个模块中都注入$，全局没有
        $: 'jquery'
      }),
      new CleanWebpackPlugin ('./build'),
      new CopyWebpackPlugin ([
        {from: './doc', to:'./'}
      ]),
      new webpack.BannerPlugin('make 2019 bu wangcui')
      // external({ // 表示jquery 是从第三方js引入的，不需要在打包
      //   jquery: '$'
      // })
    ],
    module: { // 模块
      // loder
      rules:[
        // 将$暴露到全局
        // {
        //   test: require.resolve('jquery'),
        //   use: 'expose-loader?$'
        // }, 
        // {
        //   test: /\.js$/,
        //   use: {
        //     loader: 'eslint-loader',
        //     options: {
        //       enforce: 'pre'  // 强制提前执行（本来是从下到上执行的）
        //     }
        //   }
        // },
        {
          test:/\.html$/,
          use: 'html-withimg-loader'
        },
        {
          test:/\.(png|jpg|gif)$/,
        // 做一个限制 当我们的图片小于多少K的时候 用base64来转化
        // 否则用file-loader产生真实的图片
          use: {
            loader: 'url-loader',
            options: {
              limit: 1,
              outputPath: '/img/',
              // publicPath: 'http:www.zhuf.cn' //只在图片下加
            }       
          }
        },
        {
          test: /.js$/,
          use:{
            loader: 'babel-loader',
            options: {
              presets:[
                '@babel/preset-env' // es6转换为es5
              ],
              plugins: [
                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                ["@babel/plugin-proposal-class-properties", { "loose" : true }],
                ["@babel/plugin-transform-runtime"] // 提取公共部分
              ]
            }
          },
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/
        },
        // 规则 css-loader 解析@import这种语法
          // style-loader是把css插入到head的标签中
          // loader的特点 希望单一
          // 多个loader 需要[]
          // loader的顺序是默认从➡️往左执行,从下到上执行
          // loader 还可以写成对象形式(可以多传一些参数)
        {
            test: /\.css$/, 
            use: [
              MiniCssExtractPlugin.loader,             
              'css-loader',
              'postcss-loader', //加浏览器前缀
            ]
        },
        // 可以处理less, (同理 sass -> node-sass sass-loader, stylus -> stylus-loader)
        {
            test: /\.less$/, 
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              'less-loader', // 把less -> css
              'postcss-loader', //加浏览器前缀
            ]
        }
      ]
    }
}