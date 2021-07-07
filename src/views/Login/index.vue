<template>
  <div class='container'>
    <div class="login">
      <div class="login-form">
        <input type="text" v-model="formValue.phone" placeholder="Phone" autocomplete="off" @input="handleInputNumber" maxlength="11">
        <input type="password" v-model="formValue.password" placeholder="Password" autocomplete="off">
        <button @click="login">Login</button>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
/**
 * @Author: 徐忠炜
 * @Email: 94393598@qq.com / xzwei0914@gmail.com
 * @Didi: 有什么问题都可以发邮件问我哦
 * @Date: 2021/02/20 17:39
 */
import { defineComponent, ref } from 'vue'
import { Toast } from 'vant'
import { Md5 } from 'ts-md5/dist/md5'
import { UserModule } from '@/store/modules/user'
export default defineComponent({
  name: '',
  props: {

  },
  setup() {
    const formValue = ref({
      phone: '',
      password: ''
    })

    function login() {
      if (!formValue.value.phone || !formValue.value.password) {
        Toast({
          type: 'fail',
          position: 'top',
          message: '求求你去看看眼科吧！'
        })
        return
      }
      const params = {
        phone: formValue.value.phone,
        password: formValue.value.password,
        md5_password: Md5.hashStr(formValue.value.password)
      }
      UserModule.login(params).then(res => {
        UserModule.setLoginStatus(true)
      })
    }

    function handleInputNumber(e: { target: { value: string } }) {
      formValue.value.phone = e.target.value.replace(/[^\d]/g, '')
    }

    return {
      formValue,
      login,
      handleInputNumber
    }
  },
  components: {

  }
})
</script>

<style scoped lang="scss">
.container{
  height: 100%;
}
.login{
  height: 100%;
  width: 100%;
  background: url('../../assets/images/bg.png');
  background-color: $primary-color;
  &-form{
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    input{
      display: block;
      appearance: none;
      outline: 0;
      border: 1px solid $light-color;
      background-color: rgba($color: $light-color, $alpha: .2);
      width: 228px;

      border-radius: 4px;
      padding: 10px 15px;
      margin: 0 0 10px 0;
      display: block;
      text-align: center;
      font-size: 18px;

      color: $light-color;

      transition-duration: 0.25s;
      font-weight: 300;

      &:hover{
        background-color: rgba($color: $light-color, $alpha: .4);
      }

      &:focus{
        background-color: white;
        width: 300px;
        color: $primary-color;
      }
      &::-webkit-input-placeholder { /* WebKit browsers */
        color:white;
        font-weight: 300;
      }
      &:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color:white;
        opacity: 1;
        font-weight: 300;
      }
      &::-moz-placeholder { /* Mozilla Firefox 19+ */
        color:white;
        opacity: 1;
        font-weight: 300;
      }
      &:-ms-input-placeholder { /* Internet Explorer 10+ */
        color:white;
        font-weight: 300;
      }
    }
    button{
      appearance: none;
      outline: 0;
      background-color: white;
      border: 0;
      padding: 15px 20px;
      color: $primary-color;
      border-radius: 4px;
      width: 260px;
      cursor: pointer;
      font-size: 18px;
      transition-duration: 0.25s;

      &:hover{
        background-color: rgb(245, 247, 249);
      }
    }
  }
}
</style>
