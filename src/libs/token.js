const JWT = require('jsonwebtoken')
const { _exp, _secret } = require('../config')

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
  const token = ctx.request.headers["authorization"] || ctx.request.body.authorization
  if(token){
    return verifyToken(token).then(async ({ id })=>{
      ctx.request.auth = { id }
      ctx.request._uid = id
      await next()
    }).catch(()=>{
      // console.log(e)
      return ctx.body = {code: 401,msg: "Token is verify !"}
      // ctx.response.status = 401
      // ctx.throw(401)      
    })
  }else await next()
}

module.exports={
  signToken,
  verifyToken,
  koaToken
}