// 封装axios请求
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Dialog, Toast } from 'vant'
import $router from '@/router/index'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000,
  withCredentials: true // 允许携带cookie
})

// 正在请求中的请求列表
const reqList: any[] = []

/**
 * 阻止重复请求
 * @param {Array} reqList - 当前请求列表
 * @param {string} url - 当前请求地址
 * @param {function} cancel - 请求中断函数
 * @param {string} errorMessage - 请求中断是需提示的错误信息
 */
const handleStopRepeatRequest = (reqList: any[], url: any, cancel: any, errorMessage = ''):void => {
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === url) {
      cancel(errorMessage)
      return
    }
  }
  reqList.push(url)
}
/**
 * 允许某个请求可以继续进行
 * @param {array} reqList 全部请求列表
 * @param {string} url 请求地址
 */
const handleAllowRequest = (reqList: any[], url: any):void => {
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === url) {
      reqList.splice(i, 1)
      break
    }
  }
}

// Add a request interceptor
service.interceptors.request.use((config: AxiosRequestConfig) => {
  let cancel
  config.cancelToken = new axios.CancelToken(c => { cancel = c })

  if (config.method === 'get') {
    config.data = {
      ...config.params,
      _t: new Date().getTime()
    }
  }

  // 阻止重复请求
  handleStopRepeatRequest(reqList, config.url, cancel, `${config.url} 正在请求中，请不要重复请求！`)

  return config
}, function(error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
service.interceptors.response.use((res:AxiosResponse) => {
  // 增加延迟，相同请求不得在短时间内重复发送
  setTimeout(() => {
    handleAllowRequest(reqList, res.config.url)
  }, 1000)

  const data = res.data

  if (data.code && data.code !== 200) {
    Toast({
      type: 'fail',
      message: data.msg || 'Error'
    })
    return Promise.reject(new Error('Error'))
  } else {
    return data
  }
}, function(error) {
  if (axios.isCancel(error)) {
    // console.log(error.message)
  } else {
    // 增加延迟，相同请求不得在短时间内重复发送
    setTimeout(() => {
      handleAllowRequest(reqList, error.config.url)
    }, 1000)
  }

  // if (error.message) {
  //   console.log(error.message)
  // } else {
  const { status } = error.response

  if (status === 404) {
    Toast.fail('抱歉，歌曲资源不存在！')
  } else if (status === 301) {
    // Toast.fail('亲爱的，你还没登录哦！')
    Dialog.confirm({
      title: '滴滴~',
      message: '亲爱的，你还没登录哦！',
      confirmButtonText: '现在就去',
      cancelButtonText: '老子不去',
      confirmButtonColor: '#ffb3a7'
    }).then(() => {
      $router.push('/login')
    }).catch(() => {
      Toast.fail('你好歪哦！')
      setTimeout(() => {
        $router.push('/')
      }, 2000)
    })
  } else {
    Toast.fail('请检查你传入的参数哦！')
  }
  // }

  return Promise.reject(error)
})

export default service
