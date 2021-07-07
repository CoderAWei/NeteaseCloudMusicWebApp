<template>
  <div class='container' v-loading='loading'>
    <Goback :gobackParams='gobackParams'/>
    <div class="container-recommend">
      <div class="song-list">
        <div class="song" @click="handleSongInfo" v-for="(item, i) in recommendSongs" :key="item.id" :data-songId='item.id' :data-index='i'>
          <div class="song-left" :data-songId='item.id' :data-index='i'>
            <img class="song-avatar" :src="item.al.picUrl + '?param=40y40'" :data-songId='item.id' :data-index='i' alt="Avatar">
          </div>
          <div class="song-right" :data-songId='item.id' :data-index='i'>
            <div class="song-right-top" :data-songId='item.id' :data-index='i'>
              <div class="song-name" :data-songId='item.id' :data-index='i'>{{item.name}}</div>
            </div>
            <div class="song-right-bottom" :data-songId='item.id' :data-index='i'>
              <span class="song-reason" :data-songId='item.id' :data-index='i' v-if="item.recommendReason">{{item.recommendReason}}</span>
              <span class="song-tag" :data-songId='item.id' :data-index='i'>
               <span v-for="singer in item.ar" :data-songId='item.id' :data-index='i' :key="singer.id">{{singer.name}}</span> - {{item.al.name}}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
/**
 * @Author: 徐忠炜
 * @Email: 94393598@qq.com / xzwei0914@gmail.com
 * @Didi: 有什么问题都可以发邮件问我哦
 * @Date: 2021/02/01 17:48
 */
import { defineComponent, ref } from 'vue'
import Goback from '@/components/GoBack/index.vue'
import { GetRecommendSongs } from '@/api/recommend'
import { MusicCanPlay } from '@/api/play'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
import { handleGetMusic } from '@/utils/index'
import { PlayerModule } from '@/store/modules/player'
export default defineComponent({
  name: 'Recommend',
  props: {

  },
  setup() {
    const $router = useRouter()
    const gobackParams = {
      url: '/',
      text: '每日推荐',
      isShowText: true
    }
    const ids:number[] = []
    const loading = ref<boolean>(false)

    const recommendSongs = ref([])
    const getRecommendList = ():void => {
      GetRecommendSongs().then(res => {
        // console.log(res.data)
        const dailySongs = res.data.dailySongs
        dailySongs.forEach((item:any) => {
          res.data.recommendReasons.forEach((item2:any) => {
            if (item.id === item2.songId) {
              item.recommendReason = item2.reason
            }
          })
          ids.push(item.id)
        })
        recommendSongs.value = dailySongs
      }).catch(() => {})
    }

    // 根据歌曲ID获取歌曲信息并跳转到播放页
    const handleSongInfo = async(e: MouseEvent):Promise<void> => {
      try {
        loading.value = true
        const songId = (e.target as any).getAttribute('data-songId')
        const songIndex = (e.target as any).getAttribute('data-index')
        PlayerModule.setPlayingMusicIndex(songIndex)
        const canplay = await MusicCanPlay({ id: songId })
        if (canplay.success) { // 当前歌曲有版权
          handleGetMusic(songId, ids).then(res => {
            loading.value = false
            $router.push({ path: '/play', query: { id: songId }})
          })
        } else {
          Toast.fail('抱歉，正在争取版权中...')
        }
      } catch (error) {
        loading.value = false
      }
    }

    getRecommendList()

    return {
      gobackParams,
      getRecommendList,
      recommendSongs,
      handleSongInfo,
      loading
    }
  },
  components: {
    Goback
  }
})
</script>

<style scoped lang="scss">

</style>
