# avv project

本来只是打算写一下爬虫的，但是慢慢某个夜深人静的夜晚看到了某篇文章，还没有后续了， 然后就跑去把他整个网站爬下来了（那种小网站搜索也没有一个， 难受）。 然后呢数据爬下来了要写个前端页面来展示嘛， 还有要个搜索分类分页啊这些功能嘛，线上开了端口又怕那个狗比搜索引擎给我怕过去了， 然后又写了一个认证权限管理的。。。。emmm， 无底洞咯

## 开始部署
 页面这里就不做展示了， 直接先来说说怎么部署吧
### 数据库部分

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