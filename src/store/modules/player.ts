/*
 * @Author: XuZhongWei
 * @Date: 2021-03-01 09:52:03
 * @Last Modified by: XuZhongWei
 * @Last Modified time: 2021-03-02 16:47:07
 */
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IMusicInfo } from '@/typings'
import { SET_MUSIC_VOLUME, SET_PLAYING_MUSIC, SET_PLAYING_MUSIC_INDEX, SET_PLAY_MODE } from '../types'

@Module({ dynamic: true, store, namespaced: true, name: 'player' })

class Player extends VuexModule {
  playingMusic = {}
  playingMusicIndex = -1
  musicVolume = 1
  playmode = 'mode_list'

  get music() {
    return JSON.parse(localStorage.playingMusic)
  }

  get index() {
    return parseInt(JSON.parse(localStorage.playingMusicIndex))
  }

  get volume() {
    return JSON.parse(localStorage.musicVolume)
  }

  get playMode() {
    return JSON.parse(localStorage.playmode)
  }

  // 设置当前播放歌曲信息
  @Mutation
  SET_PLAYING_MUSIC(music: IMusicInfo) {
    this.playingMusic = music
    localStorage.setItem('playingMusic', JSON.stringify(music))
  }

  // 设置当前播放歌曲的索引
  @Mutation
  SET_PLAYING_MUSIC_INDEX(index: number) {
    this.playingMusicIndex = index
    localStorage.setItem('playingMusicIndex', JSON.stringify(index))
  }

  // 设置全局播放音量
  @Mutation
  SET_MUSIC_VOLUME(volume: number) {
    this.playingMusicIndex = volume
    localStorage.setItem('musicVolume', JSON.stringify(volume))
  }

  // 设置全局播放音量
  @Mutation
  SET_PLAY_MODE(playmode: string) {
    this.playmode = playmode
    localStorage.setItem('playmode', JSON.stringify(playmode))
  }

  @Action({ rawError: true })
  setPlayingMusic(music: IMusicInfo) {
    this.context.commit(SET_PLAYING_MUSIC, music)
  }

  @Action({ rawError: true })
  setPlayingMusicIndex(index: number) {
    this.context.commit(SET_PLAYING_MUSIC_INDEX, index)
  }

  @Action({ rawError: true })
  setMusicVolume(volume: number) {
    this.context.commit(SET_MUSIC_VOLUME, volume)
  }

  @Action({ rawError: true })
  setPlayMode(playmode: string) {
    this.context.commit(SET_PLAY_MODE, playmode)
  }
}

export const PlayerModule = getModule(Player)
