<template>
  <van-list
    :loading="loading"
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
</template>

<script lang='ts'>
/**
 * @Author: 徐忠炜
 * @Email: 94393598@qq.com / xzwei0914@gmail.com
 * @Didi: 有什么问题都可以发邮件问我哦
 * @Date: 2021/03/11 16:08
 */
import { IMusicDetail } from '@/typings'
import { defineComponent, PropType, ref } from 'vue'
export default defineComponent({
  name: '',
  props: {
    tracks: Object as PropType<IMusicDetail[]>
  },
  setup(props, ctx) {
    const listData = ref<IMusicDetail[]>([])
    const loading = ref<boolean>(false)
    const finished = ref<boolean>(false)
    const tracks: any = props.tracks
    const sliceStart: number = 0
    let sliceEnd: number = 20

    // 默认展示20条数据
    listData.value = tracks.slice(sliceStart, sliceEnd)
    console.log(listData.value)

    const handleSliceListData = (start: number, end: number) => {
      setTimeout(() => {
        sliceEnd += 20
        if (sliceEnd >= tracks?.length) sliceEnd = tracks?.length
        listData.value = tracks?.slice(start, end)

        loading.value = false

        if (listData.value.length >= tracks.length) finished.value = true
      }, Math.ceil(Math.random() * (200 - 1000) + 1000))
    }

    const handleLoadMoreList = (): void => {
      loading.value = true
      handleSliceListData(sliceStart, sliceEnd)
    }

    const handleGoToPlayPage = (e: MouseEvent): void => {
      const songId = (e.target as any).getAttribute('data-songId')
      const songIndex = (e.target as any).getAttribute('data-index')
      ctx.emit('musicItemClick', { songId, songIndex })
    }

    return {
      handleLoadMoreList,
      handleGoToPlayPage,
      loading,
      finished,
      listData
    }
  },
  components: {

  }
})
</script>

<style scoped lang="scss">

</style>
