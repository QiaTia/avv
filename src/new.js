const $http = require("./libs/http")
const cheerio = require('cheerio')
// 文件操作
const iconv = require('iconv-lite');
const { readFile, writeFile } = require("./libs/file")
const { $query } = require('./libs/util')

const _filePath = 'log/avv.json'

const getXsw = function(targe = '/wapbook-37717-3546865/'){
  const baseUrl = 'http://www.366xsw.net', cate = 'xsw'
  $http({
    url: baseUrl+ targe,
    responseType : 'stream' //将数据转化为流返回
  }).then(res=>{
    const chunks = []
    res.on('data',c=>chunks.push(c))
    res.on('end',()=>{
      const $ = cheerio.load(iconv.decode(Buffer.concat(chunks), 'gbk'),{decodeEntities: false})
      const content = $('div#nr1').html()
      const title = $('div#nr_title').text()
      const time = '2019-12-9'
      const next = $("a#pb_next").attr('href')
      $query('INSERT INTO `avv` (`title`, `description`, `content`, `time`, `cate`, `href`) VALUES(?,?,?,?,?,?)',[title,title,content,time,cate,targe])
        .then(e=>{
          console.log(title, 'save success!')
        }).catch(console.log)
      if(next) getXsw(next)
      else process.exit(0)
    })
  })
}

getXsw()