/*
 * @Author: XuZhongWei
 * @Date: 2021-03-10 16:51:58
 * @Last Modified by: XuZhongWei
 * @Last Modified time: 2021-03-11 17:23:45
 */
// 歌单相关

import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IMusicDetail, ITopListDetailInfo } from '@/typings'
import { SET_CUR_PLAYLIST } from '../types'
import { GetPlayListDetail } from '@/api/toplist'
import { handleFormatTime } from '@/utils'

const handleCraetor = (data: any) => {
  return {
    nickname: data.nickname,
    signature: data.signature,
    description: data.description,
    backgroundUrl: data.backgroundUrl,
    avatarUrl: data.avatarUrl,
    identityIconUrl: data.avatarDetail ? data.avatarDetail.identityIconUrl : ''
  }
}

const handleTrack = (data: any): IMusicDetail[] => {
  let album:any = {}
  let artist:any = {}
  let name:string = '' // 暂存的歌手名称
  let id:number = 0
  let songName:string = '' // 歌曲名称
  const res: IMusicDetail[] = []
  data.forEach((music: any) => {
    name = ''
    songName = music.name
    id = music.id
    album = {
      id: music.al.id,
      name: music.al.name,
      picUrl: music.al.picUrl
    }
    music.ar.forEach((ar: any) => {
      name += `${ar.name}/`
      artist = {
        name: name.slice(0, name.length - 1),
        id: ar.id
      }
    })
    res.push({
      name: songName,
      id,
      album,
      artist
    })
  })
  return res
}

const handleIds = (data: any): number[] => {
  const ids: number[] = []
  data.forEach((item: any) => {
    ids.push(item.id)
  })
  return ids
}

@Module({ dynamic: true, store, namespaced: true, name: 'playlist' })
class Playlist extends VuexModule {
  curPlaylist = {}

  get getCurPlaylist() {
    return JSON.parse(localStorage.curPlaylist)
    // return this.curPlaylist
  }

  @Mutation
  SET_CUR_PLAYLIST(payload: ITopListDetailInfo) {
    this.curPlaylist = payload
    localStorage.setItem('curPlaylist', JSON.stringify(payload))
  }

  @Action({ rawError: true })
  handleToTopListDetail(id: number) {
    return new Promise((resolve, reject) => {
      GetPlayListDetail({ id }).then(res => {
        const { playlist } = res
        const creator = handleCraetor(playlist.creator)
        const tracks = handleTrack(playlist.tracks)
        const ids = handleIds(playlist.trackIds)
        const updateTime = handleFormatTime(playlist.updateTime)
        const obj = {
          id: playlist.id,
          ids,
          name: playlist.name,
          coverImgUrl: playlist.coverImgUrl,
          updateTime, // 要对时间进行格式化
          trackCount: playlist.trackCount, // 歌曲总数
          playCount: playlist.playCount, // 总播放数，要进行格式化
          description: playlist.description, // 歌单描述
          shareCount: playlist.shareCount, // 歌单被分享总数
          commentCount: playlist.commentCount, // 歌单被评论总数
          creator,
          tracks
        }
        this.context.commit(SET_CUR_PLAYLIST, obj)
        resolve({ code: 200 })
      }).catch(e => reject(e))
    })
  }
}

export const PlaylistModule = getModule(Playlist)
