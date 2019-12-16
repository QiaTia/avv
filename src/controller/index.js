const { $query, $toNum, $calcPage } = require('../libs/util')

let tagList = []

;(async () =>{
  return (await $query("SELECT distinct `cate` FROM `avv`")).map(({cate})=>tagList.push(cate))
})()

// setTimeout(()=>console.log(tagList),1e3)
// 单条文章内容查询
const articleQuery = async function(id){
  const [ data ] = await $query("SELECT * FROM `avv` WHERE `id` = ? ", [id])
  if(!data) throw "this artile is not exist!"
  return data
}

// 数据查询
const articlesQuery = async function({ s='',page=1, tag='', page_size, order_index = 'id', order_way='DESC' }){
  const { limit, pageSize } = $calcPage(page, page_size)
  const count = $toNum(await $query("SELECT count(*) FROM `avv` WHERE `title` LIKE ? AND `cate` LIKE ?",[s.toLike(), tag.toLike()]))
  const data = await $query("SELECT `id`,`title`,`content`,`time`,`cate` FROM `avv` WHERE `title` LIKE ?  AND `cate` LIKE ? ORDER BY `"+order_index+"` "+order_way+"  LIMIT ?, ?", [s.toLike(), tag.toLike(), limit, pageSize])
  // 对数据遍历处理
  data.map(item=> {
    item.content = item.content.substr(0,300).replace(/<[^>]+>/g, "")
    return item
  })
  return { data, page, pageSize, count }
}


module.exports = {
  article: async (ctx)=>{
    const id = ctx.params.id || ctx.query.id
    try{
      const data = await articleQuery(id)
      ctx.body = { code:200, data }
      // 查询一次增加一次
    }catch(e){
      ctx.body = { code:400, msg: "No Data!", e }
    }
  },
  articles: async (ctx)=>{
    const { s, page, tag, page_size, order_index, order_way } = ctx.query
    // const { limit, pageSize } = $calcPage(page, page_size)
    try{
      const data = await articlesQuery({s, page, tag, page_size, order_index, order_way })
      ctx.body = { code:200, data }
    }catch(e){
      ctx.body = { code:400, msg:"No Data"}
      console.log(e)
    }
  },
  articlePage: async (ctx)=>{
    const id = ctx.params.id || ctx.query.id
    try{
      const data= await articleQuery(id)
      if(!data) throw "this artile is not exist!"
      return ctx.render('article', {...data, tag:{tag: data.cate}, tagList})
    }catch(e){
      ctx.body = { code:400, msg: "No Data!", e }
    }
  },
  tagPage: async (ctx)=> {
    const tag = ctx.params.tag || ctx.query.tag
    const s = ctx.params.s || ctx.query.s
    const page = ctx.params.page || ctx.query.page
    try{
      const data = await articlesQuery({s, tag, page})
      return ctx.render('tag', {...data, tag:{ tag, s }, tagList})
    }catch(e){
      ctx.body = { code:400, msg:"No Data"}
    }
  },
  homePage: async (ctx)=> {
    const page = ctx.params.page || ctx.query.page
    try{
      const data = await articlesQuery({ page })
      return ctx.render('index', { ...data, tag: {}, tagList })
    }catch(e){
      ctx.body = { code:400, msg:"No Data"}
    }
  }
}