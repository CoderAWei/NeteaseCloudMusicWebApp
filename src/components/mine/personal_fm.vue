// 私人FM
<template>
  <div class="personal_fm">

  </div>
</template>

<script>
export default {
  props: {

  },
  data () {
    return {

    }
  },
  computed: {

  },
  created () {
    this.getFM()
  },
  mounted () {

  },
  watch: {

  },
  methods: {
    getFM () {
      this.$axios.get('personal_fm').then(res => {
        if (res.code === 200) {
          this.setSongPlayList(res.data)
        }
      })
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

          localStorage.setItem('curSongPlayIndex', 0)
          this.$router.push({ path: '/play', query: { from: 'fm' } })
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  components: {

  }
}
</script>

<style scoped lang="scss">

</style>
