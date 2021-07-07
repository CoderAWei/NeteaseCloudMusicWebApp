<template>
  <div class="playlist">
    <div
      class="playlist-item"
      v-for="item in playlist"
      :key="item.id"
      :data-id='item.id'
      @click.stop="handleClickTopList"
    >
      <img
        class="playlist-left"
        :src="item.coverImgUrl"
        alt="IMG"
        :data-id='item.id'
      >
      <div class="playlist-right" :data-id='item.id'>
        <div class="playlist-name" :data-id='item.id'>{{item.name}}</div>
        <div class="playlist-count" :data-id='item.id'>共{{item.trackCount}}首</div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
/**
 * @Author: 徐忠炜
 * @Email: 94393598@qq.com / xzwei0914@gmail.com
 * @Didi: 有什么问题都可以发邮件问我哦
 * @Date: 2021/03/18 16:09
 */
import { ITopListInfo } from '@/typings'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  name: '',
  props: {
    playlist: Array as PropType<ITopListInfo[]>
  },
  setup(props, ctx) {
    const handleClickTopList = (e: any): void => {
      const id = e.target.dataset.id
      ctx.emit('handleToPlaylistDetail', Number(id))
    }

    return {
      // list,
      handleClickTopList
    }
  },
  components: {

  }
})
</script>

<style scoped lang="scss">
.playlist{
  margin-top: 10px;
  &-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  &-left{
    margin-right: 10px;
  }
  &-right{
    width: 100%;
    .playlist-count{
      margin-top: 5px;
      color: $dark-text-color;
      font-size: 13px;
    }
  }
}
</style>
