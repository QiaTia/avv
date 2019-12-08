const $http = require("./libs/http")
const cheerio = require('cheerio')
// 文件操作
const { readFile, writeFile } = require("./libs/file")
const { $query } = require('./libs/util')

const _filePath = 'log/avv.json'
const _success = 'log/success.json', _fail = 'log/fail.json', _failList = 'log/fail_list.json'

// 写入文件操作
//   writeFile(_filePath, { data, d: Date.now() }, {})

const getPage = (targe) => {
  return new Promise((resolve, reject)=>{
    $http.get(targe).then(res=>{
      const $ = cheerio.load(res, {decodeEntities: false})
      const $container = $('div.container div.layout-box')
      const content = $container.find('.details-content p').text().replace("时间：", '')
      const time = $container.find('.news_details .news_top span').text()
      const description = $container.find('.news_details h1').text()
      resolve({ content, time, description })
    }).catch(reject)
  })
}

const getList = (cate, page) => {
  return new Promise((resolve, reject)=>{
    const data = []
    
    $http.get(`/${cate}/index${page==1?'':'-'+page}.html`).then(res=>{
      const $ = cheerio.load(res, {decodeEntities: false})
      $('div.layout-box ul.box-topic-list li').each((i, item)=>{
        const $el = $(item).find('a')
        const title = $el.attr('title')
        if(!title) return ;
        const href = $el.attr('href')
        data.push({ title, href })
      })
      resolve(data)
    }).catch(reject)
  })
}

const getData = async () => {
  const failArray = [], success = {}, failList = [], data = []
  const cate = 'xycs'
  let page = 137
  while(page){
    try{
      const list = await getList('xycs', 1)
      console.log(cate, page, ' is sucess!')
      for(const { href, title } of list){
        try{
          const { content, time, description } = await getPage(href)
          console.log(title, 'is doen!')
          success[href] = true
          $query('INSERT INTO `avv` (`title`, `description`, `content`, `time`) VALUES(?,?,?,?)',[title,description,content,time])
            .then(e=>{
              console.log(title, 'save success!')
            }).catch(console.log)
          // data.push({ content, time, description, title })
        }catch(e){
          // console.log(e)
          console.log(title, 'is fail!')
          failArray.push(href)
        }
      }
    }catch(e){
      failList.push({ cate, page })
      console.log(cate, page, ' is fail!')
    }
    page--
  }
  Promise.all([
    writeFile(_failList, { "data": failList, d: Date.now() }, {}),
    writeFile(_success, { "data": success, d: Date.now() }, {}),
    writeFile(_fail, { "data": failArray, d: Date.now() }, {}),
    // writeFile(_filePath, { data, d: Date.now() }, {})
  ]).then(()=>process.exit(0))
}

// $query("SELECT * FROM `avv` LIMIT 0 , 30").then(([item])=>console.log(item))
getData()
// getPage("/xycs/2018/02/6511.html")
// getList('xycs', 1).then(console.log).catch(console.log)