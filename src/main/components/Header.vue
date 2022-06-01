<script setup>
import { Image as VanImage, Dialog, ActionSheet } from "vant";
import { event } from "@/core";
import { ref, onMounted } from "vue";
import { $store } from "@/plugin.store.config";
const show = ref(false);
const actions = [{ name: "退出登录" }];
$store.fetchUser();

const onSelect = function (item) {
  switch (item.name) {
    case "个人信息":
      this.$router.push({ name: "个人信息" });
      break;
    case "退出登录":
      logout();
      break;

    default:
      break;
  }
  this.show = false;
};

const logout = function () {
  Dialog.confirm({
    title: "提示",
    message: "确认退出?",
  })
    .then(() => {
      event.emit("logout");
    })
    .catch(() => null);
};

console.log("created!");

onMounted(() => {
  console.log("mounted!");
});
</script>

<template>
  <header class="flex-row align-center myheader">
    <h1 class="logo" @click="$router.push('/')">LOGO</h1>
    <div class="flex-1">
      <!-- center -->
    </div>
    <van-image
      round
      :src="$store.user.avatar"
      width="40px"
      height="40px"
      @click="show = true"
    ></van-image>
    <action-sheet v-model:show="show" :actions="actions" @select="onSelect" />
  </header>
</template>

<style scoped>
.myheader {
  padding: 0 20px;
  height: 60px;
  background: #257ff7;
  background-size: cover;
  color: #fff;
}

.logo {
  cursor: pointer;
  margin-right: 15px;
}
</style>
