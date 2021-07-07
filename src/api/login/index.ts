import request from '@/utils/request'

// 通过手机号码登录
export const LoginByPhone = (data: Object) => {
  return request({
    url: '/login/cellphone',
    method: 'POST',
    data
  })
}
// 获取登录状态
export const LoginStatus = () => {
  return request({
    url: '/login/status',
    method: 'POST'
  })
}
