let str = require('./a.js')
require('@babel/polyfill')
console.log(str)
require('./index.css')
require('./index.less')
let a = () => {
    return 2
}
console.log(a())

@log
class A {
    a=1
}

let b = new A();
console.log(b.a)

function log (target) {
    console.log(target)
}

a.includes('s')
