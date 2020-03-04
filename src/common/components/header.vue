<template>
<div>
  <van-nav-bar >
    <h1 name="logo" slot="title" class="logo" @click="$router.push('/')">LOGO</h1>

    <span
      v-if="state.user && state.user.username"
      name="avat"
      slot="right"
      class="username"
      @click="show=true"
    >{{state.user.username}}</span>
  </van-nav-bar>

  <van-action-sheet v-model="show" :actions="actions" @select="onSelect" />
</div>
</template>

<script>
import { store } from "@/store";
import { emit } from "../assets/util";

export default {
  data() {
    return {
      state: store.state,
      show: false,
      actions: [{ name: "退出登录"}]
    };
  },
  methods: {
    onSelect(item) {
      this.show = false;
      switch (item.name) {
        case "退出登录":
          this.logout();
          break;

        default:
          break;
      }
    },
    logout: function() {
      this.$dialog.confirm({
        title: "提示",
        message: "确认退出？"
      }).then(() => {
        emit("logout");
      });
    }
  }
};
</script>

<style scoped>

</style>
