let fs = require('fs')
let path = require('path')
// babylon 主要是把源码转换成ast
// @babel/traverse  遍历节点
// @babel/types  节点替换
// @babel/generator  生成
let babylon = require('babylon')
let t = require('@babel/types')
let traverse = require('@babel/traverse').default 
let generator = require('@babel/generator').default

let ejs = require('ejs')


class Compiler {
    constructor(config) {
      this.config =config
      // 需要保存入口文件的路径
      this.entryId; // './src/index.js'
      // 需要保存所有的模块依赖
      this.modules = {}
      this.entry = config.entry; //入口文件路径
      // 工作路径
      this.root = process.cwd()
    }
    // 获取源码
    getSource (modulePath) {
      let rules = this.config.module.rules;
      let content = fs.readFileSync(modulePath, 'utf8')
      // 拿到每个规则来处理
      for(let i = 0; i < rules.length; i++){
        let rule = rules[i]
        let { test, use } = rule
        let len = use.length - 1
        if (test.test(modulePath)) { //这个模块需要通过loader来转化
          // loader获取对应的loader函数
          function normalLoader() {
            let loader = require(use[len--]);
            content=loader(content)
            // 递归调用loader 实现转化功能
            if(len>=0){
              normalLoader()
            }
          }
          normalLoader()
        }
      }
      return content
    }
    // 解析源码
    parse (source, parentPath) { // AST解析语法树
      // https://astexplorer.net/ ast结构
      let ast = babylon.parse(source)
      let dependencies = []; // 依赖的数组
      traverse(ast, {
        CallExpression(p){ // a() require()
          let node = p.node; // 对应的节点
          if (node.callee.name === 'require') {
            node.callee.name = '__webpack_require__';
            let moduleName = node.arguments[0].value; // 取到的就是模块引用的名字
            moduleName = moduleName + (path.extname(moduleName)? '': '.js');
            moduleName = './' + path.join(parentPath, moduleName); // 'src/a.js'
            console.log(moduleName)
            dependencies.push(moduleName)
            node.arguments = [t.stringLiteral(moduleName)] //改源码
          }

        }
      })
      let sourceCode = generator(ast).code
      return {sourceCode, dependencies}
    }
    buildModule(modulePath, isEntry){
        // 拿到模块的内容和id
    let source = this.getSource(modulePath)
    // 模块id modulePath = modulePath - this.root
    let moduleName = './' + path.relative(this.root, modulePath)
    console.log(moduleName)
    // console.log(source, moduleName)
    if (isEntry) {
        this.entryId = moduleName; //保存入口
    }
    // 解析需要把source源码进行改造，返回一个依赖列表（path.dirname(moduleName)返回当前路径的父路径src）
    let { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName))
    // console.log('222',sourceCode,dependencies)
    // 把相对路径和模块中的内容对应起来
    this.modules[moduleName] = sourceCode
    dependencies.forEach(dep => { // 依赖模块的递归加载
      this.buildModule(path.join(this.root, dep), false)
    })
    }
    emitFile () {
      // 用数据 渲染文件 ejs
      // 拿到输出到那个目录下
      let main = path.join(this.config.output.path, this.config.output.filename);
      // 模版的路径
      let templateStr = this.getSource(path.join(__dirname, 'main.ejs'))
      // console.log(templateStr)
      let code = ejs.render(templateStr, {entryId: this.entryId, modules: this.modules});
      // let code = "console.log(123)"
      // console.log(111, code)
      this.assets = {}
      // 资源中路径对应的代码
      this.assets[main] = code;
      fs.writeFileSync(main, this.assets[main])
    }
    run () {
      // 执行，并且创建模块的依赖关系
      this.buildModule(path.resolve(this.root,this.entry), true)
      // console.log(this.modules, this.entryId)
      // 发射一个文件（打包后的文件）
      this.emitFile();
    }
}
module.exports = Compiler