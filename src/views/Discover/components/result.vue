<template>
  <div class='container' v-loading='loading'>
    <Goback :gobackParams='gobackParams'/>

    <div class="music-list">
      <van-list
        :loading="loadingList"
        :finished="finished"
        :immediate-check='false'
        finished-text="没有更多了"
        offset='100'
        @load="handleLoadMoreList"
      >
        <div
          class="music-list_item"
          v-for="(item, i) in listData"
          :key="item.id"
          :data-songId='item.id'
          :data-index='i'
          @click="handleGoToPlayPage"
        >
          <div class="item-img" :data-songId='item.id' :data-index='i'>
            <img :src="`${item.album.picUrl}?param=40y40`" alt="饶惠玲是猪" :data-songId='item.id' :data-index='i'>
          </div>
          <div class="item-songInfo" :data-songId='item.id' :data-index='i'>
            <p class="songName" :data-songId='item.id' :data-index='i'>{{item.name}}</p>
            <p class="singerName van-ellipsis" :data-songId='item.id' :data-index='i'>{{item.artist.name}}</p>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script lang='ts'>
/**
 * @Author: 徐忠炜
 * @Email: 94393598@qq.com / xzwei0914@gmail.com
 * @Didi: 有什么问题都可以发邮件问我哦
 * @Date: 2021/03/15 17:04
 */
import Goback from '@/components/GoBack/index.vue'
import { HandleSearch } from '@/api/search'
import { useRoute, useRouter } from 'vue-router'
import { defineComponent, getCurrentInstance, ref } from 'vue'
import { PlayerModule } from '@/store/modules/player'
import { MusicCanPlay } from '@/api/play'
import { handleGetMusic } from '@/utils'
export default defineComponent({
  name: 'SearchResult',
  props: {

  },
  setup(props, ctx) {
    const gobackParams = ref({
      url: '/search',
      text: '',
      isShowText: true
    })
    const $route = useRoute()
    const $router = useRouter()
    const keyword: any = $route.query.keyword
    const instance: any = getCurrentInstance()
    const listData = ref<any>([])
    // const hasMore = ref<boolean>(true)
    let currentPage: number = 1
    const pageSize: number = 30
    // const pageCount: number = 0 // 总页数
    const loading = ref<boolean>(false) // 请求loading
    const loadingList = ref<boolean>(false) // 加载列表
    const finished = ref<boolean>(false)
    let ids: number[] = []

    gobackParams.value.text = `搜索结果 来自：${keyword}`

    const search = async(currentPage: number, pageSize: number, keyword: string) => {
      try {
        console.log(`currentPage: ${currentPage}`)

        const res: any = await HandleSearch({ keywords: keyword, limit: pageSize, offset: ((currentPage - 1) * pageSize) })

        console.log(res)
        if (!res) return
        if (currentPage === 1) {
          listData.value = res.musicDetail
          ids = res.ids
        } else {
          listData.value.push(...res.musicDetail)
          ids.push(...res.ids)
        }

        console.log(listData.value)
        loadingList.value = false

        if (listData.value.length >= res.songCount) {
          finished.value = true
        }
      } catch (error) {}
    }

    search(currentPage, pageSize, keyword)

    const handleLoadMoreList = () => {
      loadingList.value = true
      currentPage += 1
      search(currentPage, pageSize, keyword)
    }

    const handleGoToPlayPage = async(e: MouseEvent): Promise<void> => {
      try {
        const songId = (e.target as any).getAttribute('data-songId')
        const songIndex = (e.target as any).getAttribute('data-index')
        loading.value = true

        PlayerModule.setPlayingMusicIndex(songIndex)
        const canplay = await MusicCanPlay({ id: songId })
        if (canplay.success) { // 当前歌曲有版权
          handleGetMusic(songId, ids).then(res => {
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

    return {
      gobackParams,
      listData,
      handleLoadMoreList,
      handleGoToPlayPage,
      loading,
      loadingList,
      finished
    }
  },
  components: {
    Goback
  }
})
</script>

<style scoped lang="scss">
.music-list{
  height: 100%;
  padding: 0 10px;
}
</style>
