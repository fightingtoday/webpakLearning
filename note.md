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