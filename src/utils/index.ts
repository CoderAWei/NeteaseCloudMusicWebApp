// 公用方法

import { GetLikeList, GetMusicDetail, GetMusicLyrics, GetMusicUrl } from '@/api/play'
import { HistoryModule } from '@/store/modules/history'
import { PlayerModule } from '@/store/modules/player'
import { formatMusicDetail, formatMusicLyrics } from './formatAxiosRes'
import $router from '@/router'
import { Dialog, Toast } from 'vant'

// 根据id获取歌曲 并存到vuex
export const handleGetMusic = (id: string, ids?: number[]):Promise<object> => {
  return new Promise((resolve, reject) => {
    GetMusicDetail({ ids: id }).then(res => {
      const detail = formatMusicDetail(res.songs)
      GetMusicUrl({ id }).then(res2 => {
        const url = res2.data[0].url
        const isVip = res2.data[0].fee === 1
        console.log('****************************************************************************************************************************************************')
        console.log(url)
        GetMusicLyrics({ id }).then(res => {
          // 目前只处理原歌词（不处理翻译歌词）
          console.log(res)
          let lyrics: any = {}
          if (res.uncollected) {
            lyrics = {
              lyric: [{ uid: 111222, time: 0, lyric: '此歌曲还暂未收集歌词！' }]
            }
          } else {
            lyrics = formatMusicLyrics(res.lrc.lyric, res.tlyric.lyric)
          }
          if (!JSON.parse(localStorage.isLogin)) { // 没有登录
            const playingMusic = {
              name: detail.name,
              id: detail.id,
              album: detail.album,
              artist: detail.artist,
              url,
              ids,
              isVip,
              lyric: lyrics.lyric
            }
            PlayerModule.setPlayingMusic(playingMusic)
            HistoryModule.setHistoryMusic(playingMusic)
            resolve({ code: 200, url })
          } else { // 已登录
            GetLikeList({ uid: localStorage.userinfo.userId }).then(res => {
              let likeIds: number[] = []
              let like: boolean = false
              likeIds = res.ids
              likeIds.indexOf(parseInt(id)) !== -1 ? like = true : like = false
              const playingMusic = {
                name: detail.name,
                id: detail.id,
                album: detail.album,
                artist: detail.artist,
                url,
                ids,
                isVip,
                lyric: lyrics.lyric,
                like
              }
              PlayerModule.setPlayingMusic(playingMusic)
              HistoryModule.setHistoryMusic(playingMusic)
              resolve({ code: 200, url })
            }).catch(e => { reject(e) })
          }
        }).catch(e => { reject(e) })
      }).catch(e => { reject(e) })
    }).catch(e => { reject(e) })
  })
}

// 格式化歌曲播放时间
export const handleFormatDuration = (duration: number):string => {
  const mins = Math.floor(duration / 60) < 10 ? `0${Math.floor(duration / 60)}` : Math.floor(duration / 60)
  const sec = Math.floor(duration % 60) < 10 ? `0${Math.floor(duration % 60)}` : Math.floor(duration % 60)
  return `${mins}:${sec}`
}

// 获取用户ID，未登录时直接跳转到登录页面
export const handleGetUserId = (): number => {
  const isLogin: boolean = JSON.parse(localStorage.isLogin)
  let id: number = 0
  if (isLogin) {
    // 获取id
    id = JSON.parse(localStorage.userinfo).userId
  } else {
    // 去登录
    Dialog.confirm({
      title: '滴滴~',
      message: '亲爱的，你还没登录哦！',
      confirmButtonText: '现在就去',
      cancelButtonText: '老子不去',
      confirmButtonColor: '#ffb3a7'
    }).then(() => {
      $router.push('/login')
    }).catch(() => {
      Toast.fail('你好歪哦！')
      setTimeout(() => {
        $router.push('/')
      }, 2000)
    })
  }
  return id
}

// 格式化时间
export const handleFormatTime = (time: any, Format?: string): string => {
  const format: string = Format || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        // eslint-disable-next-line prefer-regex-literals
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}
