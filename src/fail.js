const $http = require("./libs/http")
const cheerio = require('cheerio')
// 文件操作
const { readFile, writeFile } = require("./libs/file")
const { $query } = require('./libs/util')

const _success = 'log/success.json', 
  _fail = 'log/fail.json'

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


const getData = async () => {
  const [ {data}, failArray ] = [
    JSON.parse(await readFile(_success)),
    JSON.parse(await readFile(_fail)).data
  ]
  const fail = []
  const cate = 'xycs'
  for(const href of failArray){
    if(data[href]) continue
    try{
      const { content, time, description } = await getPage(href)
      console.log(description, 'is doen!')
      data[href] = true
      $query('INSERT INTO `avv` (`title`, `description`, `content`, `time`, `cate`, `href`) VALUES(?,?,?,?,?,?)',[description,description,content,time,cate,href])
        .then(e=>{
          console.log(description, 'save success!')
        }).catch(console.log)
      // data.push({ content, time, description, title })
    }catch(e){
      // console.log(e)
      console.log(href, 'is fail!')
      fail.push(href)
    }
  }
  Promise.all([
    // writeFile(_failList, { "data": fail, d: Date.now() }, {}),
    writeFile(_success, { "data": data, d: Date.now() }, {}),
    writeFile(_fail, { "data": fail, d: Date.now() }, {}),
    // writeFile(_filePath, { data, d: Date.now() }, {})
  ]).then(()=>process.exit(0))
}

getData()