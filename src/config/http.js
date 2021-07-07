import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui'

axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? '//www.xzw999.com/music' : '//localhost:3000'

axios.defaults.withCredentials = true

axios.defaults.timeout = 5000

// 请求拦截器
axios.interceptors.request.use(config => {
  if (/get/i.test(config.method)) {
    config.params = config.params || {}
    config.params.t = Date.parse(new Date()) / 1000 // 添加时间戳
  }
  console.log(`正在请求 ${config.url}`)
  return config
}, err => {
  Message.error(err)
  return Promise.reject(err)
})

// 响应拦截器
axios.interceptors.response.use(res => {
  return res.data
}, err => {
  console.log(`${err.response.config.url} 请求失败`)
  console.log(err.response)
  switch (err.response.status) {
    case 404:
      Message.error(err.response.data.message)
      break
    case 301:
      router.push('/login')
      break
  }
  return Promise.reject(err)
})

export default axios
