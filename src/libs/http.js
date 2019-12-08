const axios = require('axios')
const Qs = require('qs')
const baseURL = 'https://www.avv003.com'
const http = axios.create({
  baseURL,
  timeout: 1e4,
  headers:{'Content-Type':'application/x-www-form-urlencoded'},
  transformRequest: [function ( data = {} ) {
    return Qs.stringify(data)
  }]
})

http.interceptors.request.use(config =>  config, err =>  Promise.reject(err))

http.interceptors.response.use(({data}) =>data, err =>  Promise.reject(err))

module.exports = http