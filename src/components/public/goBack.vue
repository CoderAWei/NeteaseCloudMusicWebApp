// 返回上一级组件
<template>
  <div class="go-back" :style="showGoBack.style">
    <p><i class="fa fa-arrow-left" @click="back"></i><span v-show="showGoBack.show === 1">{{showGoBack.title}}</span></p>
  </div>
</template>

<script>
export default {
  props: {
    showGoBack: Object
  },
  data () {
    return {

    }
  },
  computed: {

  },
  created () {

  },
  mounted () {

  },
  watch: {

  },
  methods: {
    back () {
      this.$router.push(`${this.showGoBack.path}`)
    }
  },
  components: {

  }
}
</script>

<style scoped lang="scss">
.go-back{
  margin-bottom: 20px;
  width: 100%;
  p{
    i{
      margin-right: 20px;
    }
  }
}
</style>
