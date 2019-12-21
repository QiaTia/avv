const config = {
  sql_config:{  // 数据库配置
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'avv',
    timezone: "08:00"
  },
  _pageSize: 12,  //文章每页显示
  _exp: 1*8.64e4,// token 过期时间
  _secret: "tia", // token 密钥
  _port: 3000 // 运行端口
}
module.exports = config
