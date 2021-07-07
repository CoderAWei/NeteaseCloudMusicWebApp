// 歌曲相关
import request from '@/utils/request'
import { handleFormatMusicComment } from './format'

interface ICommentParams {
  id: number,
  limit?: number,
  offset: number,
  before?: number // 上一页最后一项的time，评论数超过5000时使用
}

// 歌曲是否有版权
export const MusicCanPlay = (data: {id: string}) => {
  return request({
    url: '/check/music',
    method: 'POST',
    data
  })
}

// 获取音乐URl
export const GetMusicUrl = (params: {id: string}) => {
  return request({
    url: '/song/url',
    method: 'GET',
    params
  })
}

// 获取音乐详情
export const GetMusicDetail = (params : {ids: string}) => {
  return request({
    url: '/song/detail',
    method: 'GET',
    params
  })
}

// 获取音乐歌词
export const GetMusicLyrics = (params : {id: string}) => {
  return request({
    url: '/lyric',
    method: 'GET',
    params
  })
}

// 获取用户喜欢歌曲列表
export const GetLikeList = (params : {uid: number}) => {
  return request({
    url: '/likelist',
    method: 'GET',
    params
  })
}

// 喜欢歌曲
export const LikeMusic = (params : {id: number, like?: boolean}) => {
  return request({
    url: '/like',
    method: 'GET',
    params
  })
}

// 获取评论
export const GetMusicComment = (params: ICommentParams) => {
  return request({
    url: '/comment/music',
    method: 'GET',
    params
  }).then(handleFormatMusicComment)
}
