const fs = require('fs')
const path = require('path')

/**
* @description: 递归创建文件夹
* @param { string } dirpath
* @return: 
* */
function mkdir(dirpath, dirname){
  //判断是否是第一次调用
  if(typeof dirname === "undefined"){ 
    if(fs.existsSync(dirpath)) return;
    else mkdir(dirpath,path.dirname(dirpath))
  }else{
    try{
      //判断第二个参数是否正常，避免调用时传入错误参数
      if(dirname !== path.dirname(dirpath)){ 
        mkdir(dirpath);
        return;
      }
      if(fs.existsSync(dirname)){
        fs.mkdirSync(dirpath)
      }else{
        mkdir(dirname,path.dirname(dirname));
        fs.mkdirSync(dirpath);
      }
    }catch(e){
      return false
    }
  }
}

module.exports = {
  readFileSync: (fileName) => fs.readFileSync(path.join(__dirname, '../'+fileName), 'utf8'),
  /*
  *  被定向到 serve 目录下
   * 
  */ 
  readFile: (fileName) => new Promise((resolve, reject)=>{
    fs.readFile(path.join(__dirname, '../'+fileName),{encoding:'utf-8'}, function(error, data){    //读取文件，回调函数第一个参数表示错误信息，第二个参数为读取的文本内容
      if(error) reject(error)
      else resolve(data)
    })
  }),

  /**
  * @description: 异步写入文件
  * @param { string } fileName
  * @param { any } data
  * @param { object } options
  * @return: Promise
  * */
  writeFile: (fileName, data, options={ 'flag': 'a' })=>new Promise((resolve, reject)=>{
    if(typeof data !== "string") data = JSON.stringify(data)
    const filePath = path.join(__dirname, '../'+fileName.replace('/'+fileName.split('/').pop(),''))
    // 父目录不存在揪去创建
    if(!fs.existsSync(filePath)) mkdir(filePath)
    fs.writeFile(path.join(__dirname, '../'+fileName), data, options, (error, data)=>{
      if(error) reject(error)
      else resolve({code: 200, data, msg: "success!" })
    })
  }),
  readdir: (fileName) => new Promise((resolve, reject)=>
  {
    fs.readdir(path.join(__dirname, '../'+fileName), function(error, data){    //读取文件夹下的相关文件名称。
      if(error) reject(error)
      else resolve(data)
    })
  })
}