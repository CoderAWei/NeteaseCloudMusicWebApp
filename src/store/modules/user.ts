/*
 * @Author: XuZhongWei
 * @Date: 2021-01-30 16:38:15
 * @Last Modified by: XuZhongWei
 * @Last Modified time: 2021-03-04 16:35:42
 */

import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { SET_USER_LOGIN_STATUS, SET_USER_USERINFO } from '../types'
import { LoginByPhone } from '@/api/login'
import { Toast } from 'vant'
import $router from '@/router/index'

interface IUserInfoState {
  avatarUrl: string,
  bgImgUrl: string,
  birthday: number,
  city: number,
  nickname: string,
  singnature: string,
  userId: number,
  vipType: number,
  token: string,
  cookie: string
}

@Module({ dynamic: true, store, namespaced: true, name: 'user' })

class User extends VuexModule {
  // state
  userInfo = {} // 用户基本信息
  isLogin: boolean = false // 是否登录

  @Mutation
  SET_USER_USERINFO(payload: IUserInfoState) {
    this.userInfo = payload
    localStorage.setItem('userinfo', JSON.stringify(payload))
  }

  @Mutation
  SET_USER_LOGIN_STATUS(payload: boolean) {
    this.isLogin = payload
    localStorage.setItem('isLogin', JSON.stringify(payload))
  }

  // actions
  @Action({ rawError: true })
  login(param: any):Promise<{code: number}> {
    return new Promise((resolve, reject) => {
      LoginByPhone(param).then(res => {
        const obj = {
          avatarUrl: res.profile.avatarUrl,
          bgImgUrl: res.profile.bgImgUrl,
          birthday: res.profile.birthday,
          city: res.profile.city,
          nickname: res.profile.nickname,
          singnature: res.profile.singnature,
          userId: res.profile.userId,
          vipType: res.profile.vipType,
          token: res.token,
          cookie: res.cookie
        }
        this.context.commit(SET_USER_USERINFO, obj)
        Toast({
          type: 'success',
          message: '成功登录...',
          onClose: () => {
            $router.push(localStorage.redirect)
          }
        })
        resolve({ code: 200 })
      }).catch((e) => { reject(e) })
    })
  }

  @Action({ rawError: true })
  setLoginStatus(payload: boolean): void {
    this.context.commit(SET_USER_LOGIN_STATUS, payload)
  }
}

export const UserModule = getModule(User)
