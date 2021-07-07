<template v-if='false'>
  <div class='xzw-tabs'>
    <div
      :class="{'xzw-tabs_item': true, 'tab-active': activeTab === item.id }"
      v-for="item in tabMenus"
      :key="item.id"
      @click="handleClickTabbar(item.linkto, item.id)">
      <div class="xzw-tabs_item_svg">
        <svg-icon :icon-class='item.icon'/>
      </div>
      <p class="xzw-tabs_item_name">{{item.name}}</p>
    </div>
  </div>
</template>

<script lang='ts'>
/**
 * @Author: 徐忠炜
 * @Email: 94393598@qq.com / xzwei0914@gmail.com
 * @Didi: 有什么问题都可以发邮件问我哦
 * @Date: 2021/02/01 09:18
 */
import { ITabMenu } from '@/typings'
import { defineComponent, PropType, ref } from 'vue'
import { useRouter } from 'vue-router'
import { LayoutModule } from '@/store/modules/layout'

export default defineComponent({
  name: '',
  props: {
    tabMenu: Array as PropType<ITabMenu[]>
  },
  setup(props, emit) {
    const router = useRouter()
    const tabMenus = props.tabMenu

    // 当第一次进页面时初始化tabbar 默认选中第一个
    if (!sessionStorage.currentLink) {
      LayoutModule.setCurrentTab()
      LayoutModule.setCurrentLink()
    }
    const activeTab = ref(LayoutModule.currentTab)

    const handleClickTabbar = (linkto: string, id: number):void => {
      // 实现跳转和tabbar的切换
      router.push(linkto)
      activeTab.value = id
      // 更新选中的tabbar
      LayoutModule.setCurrentTab(id)
      LayoutModule.setCurrentLink(linkto)
    }

    handleClickTabbar(sessionStorage.currentLink, JSON.parse(sessionStorage.currentTab))

    return {
      tabMenus,
      activeTab,
      handleClickTabbar
    }
  },
  components: {

  }
})
</script>

<style scoped lang="scss">
.xzw-tabs{
  width: 100%;
  height: 50px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: $white-text-color;
  background-color: $dark-color;
  position: fixed;
  bottom: 0;
  left: 0;
  &_item{
    font-size: 12px;
    text-align: center;
    &_svg{
      width: 29px;
      height: 29px;
      overflow: hidden;
      background: url('../../assets/images/bg.png');
      display: flex;
      align-items: center;
      justify-content: center;
      .svg-icon{
        font-size: 2.4em;
      }
    }
    &_name{
      margin-top: 2px;
    }
  }
  &_item.tab-active{
    .xzw-tabs_item_svg{
      border-radius: 50%;
      background-color: $primary-color;
    }
    .svg-icon{
      color: #fff;
      font-size: 1.8em;
    }
    .xzw-tabs_item_name{
      color: $primary-color;
    }
  }
}
</style>
