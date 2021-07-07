// 全局加载组件
const handleMove = (e: TouchEvent) => {
  e.preventDefault()
}

export default {
  beforeMount(el: HTMLElement, binding: any) {},
  mounted() {},
  beforeUpdate() {}, // 新
  updated(el: HTMLElement, binding: any) { // 更新的时候用这个
    if (binding.value) {
      /**
       * 如果传过来的值为true 你们就是要展示loading
       * el是当前指令绑定的对象 binding是传过来的值
       */

      // 在移动端页面禁用滚动
      document.body.addEventListener('touchmove', handleMove, { passive: false })

      // 判断当前页面是否存在没有消失的loading
      // hasLoading 值为false 时表明没有loading 可以添加loading
      const hasLoading = el.getElementsByClassName('xzw-loading').length !== 0
      if (hasLoading) return '日你温哦，有loading了还添加个锤子'

      // 判断是否传入了自定义提示文字
      const hasCustomText = el.getAttribute('xzw-loading-text')

      // 判断是否传入了自定义背景色
      const hasCustomBgColor = el.getAttribute('xzw-loading-background')

      el.style.position = 'relative'
      const mask = document.createElement('div')
      const loadingBox = document.createElement('div')
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      const text = document.createElement('p')

      mask.setAttribute('class', 'xzw-loading')
      mask.style.background = !hasCustomBgColor ? 'rgba(255, 255, 255, .8)' : hasCustomBgColor
      loadingBox.setAttribute('class', 'xzw-loading-box')
      svg.setAttribute('class', 'xzw-loading_circular refleash')
      svg.setAttribute('viewBox', '25 25 50 50')
      circle.setAttribute('cx', '50')
      circle.setAttribute('cy', '50')
      circle.setAttribute('r', '20')
      circle.setAttribute('fill', 'none')
      text.innerText = !hasCustomText ? '加载中' : hasCustomText

      svg.appendChild(circle)
      loadingBox.appendChild(svg)
      loadingBox.appendChild(text)
      mask.appendChild(loadingBox)
      // mask.appendChild(text)
      el.appendChild(mask)
    } else {
      /**
       * 传过来的值为false 不需要展示loading
       * 移除loading相关dom
       */
      for (let i = 0; i < el.childNodes.length; i++) {
        if ((el.childNodes[i] as any).className === 'xzw-loading') {
          const childNodes = el.getElementsByClassName('xzw-loading')[0]
          el.removeChild(childNodes)
          break
        }
      }

      // 弹窗消失时移除'禁用滑动事件'
      document.body.removeEventListener('touchmove', handleMove)
    }
  },
  beforeUnmount() {}, // 新
  unmounted() {}
}
