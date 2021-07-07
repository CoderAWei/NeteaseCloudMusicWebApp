/*
 * @Author: XuZhongWei
 * @Date: 2021-02-01 16:31:33
 * @Last Modified by: XuZhongWei
 * @Last Modified time: 2021-02-01 17:58:15
 */

import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

@Module({ dynamic: true, store, namespaced: true, name: 'layout' })
class Layout extends VuexModule {
  currentTab: number = 1
  currentLink: string = ''

  @Mutation
  SET_CURRENTAB(payload: number) {
    sessionStorage.setItem('currentTab', JSON.stringify(payload))
  }

  @Mutation
  SET_CURRENTLINK(payload: string) {
    sessionStorage.setItem('currentLink', payload)
  }

  @Action
  setCurrentTab(payload: number = 1) {
    this.context.commit('SET_CURRENTAB', payload)
  }

  @Action
  setCurrentLink(payload: string = '/discover') {
    this.context.commit('SET_CURRENTLINK', payload)
  }
}

export const LayoutModule = getModule(Layout)
