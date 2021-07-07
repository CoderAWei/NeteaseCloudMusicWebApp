/*
 * @Author: XuZhongWei
 * @Date: 2021-03-15 10:27:00
 * @Last Modified by: XuZhongWei
 * @Last Modified time: 2021-03-15 17:27:36
 */

// 搜索相关
import request from '@/utils/request'
import { handelFormatSearchRes } from './format'

// 获取默认搜索关键词
export const GetSrachDefault = () => {
  return request({
    url: '/search/default',
    method: 'GET'
  })
}

// 搜索
export const HandleSearch = (params: {keywords: string, limit: number, offset: number}) => {
  return request({
    url: '/cloudsearch',
    method: 'GET',
    params
  }).then(handelFormatSearchRes)
}

// 搜索建议
export const GetSearchSuggest = (params: {keywords: string, type: string}) => {
  return request({
    url: '/search/suggest',
    method: 'GET',
    params
  })
}

// 热搜列表
export const GetSearchHot = () => {
  return request({
    url: '/search/hot/detail',
    method: 'GET'
  })
}
