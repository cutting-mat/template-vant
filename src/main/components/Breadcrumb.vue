<template>
  <div class="breadcrumb flex-row align-center">
    <i class="el-icon-s-home _home"></i>
    <van-breadcrumb class="flex-1" separator="/">
      <template v-for="route in $route.matched">
        <van-breadcrumb-item
          :key="route.path"
          :to="route"
          v-if="!route.meta.hide"
          >{{ route.meta.title || route.name }}</van-breadcrumb-item
        >
      </template>
    </van-breadcrumb>
    <slot>
      <van-button type="text" @click="$router.go(-1)">
        <i class="el-icon-back"></i> 返回
      </van-button>
    </slot>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.breadcrumb {
  position: relative;
  height: 50px;
  box-sizing: border-box;
}
.breadcrumb ._home {
  font-size: 1.2em;
  color: #9b9b9b;
  margin-right: 6px;
}
</style>
