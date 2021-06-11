<template>
  <!-- 微信提升弹层 -->
  <van-overlay
    :show="showWeixinTip"
    @click="showWeixinTip = false"
    class="WeixinShareTip"
  >
    <img src="../../team/assets/img/arrow_top.png" class="_arrow" />
    <div class="_tip">请点击右上角按钮，选择在浏览器或Safari中打开</div>
  </van-overlay>
</template>

<script>
import * as util from "@/main/assets/util";

export default {
  data() {
    return {
      showWeixinTip: false,
    };
  },
  created() {
    if (!util.storage("is_webview")) {
      // 非app端入口
      this.$dialog
        .alert({
          title: "请前往App录入",
          message: `走、访、创、干等四步的内容
请前往App提交`,
          showCancelButton: true,
          confirmButtonText: "前往下载APP",
          confirmButtonColor: "#0265ed",
          cancelButtonText: "好的",
        })
        .then(() => {
          // 跳转官网下载页
          window.open('/a/downloadapp/index.html')
        })
    }
  },
};
</script>

<style scoped>
/* 微信分享 */
.WeixinShareTip ._arrow {
  max-width: 50%;
  float: right;
}
.WeixinShareTip ._tip {
  clear: right;
  text-align: center;
  color: #fff;
  font-size: 16px;
}
</style>
