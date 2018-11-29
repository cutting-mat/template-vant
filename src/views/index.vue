<template>
  <div>
    index
  </div>
</template>

<script>
import * as util from "../assets/util";

export default {
  data() {
    return {
      
    };
  },
  methods: {
    hello: function(){
      let randomString = `random string ${util.getUUID()}`
      this.$createToast({
        time: 1000,
        txt: randomString
      }).show()
    }
  },
  created: function() {
    this.hello()
  }
};
</script>

<style>

</style>
