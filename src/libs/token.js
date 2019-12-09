const JWT = require('jsonwebtoken')
const { _exp = 1*8.64e4, _secret } = require('../config')

const signToken = function (user){
  return JWT.sign(user, _secret, { expiresIn: _exp});
}

const verifyToken = function(token){
  return new Promise((resolve, reject)=>{
    JWT.verify(token, _secret, function (err, decode) {
      if (err) {       
        reject(err)           
      } else {
        resolve(decode)
      }
    })
  })
}

const koaToken = async function(ctx, next){
  const token = ctx.cookies.get('authorization')||ctx.request.headers["authorization"]
  if(token){
    return verifyToken(token).then(async ({ id })=>{
      console.log(id)
      ctx.request.auth = { id }
      ctx.request._uid = id
      await next()
    }).catch(()=>{
      ctx.cookies.set('authorization', '')
      ctx.response.redirect('/verify?targe='+targe)
      // return ctx.body = {code: 401, msg: "Token is verify !"}  
    })
  }else{
    const targe = ctx.request.url
    if(!/^\/verify/.test(targe) && !/\.[A-z]+$/.test(targe)) ctx.response.redirect('/verify?targe='+targe)
    await next()
  }
}

module.exports={
  signToken,
  verifyToken,
  koaToken
}