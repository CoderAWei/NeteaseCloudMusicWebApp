<template>
  <van-sticky>
    <div class='goback'>
      <div class="goback-box">
        <div class="goback-left" @click="$router.push(gobackParams.url)">
          <svg-icon iconClass='goback'/>
        </div>
        <div class="goback-right" v-if="gobackParams.isShowText">
          <p class="goback-text">{{gobackParams.text}}</p>
        </div>
      </div>
    </div>
  </van-sticky>
</template>

<script lang='ts'>
/**
 * @Author: 徐忠炜
 * @Email: 94393598@qq.com / xzwei0914@gmail.com
 * @Didi: 有什么问题都可以发邮件问我哦
 * @Date: 2021/02/02 10:13
 */
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  name: '',
  props: {
    textPosition: {
      type: String as PropType<String>,
      default: 'center'
    },
    gobackParams: Object as PropType<Object>
  },
  setup() {
    return {

    }
  },
  components: {

  }
})
</script>

<style scoped lang="scss">
// @import url('../../styles/index.scss');
.goback{
  height: 30px;
  width: 100%;
  background: url('../../assets/images/bg.png');
  background-color: $primary-color;
  color: $dark-text-color;
  &-box{
    // height: 100%;
    padding: 7px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &-left{
    height: 16px;
    width: 20px;
  }
  &-right{
    line-height: 16px;
    width: calc(100% - 30px);
  }
}
</style>
