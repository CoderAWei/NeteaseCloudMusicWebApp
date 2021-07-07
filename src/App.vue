<template>
  <div id="app">
    <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
export default {
  created () {

  },
  mounted () {
    // window.onload = function () {
    //   setTimeout(() => {
    //     const t = performance.timing
    //     const m = performance.memory
    //     console.table({
    //       DNS查询耗时: (t.domainLookupEnd - t.domainLookupStart).toFixed(0),
    //       TCP链接耗时: (t.connectEnd - t.connectStart).toFixed(0),
    //       request请求耗时: (t.responseEnd - t.responseStart).toFixed(0),
    //       解析dom树耗时: (t.domComplete - t.domInteractive).toFixed(0),
    //       白屏时间: (t.responseStart - t.navigationStart).toFixed(0),
    //       domready时间: (t.domContentLoadedEventEnd - t.navigationStart).toFixed(0),
    //       onload时间: (t.loadEventEnd - t.navigationStart).toFixed(0),
    //       js内存使用占比: m ? (m.usedjsHeapSize / m.totaljsHeapSize * 100).toFixed(2) + '%' : undefined
    //     })
    //   })
    // }
  },
  methods: {

  }
}
</script>

<style lang="scss">
$color-primary: #dd001b;

html body{
  width: 100%;
  height: 100vh;
}
#app{
  width: 100%;
  height: 100%;
}
</style>
