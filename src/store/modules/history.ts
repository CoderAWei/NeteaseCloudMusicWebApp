/*
 * @Author: XuZhongWei
 * @Date: 2021-03-08 14:55:01
 * @Last Modified by: XuZhongWei
 * @Last Modified time: 2021-03-08 16:20:38
 */
// 歌曲历史播放记录

import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IMusicInfo } from '@/typings'
import { SET_HISTORY_MUSIC } from '../types'

const uniqueHistoryMusic = (arr: IMusicInfo[]) => {
  const res = new Map()
  const data: IMusicInfo[] = []
  let index: number | null = null
  for (let i = 0; i < arr.length; i++) {
    if (!res.has(arr[i].id)) { // 从未播放过的歌曲
      data.push(arr[i])
      res.set(arr[i].id, 1)
    } else {
      index = data.findIndex(item => item.id === arr[i].id)
      data.splice(index, 1)
      data.push(arr[i])
    }
  }
  return data
}

@Module({ dynamic: true, store, namespaced: true, name: 'history' })
class History extends VuexModule {
  historyMusic: IMusicInfo[] = []

  get getHistoryMusic() {
    return JSON.parse(sessionStorage.historyMusic)
  }

  @Mutation
  SET_HISTORY_MUSIC(payload: IMusicInfo) {
    if (sessionStorage.historyMusic) this.historyMusic = JSON.parse(sessionStorage.historyMusic)
    this.historyMusic.push(payload)
    this.historyMusic = uniqueHistoryMusic(this.historyMusic)
    sessionStorage.setItem('historyMusic', JSON.stringify(this.historyMusic))
  }

  @Action({ rawError: true })
  setHistoryMusic(payload: IMusicInfo) {
    this.context.commit(SET_HISTORY_MUSIC, payload)
  }
}

export const HistoryModule = getModule(History)
