// webpack 是node写出来的 node的写法
let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    devServer: { // 开发服务器的配置
        port: 8888,
        progress: true,
        contentBase: './build',
        compress: true
    },
    mode: 'production', //默认两种 production development
    entry: './src/index.js', //入口
    output: {
      filename: 'bundle[hash:8].js', // 打包后的文件名,加入hash值只显示8位
      path: path.resolve(__dirname, 'build') // 路径必须是觉得路径
    },
    plugins: [
      new HtmlWebpackPlugin({ // 根据./index.html模版生成打包目录下的index.html，并自动注入bundle.js
          template: './src/index.html',
          filename: 'index.html',
          minify: {
            removeAttributeQuotes:true,// 去掉双引号
            collapseWhitespace:true, //折叠空行
          },
          hash:true,
      })
    ]
}