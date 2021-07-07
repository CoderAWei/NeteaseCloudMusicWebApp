import request from '@/utils/request'

// 获取每日推荐歌曲
export const GetRecommendSongs = () => {
  return request({
    url: '/recommend/songs',
    method: 'POST'
  })
}
