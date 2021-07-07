/*
 * @Author: XuZhongWei
 * @Date: 2021-03-15 17:27:01
 * @Last Modified by: XuZhongWei
 * @Last Modified time: 2021-03-16 15:48:53
 */

import { IMusicDetail } from '@/typings'

interface ISearchRes {
  songCount: number, // 推荐歌曲总数
  ids: number[],
  musicDetail: IMusicDetail[]
}

export const handelFormatSearchRes = (res: any): ISearchRes|boolean => {
  let album:any = {}
  let artist:any = {}
  let name:string = ''
  let songId:number = 0
  let songName:string = ''
  let songCount: number = 0
  const ids: number[] = []
  const result = res.result
  const arr = []

  if (!result.songs) return false

  for (let i = 0; i < result.songs.length; i++) {
    name = '' // 清空歌手名字
    songId = result.songs[i].id
    songCount = result.songCount
    ids.push(result.songs[i].id)
    songName = result.songs[i].name
    album = {
      id: result.songs[i].al.id,
      name: result.songs[i].al.name,
      picUrl: result.songs[i].al.picUrl
    }
    result.songs[i].ar.forEach((ar: any) => {
      name += `${ar.name}/`
      artist = {
        name: name.slice(0, name.length - 1),
        id: ar.id
      }
    })
    arr.push({
      name: songName,
      id: songId,
      artist: artist,
      album: album
    })
  }

  return {
    songCount: songCount,
    ids,
    musicDetail: arr
  }
}
