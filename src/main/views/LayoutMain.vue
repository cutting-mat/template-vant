<script setup>
import { defineAsyncComponent } from "vue";
const HomePage = defineAsyncComponent(() =>
  import("../components/HomePage.vue")
);
</script>

<template>
  <div class="flex-col mainLayout">
    <!-- 头部 -->
    <Header />
    <!-- 首页 -->
    <HomePage v-if="$route.path == '/'" class="flex-1 flex-row" />
    <!-- 内页 -->
    <router-view v-else class="flex-1 flex-row main" />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style scoped>
@import url(../assets/style.css);

/* 内容快 */
.mainLayout .main {
  padding: 0 20px;
}
</style>
