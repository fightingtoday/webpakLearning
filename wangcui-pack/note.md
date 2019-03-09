## 手写webpack第一步
- 1. 新建项目wangcui-pack, npm init 
- 2. 在package.json中添加  "bin": {
    "wangcui-pack": "./bin/wangcui-pack.js"
  }
创建wangcui-pack命令
- 3. 新建bin目录，新建wangcui-pack.js， #! /usr/bin/env node 表示该文件的运行环境（注意是usr不是user）
- 4. npm link (创建链接，把当前包连接到全局下，并生产全局命令)
- 5. 新建另一个被打包的项目 webpack-dev,进行过npm link wangcui-pack, 运行npx wangcui-pack可打印出结果