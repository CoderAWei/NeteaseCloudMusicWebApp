// 每日推荐歌曲
<template>
  <div class="recommend">
    <goBack :showGoBack='showGoBack'/>
    <div class="xzw" style="height: calc(100% - 36px); overflow: hidden" ref="roll">
      <div class="recommend-list">
        <div class="recommend-list-single" v-for="(item, i) in recommendList" :key="item.id" :data-songId='item.id' :data-index='i' @click="play($event)">
          <div class="img">
            <img :src="item.al.picUrl" alt="" width="50" height="50">
          </div>
          <div class="song-detail">
            <div class="name">{{item.name}}</div>
            <div class="singer" v-if="item.ar.length === 1">{{item.ar[0].name}} - {{ item.al.name}}</div>
            <div class="singer" v-else><span v-for="singer in item.ar" :key="singer.id">{{singer.name}} </span> - {{ item.al.name}}</div>
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
        title: '每日推荐',
        show: 1,
        path: '/discover'
      },
      recommendList: []
    }
  },
  computed: {

  },
  created () {
    this.$axios.get('/recommend/songs').then(res => {
      if (res.code === 200) {
        this.recommendList = res.data.dailySongs
        const songListId = []
        const songPlayList = [] // 当前播放歌曲列表  存到vuex
        this.recommendList.forEach(ele => {
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
    })
  },
  mounted () {
    this.initScroll()
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
    initScroll () {
      const options = {
        click: true,
        taps: true
      }
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.roll, options)
        setTimeout(() => {
          this.scroll.refresh()
        }, 500)
      })
    }
  },
  components: {
    goBack
  },
  beforeRouteLeave (to, from, next) {
    localStorage.setItem('routeBeforePlay', (from.path))
    next()
  }
}
</script>

<style scoped lang="scss">
.recommend{
  height: 100%;
  padding: 5%;
  box-sizing: border-box;
}
</style>
