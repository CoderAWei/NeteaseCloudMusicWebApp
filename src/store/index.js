import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchResult: {}, // 搜索结果 包含总数和数组
    songPlayList: [], // 当前播放的歌曲列表
    songSheetListId: [] // 歌单歌曲的ID
  },
  getters: {
    searchResCount: state => {
      return state.searchResult.songCount
    },
    searchResArr: state => {
      return state.searchResult.songs
    }
  },
  mutations: {
    SET_SEARCH_RESULT: (state, res) => {
      state.searchResult = res
    },
    SET_SONG_PLAY_LIST: (state, res) => {
      state.songPlayList = res
    },
    SET_SHEET_LIST_ID: (state, res) => {
      state.songSheetListId = res
    }
  },
  actions: {
    setSearchResult: ({ commit }, res) => {
      commit('SET_SEARCH_RESULT', res)
    },
    setSongPlayList: ({ commit }, res) => {
      commit('SET_SONG_PLAY_LIST', res)
    },
    setSheetListId: ({ commit }, res) => {
      commit('SET_SHEET_LIST_ID', res)
    }
  },
  modules: {
  }
})
