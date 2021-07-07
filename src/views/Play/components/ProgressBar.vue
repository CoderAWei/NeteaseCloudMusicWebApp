<template>
  <div
    class='progress-box'
    ref="progressRef"
    @click="handleClickProgress"
    @touchstart='handleTouchStart'
    @touchmove='handleTouchMove'
    @touchend='handleTouchEnd'
    style="width: 100%;"
  >
    <div
    class="track"
    :style="{
      backgroundColor: trackColor,
      height: `${strokeWidth}px`,
      marginTop: `${(20 - Number(strokeWidth)) / 2}px`
    }"
      >
    </div>
    <div
    class="progress-bar"
    :style="{
      backgroundColor: color,
      height: `${strokeWidth}px`,
      width: `${percentage}%`,
      marginTop: `${(20 - Number(strokeWidth)) / 2}px`
    }"
      >
    </div>
    <div
    class="progress-dot"
    :style="{
      width: `${dotWidth}px`,
      height: `${dotWidth}px`,
      backgroundColor: color,
      marginTop: `${(20 - Number(dotWidth)) / 2}px`,
      left: `${Number(percentage) === 100 ? `${Number(percentage) - 1.5}%` : `${percentage}%`}`
      }"
    >
    </div>
  </div>
</template>

<script lang='ts'>
/**
 * @Author: 徐忠炜
 * @Email: 94393598@qq.com / xzwei0914@gmail.com
 * @Didi: 有什么问题都可以发邮件问我哦
 * @Date: 2021/02/25 09:46
 */
import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
export default defineComponent({
  name: '',
  props: {
    strokeWidth: {
      type: String as PropType<String>,
      default: '4'
    },
    trackColor: {
      type: String as PropType<String>,
      default: '#e5e5e5'
    },
    color: {
      type: String as PropType<String>,
      default: '#ffb3a7'
    },
    width: {
      type: String as PropType<String>,
      default: '0'
    },
    dotWidth: {
      type: String as PropType<String>,
      default: '12'
    }
  },
  setup(props, ctx) {
    // const width = props.width
    const percentage = ref<string>('') // 传过来的进度条宽度
    const progressRef = ref<any>(null) // 整个progress组件 用来获取长度
    const progressWidth = ref<number>(0) // progress的长度
    let touchStart:number = 0
    let touchEnd:number = 0

    watch(() => props.width, (newValue, oldValue) => {
      percentage.value = newValue as string
    })
    // 点击进度条事件
    const handleClickProgress = (event: MouseEvent):void => {
      const e = event || window.event
      const position = e.clientX - progressRef.value.offsetLeft // 当前点击位置距离进度条最左边的距离
      percentage.value = ((position / progressWidth.value) * 100).toFixed(3).toString()
      ctx.emit('progressClick', percentage.value)
    }

    // 拖动进度条事件
    const handleTouchStart = (event: TouchEvent):void => {
      // console.log(`拖拽起始位置: ${event.touches[0].clientX}`)
      touchStart = event.touches[0].clientX
    }
    const handleTouchMove = (event: TouchEvent):void => {
      // console.log(`拖拽到了: ${event.touches[0].clientX}`)
      let moveX = event.touches[0].clientX - progressRef.value.offsetLeft // progressRef.value.offsetLeft是进度条左边距浏览器左侧的距离 不变的
      if (moveX >= progressWidth.value) moveX = progressWidth.value
      if (moveX <= 0) moveX = 0
      percentage.value = ((moveX / progressWidth.value) * 100).toFixed(3).toString()

      // 将拖拽中的进度传递给父组件 例如用于调整音量
      ctx.emit('progressMove', percentage.value)
    }
    const handleTouchEnd = (event: TouchEvent):void => {
      // console.log(`拖拽结束位置: ${event.changedTouches[0].clientX}`)
      touchEnd = event.changedTouches[0].clientX
      if (touchStart === touchEnd) {
        console.log('这是click事件触发的touch事件')
      } else {
        // 拖拽事件结束，将当前拖拽进度传递给父组件
        ctx.emit('progressTouch', percentage.value)
      }
    }

    onMounted(() => {
      // 将进度条组件的宽度赋值给变量
      progressWidth.value = progressRef.value.offsetWidth
    })

    return {
      handleClickProgress,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      percentage,
      progressRef
    }
  },
  components: {

  }
})
</script>

<style scoped lang="scss">
.progress-box{
  position: relative;
  height: 20px;
  .track,
  .progress-bar{
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 4px;
  }
  .track{
    width: 100%;
  }
  .progress-dot{
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
  }
}
</style>
