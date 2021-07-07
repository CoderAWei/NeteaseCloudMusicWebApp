// 搜索结果
<template>
  <div class="res-container">
    <goBack :showGoBack='showGoBack'/>
    <div class="xzw" style="height: calc(95% - 36px); overflow: hidden" ref="roll">
      <div class="recommend-list">
        <div class="recommend-list-single" v-for="(item, i) in resultList" :key="item.id" :data-songId='item.id' :data-index='i' @click="play($event)">
          <div class="img">
            <img :src="'//www.gravatar.com/avatar/76e86f82f88aab2c19971828bc25d4d3?s=200&r=pg&d=mm'" alt="" width="50" height="50">
          </div>
          <div class="song-detail">
            <div class="name">{{item.name}}</div>
            <div class="singer" v-if="item.artists.length === 1">{{item.artists[0].name}} - {{ item.album.name}}</div>
            <div class="singer" v-else><span v-for="singer in item.artists" :key="singer.id">{{singer.name}} </span> - {{ item.album.name}}</div>
          </div>
          <div class="play"><i class="fa fa-play-circle-o"></i></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import goBack from '@components/public/goBack'
import BScroll from 'better-scroll'
export default {
  props: {

  },
  data () {
    return {
      showGoBack: {
        path: '/search',
        show: 1
      },
      resultList: []
    }
  },
  computed: {

  },
  created () {
    this.showGoBack.title = `来自搜索：${sessionStorage.searchKeyword}`
    this.resultList = sessionStorage.searchResult ? JSON.parse(sessionStorage.searchResult) : this.$store.getters.searchResArr
    this.setSongPlayList(this.resultList)
  },
  mounted () {
    const options = {
      click: true,
      taps: true
    }
    this.scroll = new BScroll(this.$refs.roll, options)
  },
  watch: {

  },
  methods: {
    async play (event) {
      const e = event || window.event
      const target = e.currentTarget
      const id = target.getAttribute('data-songId')
      const useable = await this.$axios.get(`/check/music?id=${id}`)
      if (useable.success) {
        this.$axios.get(`/song/url?id=${id}`).then(res => {
          if (res.code === 200) {
            console.log(res.data[0].url)
            this.$router.push({ path: '/play', query: { id } })

            const index = target.getAttribute('data-index')
            localStorage.setItem('curSongPlayIndex', index)
          }
        })
      } else {
        this.$message.error(`${useable.message}`)
      }
    },
    setSongPlayList (data) {
      const songListId = []
      const songPlayList = [] // 当前播放歌曲列表  存到vuex
      data.forEach(ele => {
        songListId.push(ele.id)
      })
      this.$axios.get(`/song/detail?ids=${songListId.join(',')}`).then(res => {
        if (res.code === 200) {
          for (let i = 0; i < res.songs.length; i++) {
            const obj = {}
            let names = ''
            obj.id = res.songs[i].id
            obj.alName = res.songs[i].al.name
            if (res.songs[i].ar.length === 1) {
              obj.singerName = res.songs[i].ar[0].name
            } else {
              res.songs[i].ar.forEach(ele => { names += `${ele.name}/` })
              obj.singerName = names.slice(0, names.length - 1)
            }
            obj.songName = res.songs[i].name
            obj.blurPicUrl = res.songs[i].al.picUrl
            songPlayList.push(obj)
          }
          localStorage.setItem('songPlayList', JSON.stringify(songPlayList))
          this.$store.dispatch('setSongPlayList', songPlayList)
        }
      })
    }
  },
  components: {
    goBack
  },
  beforeRouteLeave (to, from, next) {
    localStorage.setItem('routeBeforePlay', from.path)
    next()
  }
}
</script>

<style scoped lang="scss">
.res-container{
  padding: 5%;
  height: 100%;
}
</style>
