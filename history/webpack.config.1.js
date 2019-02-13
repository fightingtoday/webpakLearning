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
    mode: 'development', //默认两种 production development
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
    ],
    module: { // 模块
      // loder
      rules:[ // 规则 css-loader 解析@import这种语法
          // style-loader是把css插入到head的标签中
          // loader的特点 希望单一
          // 多个loader 需要[]
          // loader的顺序是默认从➡️往左执行,从下到上执行
          // loader 还可以写成对象形式(可以多传一些参数)
        {
            test: /\.css$/, 
            use: [
              {
                loader: 'style-loader',
                options: { // 默认样式会加在末尾，若想让index.html里面的样式优先级更高，可在option选项中加入参数
                    insertAt: 'top'// 样式加在最上面
                }
              },
              'css-loader'
            ]
        },
        // 可以处理less, (同理 sass -> node-sass sass-loader, stylus -> stylus-loader)
        {
            test: /\.less$/, 
            use: [
              {
                loader: 'style-loader',
                options: { // 默认样式会加在末尾，若想让index.html里面的样式优先级更高，可在option选项中加入参数
                    insertAt: 'top'// 样式加在最上面
                }
              },
              'css-loader',
              'less-loader' // 把less -> css
            ]
        }
      ]
    }
}