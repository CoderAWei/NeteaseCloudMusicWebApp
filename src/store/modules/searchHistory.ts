/*
 * @Author: XuZhongWei
 * @Date: 2021-03-16 14:44:15
 * @Last Modified by: XuZhongWei
 * @Last Modified time: 2021-03-16 17:24:43
 */

import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { DEL_SEARCH_HISTORY, SET_SEARCH_HISTORY } from '../types'

@Module({ dynamic: true, store, namespaced: true, name: 'searchHistory' })
class SearchHistory extends VuexModule {
  history: string[] = []

  get searchHistory() {
    return localStorage.searchHistory ? JSON.parse(localStorage.searchHistory) : ''
  }

  // 设置搜索历史
  @Mutation
  SET_SEARCH_HISTORY(payload: string) {
    if (localStorage.searchHistory) this.history = JSON.parse(localStorage.searchHistory)
    this.history.push(payload)
    this.history = Array.from(new Set(this.history))
    console.log(this.history)
    localStorage.setItem('searchHistory', JSON.stringify(this.history))
  }

  // 删除搜索历史
  @Mutation
  DEL_SEARCH_HISTORY(payload: {index: number, delCount?: number }) {
    if (localStorage.searchHistory) this.history = JSON.parse(localStorage.searchHistory)
    console.log(payload.index, payload.delCount)
    this.history.splice(payload.index, payload.delCount)
    // this.history = list
    localStorage.setItem('searchHistory', JSON.stringify(this.history))
  }

  @Action
  setSearchHistory(payload: string) {
    this.context.commit(SET_SEARCH_HISTORY, payload)
  }

  @Action
  delSearchHistory(payload: {index: number, delCount?: number}) {
    this.context.commit(DEL_SEARCH_HISTORY, payload)
  }
}

export const SearchHistoryModule = getModule(SearchHistory)
