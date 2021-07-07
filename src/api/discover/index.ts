/*
 * @Author: XuZhongWei
 * @Date: 2021-03-17 11:36:02
 * @Last Modified by: XuZhongWei
 * @Last Modified time: 2021-03-17 11:41:29
 */
import request from '@/utils/request'

// 通过手机号码登录
export const GetBanner = () => {
  return request({
    url: '/banner?type=1',
    method: 'GET'
  })
}
