/*
 * @Description: 
 * @Author: QiaTia
 * @Date: 2019-07-25 14:35:33
 * @LastEditors: QiaTia
 * @GitHub: https://github.com/QiaTia/
 * @LastEditTime: 2019-09-07 14:50:19
 */
const mysql = require('mysql');
const { sql_config, _pageSize } = require('../config/')
const { writeFile } = require('./file')
String.prototype.toLike=function(){
  return '%'+this+'%'
}

const mysqli = mysql.createConnection(sql_config);
// 链接数据库
mysqli.connect()

/**
 * @description: 异步记录log日志
 * @param { any } log
 * @param { string } log 
 * @return: Promise
 */
async function $log(log, ti = 'logs'){
  const Now = new Date()
  const filePath = `/log/${ti}/${Now.getUTCFullYear()}-${Now.getMonth()+1}/${Now.getDate()}.txt`
  const fileVal = `${Now.toLocaleString()}:\n ${JSON.stringify(log)}\n`
  return writeFile(filePath, fileVal)
}


/**
 * @description: 异步执行SQL语句
 * @param { sql, params } 
 * @return: Promise
 */
const $query = (sql, params = [])=>{
  return new Promise((resolve,reject)=>{
    mysqli.query(sql, params, (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  })
}

/**
 * @description: 强制提取对象中的数字
 * @param obj
 * @return: { type:Number } 
 */
const $toNum = (obj)=>{
  return ~~(JSON.stringify(obj).replace(/\D/g,''))
}
/**
 * @description: 数据库分页计算 
 * @param page
 * @return:  { limit, pageSize } 
 */
const $calcPage = (page, page_size = _pageSize)=>{
  page_size = parseInt(page_size)
  const limit = (page-1) * page_size
  return { limit, pageSize: page_size }
}

/**
 * @getClientIP
 * @desc 获取用户 ip 地址
 * @param {Object} req - 请求
 */
function getClientIP(req) {
  return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    req.headers['x-real-ip']||'127.0.0.1'
}



module.exports = {
  $query,
  $calcPage,
  $toNum,
  getClientIP,
  $log
}