// 歌曲列表 公共组件
<template>
  <div class="songlist">
      <div class="single" v-for='(item, i) in songListData' :key="item.id" :data-songId='item.id' :data-index='i' @click="play($event)">
        <div :style="{color: i <= 2 ? 'red' : '#a39f9f'}">{{i + 1}}</div>
        <div class="info">
          <div class="name">{{item.songName}}</div>
          <div class="singer">{{item.singerName}} - {{item.alName}}</div>
        </div>
        <div class="play"><i class="fa fa-play-circle-o"></i></div>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    songListData: Array
  },
  data () {
    return {

    }
  },
  computed: {

  },
  created () {

  },
  mounted () {

  },
  watch: {

  },
  methods: {
    async play (event) {
      const e = event || window.event
      const target = e.currentTarget
      const id = target.getAttribute('data-songId')
      const useable = await this.$axios.get(`/check/music?id=${id}`)
      if (useable.success) { // 当前歌曲有版权
        this.$router.push({ path: '/play', query: { id } })

        const index = target.getAttribute('data-index')
        localStorage.setItem('curSongPlayIndex', index)
      }
    }
  },
  components: {

  }
}
</script>

<style scoped lang="scss">

</style>
