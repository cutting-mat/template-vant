<template>
  <div class="mainCont flex-col">
    <home class="flex-1" v-if="$route.path == '/'" />
    <router-view class="flex-1" v-else />
  </div>
</template>

<script>
import { getUrlParam } from "@/main/assets/util.js";
import vconsole from "vconsole";
const console = getUrlParam("console");
if (console) {
  new vconsole();
}

export default {
  components: {
    home: () => import("../components/home.vue"),
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
@import url(../assets/style.css);
.mainCont {
  background: #f2f5f9;
}
</style>
