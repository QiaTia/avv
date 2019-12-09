const { $query } = require('../libs/util')
const { signToken } = require('../libs/token')

const verify = async (ctx)=>{
  const { _uid } = ctx.request
  const { targe = '', secret = '' } = ctx.query
  if(_uid) ctx.response.redirect(targe||'/')
  else {
    const { id, info } = await secret_verify(secret)||{}
    if(!id){
      const msg = '你输入的密钥不正确, 请重试!'
      return ctx.render('verify', { title: "认证", secret, targe, msg })
    }
    const token = signToken({ id })
    ctx.cookies.set('authorization', token)
    ctx.response.redirect(targe||'/')
    updata_verify(id, JSON.parse(info||'[]'), ctx.query, ctx.request)
  }
}

const secret_verify = async(secret)=>{
  const [ data ] = await $query('SELECT `id`,`info` FROM `secret` WHERE `secret` = ?', [secret])
  return data
}

const updata_verify = async(id, info, query, request)=>{
  info.push({ query, request, "time": Date.now()})
  $query("UPDATE `secret` SET `info` = ? WHERE `id` = ?", [JSON.stringify(info), id])
    .then(e=>console.log('资料更新成功!',e))
    .catch(console.log)
}

module.exports ={
  verify
}