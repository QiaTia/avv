const $http = require("./libs/http")
const cheerio = require('cheerio')
// 14131
// 文件操作
const { readFile, writeFile } = require("./libs/file")
const { $query } = require('./libs/util')

const items = ['xycs','llxs','jtll','gdwu','dsjq'],
  _fail = 'log/fail.json'


const getPage = (targe) => {
  return new Promise((resolve, reject)=>{
    $http.get(targe).then(res=>{
      const $ = cheerio.load(res, {decodeEntities: false})
      const $container = $('div.container div.layout-box')
      const content = $container.find('.details-content p').html()
      const time = $container.find('.news_details .news_top span').text().replace("时间：", '')
      const description = $container.find('.news_details h1').text()
      resolve({ content, time, description })
    }).catch(reject)
  })
}

const getData = async () => {
  const fail = []
  for(const cate of items){
    const { data } = JSON.parse(await readFile(`log/success_${cate}.json`))
    console.log(cate)
    continue
    for(const href of Object.keys(data)){
      // if(data[href]) continue
      try{
        const { content, time, description } = await getPage(href)
        console.log(description, 'is doen!')
        data[href] = true
        $query('INSERT INTO `avv2` (`title`, `description`, `content`, `time`, `cate`, `href`) VALUES(?,?,?,?,?,?)',[description,description,content,time,cate,href])
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
  }
  writeFile(_fail, { "data": fail, d: Date.now() }, {})
    .then(()=>process.exit(0))
}

getData()