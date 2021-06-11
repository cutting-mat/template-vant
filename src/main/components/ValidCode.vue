<template>
  <van-count-down
    :time="time"
    ref="countDown"
    :auto-start="false"
    @finish="handleFinish"
  >
    <template #default="timeData">
      <van-button
        v-show="!counting"
        class="theBtn"
        @click="requestCode"
        size="small"
        native-type="button"
        :loading="loading"
        :counting="!queryParam.mobile"
        >发送验证码</van-button
      >
      <span v-show="counting" class="block">{{ timeData.seconds }}秒后重发</span>
    </template>
  </van-count-down>
</template>

<script>
import { getValidCode } from "@/main/api/common";

export default {
  props: {
    time: {
      type: Number,
      required: false,
      default: 60 * 1000,
    },
    mobile: {
      type: String,
      required: false,
      default: ""
    },
  },
  data() {
    return {
      loading: false,
      counting: false,
      queryParam: {
        mobile: null,
        type: 1,
      },
    };
  },
  watch: {
    mobile: {
      handler() {
        this.queryParam.mobile = this.mobile || null;
      },
      immediate: true,
    },
  },
  methods: {
    requestCode() {
      if (this.loading) {
        return null;
      }
      if (this.queryParam.mobile) {
        this.loading = true;
        getValidCode(this.queryParam)
          .then((res) => {
            this.loading = false;
            this.$emit("success", res.data.data);
            // 开始倒计时
            this.counting = true;
            this.$refs.countDown && this.$refs.countDown.start();
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        console.warn("验证码：缺少手机号");
      }
    },
    handleFinish() {
      this.counting = false;
      this.$refs.countDown && this.$refs.countDown.reset();
      
    },
  },
};
</script>

<style scoped>
.theBtn {
  color: #FE664E;
  border: 0;
}
.theBtn::before{
  display: none;
}
</style>
