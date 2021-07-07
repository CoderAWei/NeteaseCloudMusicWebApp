<template>
  <div class="banner-container">
    <Swiper ref="mySwiper" :options='swiperOption' class="swiper-container">
       <!-- slides -->
      <swiper-slide class="swiper-item" v-for='banner in banners' :key='banner.bannerId'>
        <!-- <router-link> -->
          <img class='swiper-img' :src='banner.pic' @click="play($event)" :data-songId='banner.targetId'/>
        <!-- </router-link> -->
      </swiper-slide>
      <!-- 分页器 -->
      <div class="swiper-pagination" slot="pagination"></div>
    </Swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
  props: {

  },
  data () {
    return {
      banners: {},
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: 'bullets'
        },
        loop: true,
        autoplay: {
          delay: 3000
        },
        speed: 1000,
        observer: true, // 修改swiper自己或子元素时，自动初始化swiper
        observeParents: true // 修改swiper的父元素时，自动初始化swiper
      }
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.$swiper
    }
  },
  created () {

  },
  mounted () {
    sessionStorage.banner ? this.banners = JSON.parse(sessionStorage.banner) : this.getBanner()
    this.swiper.slideTo(1, 2000, false)
  },
  watch: {

  },
  methods: {
    getBanner () {
      this.$axios.get('/banner?type=1').then(res => {
        if (res.code === 200) {
          this.banners = res.banners
          sessionStorage.banner = JSON.stringify(this.banners)
        }
      })
    },
    play (event) {
      const e = event || window.event
      const target = e.currentTarget
      const id = Number(target.getAttribute('data-songid'))
      if (id === 0) {
        this.$message.warning('这是广告，我不会跳转的！哈哈哈哈哈')
      } else {
        const songPlayList = [] // 当前播放歌曲列表  存到vuex
        this.$axios.get(`/song/detail?ids=${id}`).then(res => {
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

            this.$router.push({ path: '/play', query: { id } })

            // const index = target.getAttribute('data-index')
            localStorage.setItem('curSongPlayIndex', 0)
          }
        })
      }
    }
  },
  components: {
    Swiper,
    SwiperSlide
  }
}
</script>

<style scoped lang="scss">
.swiper-container,
.swiper-img{
  width: 100%;
  height: 130px;
}
</style>

<style lang="scss">
.swiper-container{
  --swiper-theme-color: #ff6600;
}
</style>
