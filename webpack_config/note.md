## webpack 安装
- 安装本地的webpack
- webpack webpack-cli -D

## webpack可以进行0配置
- 打包工具 -> 输出后的结果（js模块）
- npx webpack(该命令用到了webpack-cli)
- 打包支持模块的 (打包结果在dist目录下)

## 手动配置
- 默认 配置文件名称: "webpack.config.js or webpackfile.js",   (在node_nodule/webpack-cli/bin/config-yargs设置了文件的默认名 )
- 也可以在运行时手动指定配置文件名称 npx webpack --config webpack.config.my.js
- 在package.json中配置脚本
"scripts": 
    "build": "webpack --config webpack.config.my.js"
  },

## 安装webpack-dev-server (起一个开发服务)
- webpack-dev-server -D
"scripts": 
    "dev": "webpack webpack-dev-server"
}

## html和样式处理
  - 安装 html-webpack-plugin， 在src下建index.html，使用这个插件会以src下的index.html位模版，在指定的输出文件目录建- index.html,并自动插入相应的js

  - npm i style-loader css-loader -D  （处理文件，并生成<style></style>标签插入index.html）
  - npm i less less-loader -D (处理less文件,并在配置文件进行相应配置)

  - npm i mini-css-extract-plugin -D  (样式抽离插件，将样式抽离放在<link>标签中，避免直接放在style中造成加载堵塞)

  - npm i postcss-loader autoprefixer (增加浏览器前缀) 此时要写一个浏览器前缀的配置文件postcss.config.js

  - npm i optimize-css-assets-webpack-plugin (webpack优化项 压缩css)
  - npm i uglifyjs-webpack-plugin (webpack优化项 js 默认情况是压缩js的但是若配置了optimization就得使用这个插件压缩js)

## js高级语法转为es5
  - npm i babel-loader @babel/core @babel/preset-env -D （基本的es6转化为es5）
  - npm i @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators -D （class以及装饰类的语法转化包）
  - npm i @babel/runtime
  - npm i @babel/plugin-transform-runtime -D (抽取js公共部分)
  - npm i @babel/polyfill (补丁实现js高级语法)

## 代码校验eslint
- npm i eslint eslint-loader -D
- 配置eslint校验，以及增加eslint配置文件(此次未添加)

##全局变量引用问题
- 1） expose-loader 暴露到window上

 npm i expose-loader -D
 webpack配置文件中增加 {
          test: require.resolve('jquery'),
          use: 'expose-loader?$'
        }, 
- 2） providePlugin 给每个模块提供一个$（以引入jquery为例）
- 3） 在index.html中引入jquery，然后页面使用 import $ from 'jquery'(引用不打包)

## webpack打包图片
- 1）在js中创建图片来引入 npm i file-loader
- 2）css中引入
- 3）html中src引入 npm i html-withimg-loader
- 4) 将图片转换成base64 npm i url-loader

## 打包文件分类
- publicPath

## 配置source-map (源码映射)
- devtool: 'source-map', //源码映射,会单独生成一个sourcemap文件，出错了会标识当前报错的行和列（大且全）
- devtool: 'eval-source-map', //不会产生单独的文件,可以显示行和列
- devtool: 'cheap-module-source-map', //不会产生列，但是是一个单独的映射文件，用的不多
- devtool: 'cheap-module-eval-source-map', //不会产生文件，集成在打包文件中，不会产生列

## webpack小插件应用
- 1）cleanWebpackPlugin （第三方） // 每次打包的时候清空输出文件夹（build文件夹）
- 2) copyWebpackPlugin（第三方） // 进行文件复制
- 3) bannerPlugin (webpack内置) // 版权声明插件

## webpack实现跨域(三种方式)
- 1）proxy代理
proxy: {
         '/api': 'http://localhost:3000' // 配置了一个代理
       }
- 2）前端只想mock数据(端时不需要服务方)
before(app){
          app.get('/api/user', (req,res) => {
           res.json({name: '我在认证学子'})
           })
        }
- 3) 有服务端，不用代理来处理，通过服务端启动webpack，这样前后端就不存在跨域了，代码如下
let express = require('express')

let app = express()
let webpack = require('webpack')
let middle = require('webpack-dev-middleware')
let config = require('./webpack.config.js')
let compiler = webpack(config)
app.use(middle(compiler))
app.get('api/user', (res,req)=> {
  res.json({name: '我在学习'})
})

app.listen(3000)

然后node service.js（本地没生效）
## resolve属性的配置
-  resolve: { // 解析第三方包
      modules: [path.resolve('node_modules')],
      // mainFiles:['style, main'], // 主文件
      // alias:{ // 别名 vue vue.runtime
        extensions: ['.js', '.css', '.vue'] //导入文件未写后缀时，查找的顺序
      // }
    }

##定义环境变量
- webpack自带插件 
new webpack.DefinePlugin({ 
        DEV: JSON.stringify('dev') // 定义环境变量
      }),
##区分不同环境
- 不同环境使用不同的配置文件，安装webpack-merge，可讲基础配置文件和不同环境的配置文件结合
let { smart } = require('webpack-merge')
let base = require('./webpack.base.js')

module.exports = smart(base, {
    mode: 'development',
    devServer: {},
    
})

## webpack优化项
- 1） noparse 
    module: { // 模块
      noParse: /jquery/, // 不去解析jquery中的依赖库（若知道某哥包并没有依赖项就可以这样做）
      // loder
      rules:[

- 2）     {
          test: /.js$/,
          exclude:/node_modules/, // 不解析node_modules下的js文件
          include: path.resolve('src'), // 只解析src下的js文件
          use:{
            loader: 'babel-loader',
            options: {
              presets
- 3  已moment包为例,只用了其中的一个方法，所引入的包却很大，moment中有不同版本的语言包，若只用中文的，就不需要全部引入所有语言吧，而是自己单独引用中文语言包，可以受用webpack的自带插件，new webpack.IgnorePlugin(/\.\/locale/, /moment/

## webpack自带优化项
- import 在生产环境下，会自动去除掉没用的代码，叫tree-shaking 把没用到的代码去掉，得是import方式
- scope hosting 作用域提升

## 抽取公共代码
- 非单页应用可以使用这项优化
optimization: {
  splitChunks: { // 分割代码块
    cacheGroups: { //缓存组
      common: { // 公共的模块
        chunks: 'initial',
        minSize: 0,
        minChunks: 2,
      },
      // 第三方代码抽离
      vendor:{
        priority: 1, //权重
        test:/node_modules/,
        chunks: 'initial',
        minSize: 0,
        minChunks: 2,
      }
    }
  }
}
## 懒加载
- // es6草案中的语法，支持加载文件
- npm i  @babel/plugin-syntax-dynamic-import -D
- plugin : [
  '@babel/plugin-syntax-dynamic-import'
]
- import ('./a.js').then(data => {
  console.log(data.default) // 默认在default下
})
- vue react 路由懒加载
  
## 热更新
- devServer: {
  hot: true
}
- plugins:[
  new webpack.NameModulesPlugin() //打印更新的模块路径
  new webpack.HotModuleReplacementPlugin() //热更新插件
]

- import str from './a.js'
- console.log(str)
- if(module.hot){
  module.hot.accept('./a.js',()=>{
    let str = require('./a.js)
    console.log(str)
  })
}