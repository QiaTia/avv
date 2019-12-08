const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const Router = require('./routes/index')
const { koaToken } = require('./libs/token')

// const cors = require('koa2-cors')
// error handler
onerror(app)

// logger
app.use(logger())
// 跨域问题
// app.use(cors())
app.use(bodyparser({ enableTypes:['json', 'form', 'text'] }))
app.use(json())
// 封装好的token验证
app.use(koaToken)
// pug 模板渲染
app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// routes
app.use(Router.routes(), Router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app