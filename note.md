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

