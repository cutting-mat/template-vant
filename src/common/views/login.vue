<template>
  <div class="mainCont flex-row align-center justify-center loginPage">
    <van-form @submit="login">
      <van-field
        v-model="queryParam.username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="queryParam.password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
    
  </div>
</template>

<script>
import * as user from '../api/user';
import {emit} from '../assets/util'

export default {
  data() {
    return {
      loading: false,
      queryParam: {
        username: "",
        password: ""
      }
      
    };
  },
  methods: {
    login() {
      this.loading = true;
      user
        .login(this.queryParam)
        .then(res => {
          this.loading = false;
          
          emit("login", {
            from: this.$router.currentRoute.query.from,
            data: res.data.data
          });
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped>
.loginPage{
  background: #f4f4f4;
}

.login-form {
  width: 320px;
  background:#fff;
  border-radius: 10px;
  padding: 20px 50px;
}
.main-title {
  text-align: center;
}
.des {
  text-align: center;
  color: #999;
  margin-bottom: 2em;
}

.submit-item {
  margin-top: 30px;
}
.submit-button{
   width: 100%;
}
.footer-info{
  text-align: center;
  font-size: .9em;
  color: #999;
}

</style>