const router = require('koa-router')()
const fs = require("fs")
const path = require("path")
const { signToken } = require('../libs/token')
const { verify } = require('../controller/verify')
const { article, articles, articlePage, tagPage, homePage } = require("../controller")

// 加载导入目录下的js
;(() => fs.readdirSync(__dirname)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => {
    const file_name = file.substr(0, file.length - 3);
    const file_entity = require(path.join(__dirname, file));
    if (file_name !== "index") {
      router.use(`/${file_name}`, file_entity.routes(), file_entity.allowedMethods())
    }
  })
)()

router.get('/auth', async ctx =>{
  const { auth } = ctx.request
  return ctx.body = { "code": 200, auth }
})
router.get('/verify', verify)
router.get('/article/:id', articlePage)
router.get('/tag/:tag', tagPage)
router.get('/tag/:tag/:page', tagPage)
router.get('/seach/:s/:page', tagPage)
router.get('/tag', tagPage)
router.get('/json/article/:id', article)
router.get('/json/articles', articles)
router.get('/', homePage)
router.get('/:page', homePage)
// 404 page
router.get('*', async ctx => {
  await ctx.render('error', {
    title: '404 error!'
  })
})

module.exports = router