<template>
  <div class="mainCont flex-row align-center justify-center loginPage">
    <div>
      <div class="logo">
        <img src="../assets/img/logo.png" />
      </div>
      <van-form @submit="login">
        <van-field
          v-model.trim="queryParam.accountNumber"
          type="tel"
          label=""
          placeholder="手机号"
          :rules="[{ required: true, message: '请填写手机号' }]"
        />
        <van-field
          v-model.trim="queryParam.password"
          type="password"
          label=""
          placeholder="密码"
          :rules="[{ required: true, pattern: new RegExp('^[a-zA-Z0-9]{6,16}$'),  message: '请填写6~16位密码' }]"
        />
        <div style="margin: 16px">
          没有账号？前往<span
            style="color: #fe664e; padding: 0.5em"
            @click="$router.push({ name: '注册' ,query: $route.query})"
            >注册</span
          >
        </div>
        <div class="actions">
          <van-button
            block
            color="linear-gradient(to right, #fa533e, #fe3d53)"
            native-type="submit"
            size="lardge"
          >
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import * as user from "@/user/api/user";
import { emit } from "../assets/util";

export default {
  data() {
    return {
      loading: false,
      queryParam: {
        accountNumber: "",
        password: "",
        accountType: 1, // 账号类型(1 前台账号 0 后台账号)
      },
    };
  },
  methods: {
    login() {
      if(this.loading){
        return null;
      }
      this.loading = true;
      user
        .login(this.queryParam)
        .then((res) => {
          this.loading = false;
          if (res.data.code === 200) {
            // 登录后全局发布 login 事件，将在app.vue里接收
            emit("login", {
              from: this.$router.currentRoute.query.from || '/',
              data: res.data.data,
            });
          } else {
            this.$notify({
              message: res.data.msg || "登录失败",
              type: "warning",
            });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.loginPage {
  background: #fff;
}
.loginPage .van-cell{
  padding: 16px;
}
.logo {
  margin-bottom: 3em;
}
.logo img {
  display: block;
  width: 50%;
  margin: auto;
}
.actions{
  margin: 8em 16px 0
}
</style>