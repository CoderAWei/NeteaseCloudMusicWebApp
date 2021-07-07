// 歌曲相关
import request from '@/utils/request'
import { handleFormatPlaylist, handleFormatTopList } from './format'

// 获取排行榜列表
export const GetTopList = () => {
  return request({
    url: '/toplist',
    method: 'POST'
  }).then(handleFormatTopList)
}

// 获取我的歌单列表
export const GetPlayList = (data: {uid: number}) => {
  return request({
    url: '/user/playlist',
    method: 'POST',
    data
  }).then(handleFormatPlaylist)
}

// 获取歌单详情
export const GetPlayListDetail = (params: {id: number}) => {
  return request({
    url: '/playlist/detail',
    method: 'GET',
    params
  })
}
