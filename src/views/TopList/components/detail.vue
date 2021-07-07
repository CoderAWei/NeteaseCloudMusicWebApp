<template>
  <div class='container' v-loading='loading' xzw-loading-text='我先去买个橘子，你等一下嗷~'>
    <div
      class="detail-top"
      :class="{'scrollBehavior': isScroll}"
      :style="{backgroundImage:`url(${ detail.coverImgUrl}?param=200y200)`}"
    >
      <div
        class="goback"
        :style="{backgroundImage: isScroll ? `url(${ detail.coverImgUrl}?param=200y200)` : ''}"
      >
        <svg-icon @click="$router.push(redirect)" iconClass='goback'/>
        <span class="text">{{!isScroll ? '歌单' : detail.name}}</span>
      </div>
      <div class="detail-top_box" :style="{opacity: opacity}">
        <div class="coverImg">
          <img :src="`${detail.coverImgUrl}?param=150y150`">
        </div>
        <div class="describe">
          <div class="name">{{detail.name}}</div>
          <div class="creator">
            <img :src="`${detail.creator.avatarUrl}?param=25y25`" alt="avatar" class="avatar">
            <p>{{detail.creator.nickname}}</p>
            <img class="identifyIcon" :src="`${detail.creator.identityIconUrl}`" width="13"/>
          </div>
          <div class="updateTime">更新时间：{{detail.updateTime}}</div>
          <p>共{{detail.trackCount}}首</p>
          <div class="van-ellipsis description">{{detail.description}}n</div>
        </div>
      </div>
    </div>
    <div class="music-list">
      <music-list :tracks='detail.tracks' @musicItemClick='handleMusicItemClick'/>
    </div>
  </div>
</template>

<script lang='ts'>
/**
 * @Author: 徐忠炜
 * @Email: 94393598@qq.com / xzwei0914@gmail.com
 * @Didi: 有什么问题都可以发邮件问我哦
 * @Date: 2021/03/10 09:38
 */
import { PlaylistModule } from '@/store/modules/playlist'
import { defineComponent, getCurrentInstance, onMounted, onUnmounted, ref, ScriptHTMLAttributes } from 'vue'
import MusicList from '@/components/MusicList/index.vue'
import { PlayerModule } from '@/store/modules/player'
import { MusicCanPlay } from '@/api/play'
import { handleGetMusic } from '@/utils'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: '',
  props: {

  },
  setup(props, context) {
    const opacity = ref<number>(1) // 控制透明程度
    const isScroll = ref<boolean>(false) // 是否在滚动 可进行一些样式的添加
    const detail = ref<any>({})
    const loading = ref<boolean>(false)
    let curOpacity: number = 1
    let redirect: string = ''

    const $router = useRouter()
    const instance: any = getCurrentInstance()

    detail.value = PlaylistModule.getCurPlaylist
    console.log(detail.value)
    redirect = localStorage.redirectFromPlaylist

    const handleScroll = (e: ScriptHTMLAttributes) => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop // 滚动条偏移量
      curOpacity = 1 - Number((scrollTop / 180).toFixed(2))
      curOpacity <= 0 ? opacity.value = 0 : opacity.value = curOpacity
      scrollTop >= 180 ? isScroll.value = true : isScroll.value = false
      // console.log(scrollTop, opacity.value, isScroll.value)
    }

    const handleMusicItemClick = async(value: {songId: string, songIndex: string}) => {
      try {
        loading.value = true
        const songId = value.songId
        const songIndex = Number(value.songIndex)
        PlayerModule.setPlayingMusicIndex(songIndex)
        const canplay = await MusicCanPlay({ id: songId })
        if (canplay.success) { // 当前歌曲有版权
          handleGetMusic(songId, detail.value.ids).then(res => {
            loading.value = false
            $router.push({ path: '/play', query: { id: songId }})
          })
        } else {
          instance.appContext.config.globalProperties.$Toast.fail('抱歉，正在争取版权中...')
        }
      } catch (error) {
        loading.value = false
      }
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      opacity,
      isScroll,
      detail,
      handleMusicItemClick,
      loading,
      redirect
    }
  },
  components: {
    'music-list': MusicList
  }
})
</script>

<style scoped lang="scss">
.detail-top{
  width: 100%;
  height: 100%;
  height: 230px;
  padding: 55px 10px 25px 10px;
  // background: url('https://p1.music.126.net/EJyXfGYsiHxxxoCiTAz6Kg==/109951165611553137.jpg?param=200y200')  no-repeat;
  background-repeat: no-repeat;
  background-size: 200%;
  position: relative;
  z-index: 3;
  &::after{
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background-color: rgba($color: $dark-color, $alpha: .3);
    z-index: -1;
  }
  .goback{
    position: fixed;
    top: 10px;
    left: 10px;
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
    color: $light-color;
    z-index: 9;
    .svg-icon{
      width: 20px;
      height: 20px;
      fill: $light-color;
      margin-right: 20px;
    }
  }
  &_box{
    height: 100%;
    width: 100%;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: rgb(155, 155, 193);
    .coverImg{
      width: 150px;
      height: 100%;
      position: relative;
      img{
        border-radius: 10px;
      }
      &::after{
        z-index: -1;
        position: absolute;
        top: -6px;
        left: 15px;
        content: '';
        display: block;
        width: 120px;
        height: 20px;
        border-radius: 10px;
        background-color: rgba($color: $dark-color, $alpha: .1);
      }
    }
    .describe{
      width: calc(100% - 170px);
      height: calc(100% - 10px);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 12px;
    }
  }
  .describe{
    .name{
      color: $white-text-color;
      font-size: 16px;
    }
    .creator{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      position: relative;
      .avatar{
        border-radius: 50%;
        margin-right: 10px;
      }
      .identifyIcon{
        position: absolute;
        bottom: 0;
        left: 18px;
      }
    }
    .description{
      text-decoration: underline;
    }
  }
}
.detail-top.scrollBehavior{
  .goback{
    transition: .2s;
    height: 44px;
    top: 0;
    left: 0;
    background-repeat: no-repeat;
    background-size: 200%;
  }
}
.music-list{
  height: 100%;
  margin: 20px 0;
  padding: 0 10px;
}
</style>
