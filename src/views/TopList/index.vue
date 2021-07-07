// 排行榜
<template>
  <div
  class='container'
  v-loading='loading'
  xzw-loading-text='我先去买个橘子，你等一下嗷~'
  >
    <GoBack :gobackParams='gobackParams'/>
    <div class="toplist">
      <div class="toplist-box" v-for="item in topList" :key="item.id" >
        <img
        :src="item.coverImgUrl"
        alt="IMG"
        :data-id='item.id'
        @click.stop="handleClickTopList"
        >
        <span class="toplist-frequency">{{item.updateFrequency}}</span>
        <!-- <div class="toplist-name">{{item.name}}</div> -->
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
/**
 * @Author: 徐忠炜
 * @Email: 94393598@qq.com / xzwei0914@gmail.com
 * @Didi: 有什么问题都可以发邮件问我哦
 * @Date: 2021/03/08 16:41
 */
import { defineComponent, ref } from 'vue'
import { GetTopList } from '@/api/toplist/index'
import { ITopListInfo } from '@/typings'
import GoBack from '@/components/GoBack/index.vue'
import { useRouter } from 'vue-router'
import { PlaylistModule } from '@/store/modules/playlist'
export default defineComponent({
  name: 'TopList',
  props: {

  },
  setup(props, context) {
    const topList = ref<ITopListInfo[]>([])
    const gobackParams = {
      url: '/discover',
      text: '排行榜',
      isShowText: true
    }
    const $router = useRouter()
    const loading = ref<boolean>(false)

    const getTopList = (): void => {
      loading.value = true
      GetTopList().then(res => {
        loading.value = false
        topList.value = res
        // console.log(res)
      })
    }

    const handleClickTopList = (e: MouseEvent): void => {
      loading.value = true
      const id = parseInt((e.target as any).getAttribute('data-id'))
      PlaylistModule.handleToTopListDetail(id).then(res => {
        // console.log(PlaylistModule.getCurPlaylist)
        loading.value = false
        $router.push({ name: 'TopListDetail', query: { id }})
      })
    }

    getTopList()
    return {
      topList,
      loading,
      gobackParams,
      handleClickTopList
    }
  },
  components: {
    GoBack
  }
})
</script>

<style scoped lang="scss">
.toplist{
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  &-box{
    position: relative;
    width: 150px;
    height: 150px;
    box-shadow: 0 -16px 12px rgba($color: $dark-color, $alpha: .2) inset;
    &:not(:last-child){
      margin-bottom: 20px;
    }
  }
  &-frequency{
    position: absolute;
    bottom: 2px;
    left: 10px;
    color: $light-color;
    font-size: 14px;
  }
}
</style>
