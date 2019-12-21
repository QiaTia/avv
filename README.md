# avv project

本来只是打算写一下爬虫的，但是慢慢某个夜深人静的夜晚看到了某篇文章，还没有后续了， 然后就跑去把他整个网站爬下来了（那种小网站搜索也没有一个， 难受）。 然后呢数据爬下来了要写个前端页面来展示嘛， 还有要个搜索分类分页啊这些功能嘛，线上开了端口又怕那个狗比搜索引擎给我怕过去了， 然后又写了一个认证权限管理的。。。。emmm， 无底洞咯

## 开始部署
 页面这里就不做展示了， 直接先来说说怎么部署吧
### 数据库部分

github传不上大于100m的文件， 后面我就用zip重新压缩了一下
```
gzip -d avv.sql.gz
gzip -d secret.sql.gz
```

```sql
mysql> CREATE DATABASE `avv`;
mysql> use `avv;`
mysql> source avv.sql;
mysql> source secret.sql;
```

### 安装依赖&调试运行
```
npm install
npm run dev
```

## 所用框架

开始就打算做一个小爬虫的， 所以最开始就用axios来发起http请求， 用cheerio来解析html文件， 然后通过fs保存为json文件， 后面数据量实在是有点大了， 就用了mysql来储存数据

最后嘛， 由于数据有了不写个页面展示一下又不太...， 所以就用了koa2全家桶， 搭配pug写了一个应该是MVC的小网站吧，但是我一直是那种乖宝宝， 就这样把东西挂我服务器上实在是有点怕被爬虫爬到。

所以后面又引入了jsonwebtoken通过cookie做了一个简单的时效校权， 把所用访问拦截下来， 需要输入正确的秘钥后才发放一个token存储在cookie中， 没有token的请求统统会被拦截下来， 输入正确的秘钥后重新重定向到开始访问的页面

## 页面

总共也就一个首页，列表页，文章页, 鉴权页. 实现了分页, 搜索, 分类等功能.

## 现有问题

现在搜索那个分页好像还有点问题, 这个问题我也不打算更改咯, 其实也就是分页路由搞得我实在是无能为力哎.

## 爬虫

src下面除了那个app.js外, 其他js都是处理爬虫数据的, 首先index.js手动更改那个变量, 爬虫就会自动抓取列表, 并且依次读取列表链接的文章内容, 如果抓取失败就会保存到数组并且事后写道log/fail.json文件, 页面也是一个手动控制的变量, 从最后一页爬到第一页结束.
```javascript
  ...
const getData = async () => {
  const failArray = [], success = {}, failList = [], data = []
  const cate = 'dsjq'
  let page =  2//163
  while(page){
    try{
      const list = await getList(cate, page)
      for(const { href, title } of list){
        try{
          // 这里就是我们爬到的内容了
          const data = await getPage(href)
        }catch(e){
          failArray.push(href)
        }
      }
    }catch(e){
      failList.push({ cate, page })
    }
    page--
  }
  ...
}
```

这里为了方便, 我都采用了 async await 来处理异步, 这样的话流程倒是方便了许多, 但是牺牲了并发进行爬取, 故而速度慢了不少, 异步并发爬取内容我也有点没啥方向, 等以后再搞吧. 

fail.js 功能就是读取log/fail.json下面的内容, 然后再处理一次咯, 不过那些分类参数还是需要手动替换

re.js 这个是直接读取 success_[].json 这些文件处理, 由于我前期爬的数据是直接抓取文本内容, 那些样式失去了,我后面又重新全部抓取了一下, 就没有再爬取列表了.

## 写在最后

写出来这个项目, 身体是一天不如一天了, 想了许久, 还是传到github上, 我自己还是放弃部署这个项目, 后期也不会在考虑维护了. 后期打算就搞下爬虫方便, 现在/index.js就是我正研究写的抓取张大妈的文件