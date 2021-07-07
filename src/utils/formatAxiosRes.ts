// 全局处理接口返回的数据 主要原因是他妈的网易云接口返回的数据太多了，好多参数根本看不懂

import { ILyric, IMusicDetail } from '@/typings'

export const formatMusicDetail = (songs: any[]): IMusicDetail => {
  let album:any = {}
  let artist:any = {}
  let name:string = ''
  let songId:number = 0
  let songName:string = ''
  for (let i = 0; i < songs.length; i++) {
    songId = songs[i].id
    songName = songs[i].name
    album = {
      id: songs[i].al.id,
      name: songs[i].al.name,
      picUrl: songs[i].al.picUrl
    }
    songs[i].ar.forEach((ar: any) => {
      name += `${ar.name}/`
      artist = {
        name: name.slice(0, name.length - 1),
        id: ar.id
      }
    })
  }
  return {
    name: songName,
    id: songId,
    artist: artist,
    album: album
  }
}

interface IReturnLyric {
  lyric: ILyric[],
  tlyric?: ILyric[]
}
export const formatMusicLyrics = (lyric?: string, tlyric?: string):IReturnLyric => {
  if (!lyric) {
    return { lyric: [{ time: 0, lyric: '没有歌词💢💥🌚', uid: 520520 }] }
  }
  const lyricObjArr: ILyric[] = [] // 最终生成的歌词数组

  // 将歌曲字符串变成数组，数组每一项就是当前歌词信息
  const lineLyric:any = lyric?.split(/\n/)
  // const lineTLyric:string[] | undefined = tlyric?.split(/\n/)
  console.log(lineLyric)

  // 匹配中括号里正则的
  const regTime = /\d{2}:\d{2}(.\d{2,3}|)/

  // 循环遍历歌曲数组
  for (let i = 0; i < lineLyric?.length; i++) {
    if (lineLyric[i] === '') continue
    let time: number
    if (lineLyric[i].match(regTime)) { // 解决歌词没有时间的情况，也就是不支持滚动的情况
      time = formatLyricTime(lineLyric[i].match(regTime)[0])
    } else {
      time = 0.0
    }

    if (lineLyric[i].split(']')[1] !== '') {
      lyricObjArr.push({
        time: time,
        lyric: lineLyric[i].match(regTime) ? lineLyric[i].split(']')[1] : lineLyric[i], // 解决歌词没有时间的情况，也就是不支持滚动的情况
        uid: parseInt(Math.random().toString().slice(-6))
      })
    }
  }
  console.log(lyricObjArr)

  return {
    lyric: lyricObjArr
  }
}

const formatLyricTime = (time: string) => {
  const regMin = /.*:/
  const regSec = /:.*(\.|:|)/ // 解决歌词秒和毫秒中间有:（冒号）的情况,最后的竖线是为了解决没有毫秒的情况
  const regMs = /(\.|:)/

  const min = parseInt((time.match(regMin) as any)[0].slice(0, 2))
  let sec = parseInt((time.match(regSec) as any)[0].slice(1, 3))
  const ms = time.slice((time.match(regMs) as any).index + 1, (time.match(regMs) as any).index + 3)

  if (min !== 0) {
    sec += min * 60
  }
  return Number(sec + '.' + ms)
}
