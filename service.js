// 第一种方式
// let express = require('express')

// let app = express()
// app.get('api/user', (res,req)=> {
//   res.json({name: '我在学习'})
// })

// app.listen(3000)

// 第三种方式
let express = require('express')

let app = express()
let webpack = require('webpack')
let middle = require('webpack-dev-middleware')
let config = require('./webpack.config.js')
let compiler = webpack(config)
app.use(middle(compiler))
app.get('/api/user', (res,req)=> {
  res.json({name: '我在学习'})
})

app.listen(3000)