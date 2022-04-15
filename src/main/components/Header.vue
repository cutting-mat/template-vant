<template>
  <header class="flex-row align-center myheader">
    <h1 class="logo" @click="$router.push('/')">LOGO</h1>
    <div class="flex-1">
      <!-- center -->
    </div>
    <van-image
      round
      :src="user.avatar"
      height="40px"
      @click="show = true"
    ></van-image>
    <van-action-sheet
      v-model:show="show"
      :actions="actions"
      @select="onSelect"
    />
  </header>
</template>

<script>
import { event } from "@/core";
import { ref } from "vue";
import { Dialog } from "vant";

export default {
  setup() {
    const show = ref(false);
    const actions = [{ name: "退出登录" }];

    return {
      show,
      actions,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    onSelect(item) {
      switch (item.name) {
        case "个人信息":
          this.$router.push({ name: "个人信息" });
          break;
        case "退出登录":
          this.logout();
          break;

        default:
          break;
      }
      this.show = false;
    },
    logout: function () {
      Dialog.confirm({
        title: "提示",
        message: "确认退出?",
      }).then(() => {
        event.emit("logout");
      });
    },
  },
};
</script>

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
