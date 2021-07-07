<template>
  <div v-if="isExternalClass" :style="styleExternalIcon"  class="svg-external-icon svg-icon"  />
  <svg v-else :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang='ts'>
/**
 * @Author: 徐忠炜
 * @Email: 94393598@qq.com / xzwei0914@gmail.com
 * @Didi: 有什么问题都可以发邮件问我哦
 * @Date: 2021/02/01 10:08
 */
import { computed, defineComponent } from 'vue'
import { isExternal } from '@/utils/validate'
export default defineComponent({
  name: '',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const isExternalClass = computed(() => {
      return isExternal(props.iconClass)
    })
    const svgClass = computed(() => {
      if (props.className) {
        return 'svg-icon ' + props.className
      } else {
        return 'svg-icon'
      }
    })
    const iconName = computed(() => {
      return `#icon-${props.iconClass}`
    })
    const styleExternalIcon = computed(() => {
      return {
        mask: `url(${props.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${props.iconClass}) no-repeat 50% 50%`
      }
    })

    return {
      isExternalClass,
      svgClass,
      iconName,
      styleExternalIcon
    }
  },
  components: {

  }
})
</script>

<style scoped lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover!important;
  display: inline-block;
}
</style>
