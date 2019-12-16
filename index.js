const $http = require("./src/libs/http")
// const cheerio = require('cheerio')
// 文件操作
const { readFile, writeFile } = require("./src/libs/file")
// 数据库操作
// const { $query } = require('./libs/util')

$http.get('https://www.smzdm.com/jingxuan/json_more?filter=s0f163t0b0d0r0p1')
  .then(({article_list})=> writeFile('log/zdm.json', article_list.map(({article_id,article_title,article_price,article_pic_url,article_timesort, article_content,article_link})=>({"id":article_id,"title":article_title,"content":article_content,"price":article_price,"pic":article_pic_url,"time":article_timesort,"link":article_link}))))




//  super_product 
// $http.get('https://www.smzdm.com/jingxuan/super_product?rank_id=5')
//   .then(({list})=> writeFile('log/zdm.json', list.map(({article_id,article_title,article_price,article_pic,article_pubdate})=>({id:article_id,title:article_title,price:article_price,pic:article_pic,time:article_pubdate}))))
