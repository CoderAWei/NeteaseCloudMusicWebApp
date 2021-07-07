<template>
  <van-popup
    class="popup"
    :show='show'
    @click-overlay='handleClosePopup'
    @click-close-icon='handleClosePopup'
    round
    position="bottom"
    :style="{ height: '80%' }"
    closeable
    close-icon="arrow-down"
  >
      <div class="comment-container">
        <van-tabs :active="active" color='#ffb3a7' title-active-color='#ffb3a7'>
          <van-tab title="最热">
            <div class="comment-box" v-for='(item, index) in commentsData.hotComments' :key="index">
              <img :src="`${item.avatarUrl}?param=50y50`" alt="avatar">
              <div class="comment-detail">
                <div class="comment-detail_userinfo">
                  <div class="comment-detail_userinfo--left">
                    <div :class="{nickname: true, vip: item.isVip}">{{item.nickname}}</div>
                    <div class="time">{{item.timeStr}}</div>
                  </div>
                  <div class="comment-detail_userinfo--right">
                    <div class="likeCount">
                      <span>{{item.likedCount}}</span>
                      <van-icon name="good-job-o" />
                    </div>
                  </div>
                </div>
                <div class="comment-detail_content">{{item.content}}</div>
              </div>
            </div>
          </van-tab>
          <van-tab title="最新">
            <van-list
              :loading='loading'
              :finished='finished'
              :immediate-check='false'
              @load="handleLoadMoreComment"
              offset='100'
            >
              <div class="comment-box" v-for='(item, index) in commentsData.comments' :key="index">
                <img :src="`${item.avatarUrl}?param=50y50`" alt="avatar">
                <div class="comment-detail">
                  <div class="comment-detail_userinfo">
                    <div class="comment-detail_userinfo--left">
                      <div :class="{nickname: true, vip: item.isVip}">{{item.nickname}}</div>
                      <div class="time">{{item.timeStr}}</div>
                    </div>
                    <div class="comment-detail_userinfo--right">
                      <div class="likeCount">
                        <span>{{item.likedCount}}</span>
                        <van-icon name="good-job-o" />
                      </div>
                    </div>
                  </div>
                  <div class="comment-detail_content">{{item.content}}</div>
                </div>
              </div>
            </van-list>
          </van-tab>
        </van-tabs>
      </div>
  </van-popup>
</template>

<script lang='ts'>
/**
 * @Author: 徐忠炜
 * @Email: 94393598@qq.com / xzwei0914@gmail.com
 * @Didi: 有什么问题都可以发邮件问我哦
 * @Date: 2021/03/19 14:10
 */
import { ICommentInfo } from '@/typings'
import { defineComponent, PropType, ref } from 'vue'
export default defineComponent({
  name: '',
  props: {
    show: Boolean as PropType<boolean>,
    commentsData: Object as PropType<ICommentInfo>
  },
  setup(props, ctx) {
    const loading = ref<boolean>(false)
    const finished = ref<boolean>(false)
    const active = ref<number>(0)
    // const currentPage: number = 2 // 评论分页控制
    // const pageSize: number = 20 // 评论分页控制

    const handleClosePopup = () => {
      ctx.emit('close-popup')
    }

    const handleLoadMoreComment = () => {
      loading.value = true
      ctx.emit('load')
    }

    return {
      handleClosePopup,
      loading,
      finished,
      handleLoadMoreComment,
      active
    }
  },
  components: {

  }
})
</script>

<style scoped lang="scss">
.comment-container{
  color: $dark-text-color;
  .comment-box{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-top: 10px;
    img{
      margin-right: 10px;
      border-radius: 50%;
    }
    &:not(:last-child){
      padding-bottom: 10px;
      border-bottom: 1px solid $primary-color;
    }
  }
}
.comment-detail{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  &_userinfo{
    height: 50px;
    padding: 3px 0;
    display: flex;
    justify-content: space-between;
    &--left{
      .nickname{
        margin-bottom: 5px;
      }
      .time{
        font-size: 12px;
        color: $grey-text-color;
      }
    }
  }
  &_content{
    color: #303133;
    line-height: 1.3;
  }
}
.vip{
  color: rgb(249, 205, 173);
}
</style>
