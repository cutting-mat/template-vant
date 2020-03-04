<template>
  <div class="mainCont flex-col">
    <!-- 头部 -->
    <global-header />
    <div class="flex-1 flex-row">
      
      <!-- 内容 -->
      <template v-if="$route.path=='/'">
        <dashboard class="flex-1" />
      </template>
      <template v-else>
        <div class="flex-1 flex-col">

          <router-view class="flex-1" />
        </div>
      </template> 
    </div>
  </div>
</template>

<script>

export default {
  components: {
    dashboard: () => import("../components/dashboard.vue")
  },
  data () {
    return {
      
    }
  },
  methods: {
    
  }
};
</script>

<style scoped>
.mainCont{background:#f5f5f5;}
</style>
