<template>
  <router-view />
</template>

<script>
export default {
  name: "CuttingMatApp",
  created: function () {
    this.$Permission((token) => {
      console.log(token);
    });
    // code登录
  },
};
</script>
