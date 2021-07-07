// 歌单
<template>
  <div class="songSheet-container">
    <goBack :showGoBack='showGoBack'/>
    <div class="xzw" style="height: calc(100% - 36px); overflow: hidden" ref="roll">
      <songList :songListData='$store.state.songPlayList'/>
    </div>
  </div>
</template>

<script>
import goBack from '@components/public/goBack.vue'
import songList from '@components/public/songList.vue'
import BScroll from 'better-scroll'
export default {
  props: {

  },
  data () {
    return {
      showGoBack: {
        show: 1,
        path: '/mine',
        title: '歌单'
      }
    }
  },
  computed: {
    sheetListId () {
      return this.$store.state.songSheetListId
    }
  },
  created () {
    this.setSongPlayList()
  },
  mounted () {
    this.initScroll()
  },
  watch: {

  },
  methods: {
    initScroll () {
      const options = {
        click: true
      }
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.roll, options)
      })
    },
    setSongPlayList () {
      console.log(this.sheetListId)
      const songListId = []
      const songPlayList = [] // 当前播放歌曲列表  存到vuex
      this.sheetListId.forEach(ele => {
        songListId.push(ele)
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
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  components: {
    goBack,
    songList
  },
  beforeRouteLeave (to, from, next) {
    localStorage.setItem('routeBeforePlay', (from.path))
    next()
  }
}
</script>

<style scoped lang="scss">
.songSheet-container{
  padding: 5%;
  height: 100%;
  box-sizing: border-box;
}
</style>
