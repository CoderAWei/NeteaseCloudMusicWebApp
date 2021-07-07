/*
 * @Author: XuZhongWei
 * @Date: 2021-02-26 09:11:13
 * @Last Modified by: XuZhongWei
 * @Last Modified time: 2021-03-18 15:31:21
 */

//  底部菜单
export interface ITabMenu {
  id: number,
  name: string,
  linkto: string,
  icon?: string
}

// 歌曲详情里歌手信息
type artist = {
  id: number,
  name: string,
}

// 歌曲详情里专辑信息
type album = {
  id: number,
  name: string,
  picUrl: string
}

export interface ILyric {
  time: number,
  lyric: string,
  uid: number
}

// 歌曲详情
export interface IMusicDetail {
  name: string,
  id: number,
  artist: artist,
  album: album
}

// 当前播放歌曲信息
export interface IMusicInfo extends IMusicDetail {
  url: string,
  ids?: number[], // 当前播放列表的所有歌曲的id
  isVip: boolean, // 当前音乐是否需要VIP
  lyric: ILyric[],
  like?: boolean
}

// 排行榜列表
export interface ITopListInfo {
  id: number, // 歌单id
  name: string, // 歌单名称
  updateFrequency?: string, // 更新频率
  updateTime?: number, // 更新时间
  coverImgUrl: string, // 歌单封面
  trackCount: number // 当前排行榜歌曲总数
}

// 某一个榜单的详情
type ICreator = {
  nickname: string,
  signature: string,
  description: string,
  backgroundUrl: string,
  avatarUrl: string,
  identityIconUrl?: string
}
export interface ITopListDetailInfo {
  id: number,
  ids?: number[],
  name: string,
  coverImgUrl: string,
  updateTime: string, // 要对时间进行格式化
  trackCount: number, // 歌曲总数
  playCount: number | string, // 总播放数，要进行格式化
  description: string, // 歌单描述
  shareCount: string, // 歌单被分享总数
  commentCount: string, // 歌单被评论总数
  creator: ICreator,
  track: IMusicDetail
}

// 评论
type Comment = {
  nickname: string,
  avatarUrl: string,
  content: string,
  time: number,
  timeStr: string,
  likedCount: number
  liked: boolean
  isVip?: boolean, // 是否是vip 通过 vipType判断
}

export interface ICommentInfo {
  hotComments: Comment[]
  comments: Comment[],
  total: number, // 总共的评论数
  showTotal: string // 展示在播放页的评论总数
}
