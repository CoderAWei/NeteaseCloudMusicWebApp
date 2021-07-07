<template>
  <div
    class='home'
    v-loading='loading'
    xzw-loading-text='我先去买个橘子，你等一下嗷~'
  >
    <van-tabs :active="active" color='#ffb3a7' title-active-color='#ffb3a7' sticky>
      <van-tab title="创建歌单">
        <playlistPanel
          v-if="createdPlaylist.length !== 0"
          :playlist='createdPlaylist'
          @handleToPlaylistDetail='handleToPlaylistDetail'
         />
        <van-empty
          v-else
          class="custom-image"
          image="https://cdn.jsdelivr.net/gh/Xzw111222/MyImages/imgs/juejin_avatar.gif"
          description="没有数据看个锤子，睡阔睡吧！"
        />
      </van-tab>
      <van-tab title="收藏歌单">
        <playlistPanel
          v-if="collectedPlaylist.length !== 0"
          :playlist='collectedPlaylist'
          @handleToPlaylistDetail='handleToPlaylistDetail'
        />
        <van-empty
          v-else
          class="custom-image"
          image="https://cdn.jsdelivr.net/gh/Xzw111222/MyImages/imgs/juejin_avatar.gif"
          description="没有数据看个锤子，睡阔睡吧！"
        />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang='ts'>
/**
 * @Author: 徐忠炜
 * @Email: 94393598@qq.com / xzwei0914@gmail.com
 * @Didi: 有什么问题都可以发邮件问我哦
 * @Date: 2021/02/02 09:02
 */
import { GetPlayList } from '@/api/toplist'
import { PlaylistModule } from '@/store/modules/playlist'
import { ITopListInfo } from '@/typings'
import { handleGetUserId } from '@/utils'
import { useRouter } from 'vue-router'
import { defineComponent, ref } from 'vue'
import playlistPanel from './components/playlist.vue'
export default defineComponent({
  name: 'Mine',
  props: {

  },
  setup() {
    const loading = ref<boolean>(false)
    const createdPlaylist = ref<ITopListInfo[]>([])
    const collectedPlaylist = ref<ITopListInfo[]>([])
    const active = ref<number>(0)
    const $router = useRouter()

    let id: number = 0

    const handleGetPlaylist = (): void => {
      id = handleGetUserId()
      loading.value = true
      GetPlayList({ uid: id }).then(res => {
        loading.value = false
        createdPlaylist.value = res.create
        collectedPlaylist.value = res.collect
      }).catch(() => { loading.value = false })
    }

    const handleToPlaylistDetail = (id: number): void => {
      loading.value = true
      PlaylistModule.handleToTopListDetail(id).then(res => {
        // console.log(PlaylistModule.getCurPlaylist)
        loading.value = false
        $router.push({ name: 'TopListDetail', query: { id }})
      })
    }

    handleGetPlaylist()

    return {
      loading,
      createdPlaylist,
      collectedPlaylist,
      active,
      handleToPlaylistDetail
    }
  },
  components: {
    playlistPanel
  }
})
</script>

<style scoped lang="scss">
.home{
  padding-bottom: 50px;
}
</style>
