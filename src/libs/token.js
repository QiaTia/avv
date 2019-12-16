const JWT = require('jsonwebtoken')
const { _exp, _secret } = require('../config')

const signToken = function (user){
  return JWT.sign(user, _secret, { expiresIn: _exp});
}

const verifyToken = function(token){
  return new Promise((resolve, reject)=>{
    JWT.verify(token, _secret, function (err, decode) {
      if (err) reject(err)           
      else resolve(decode)
    })
  })
}

const koaToken = async function(ctx, next){
  const targe = ctx.request.url
  if(/\.[A-z]+$/.test(targe)) return next()
  const token = ctx.cookies.get('authorization')||ctx.request.headers["authorization"]
  if(!token){
    if(!/^\/verify/.test(targe)) return ctx.response.redirect('/verify?targe='+targe)
    return next()
  }else{
    let info = {}
    try{
      info = await verifyToken(token)
    }catch(e){
      ctx.cookies.set('authorization', '')
      return ctx.response.redirect('/verify?targe=' + targe)
    }
    ctx.request.auth = info
    ctx.request._uid = info.id
    await next()
  }
}

module.exports={
  signToken,
  verifyToken,
  koaToken
}