<template>
  <van-popup
    :value="visible"
    position="right"
    :style="{ width: '100%', height: '100%' }"
    @open="handleOpen"
    @close="handleClose"
  >
    <div class="qrCode">
      <p style="margin: 1em 0">扫描二维码分享给好友邀请队员</p>
      <div id="qrcodeCanvas" class="_code"></div>
      <div class="actions">
        <!-- <van-button type="primary" plain @click="handleMyTeam"
          >查看我的“五个一”团队</van-button
        > -->
      </div>
    </div>
    <i
        role="button"
        class="van-icon van-icon-cross van-popup__close-icon van-popup__close-icon--top-right"
        @click="handleClose()"
        ><!----></i
      >
  </van-popup>
</template>

<script>
import { store } from "@/store";
// import * as util from "@/main/assets/util";
import { AraleQRCode } from "@/main/assets/arale-qrcode";

export default {
  data() {
    return {
      state: store.state,
      visible: false,
      urlText: "",
    };
  },
  computed: {
    myTeams() {
      return this.state.myTeams;
    },
  },
  watch: {
    "state.showQrcode"(showQrcode) {
      if (showQrcode && showQrcode.length) {
        this.visible = true;
        this.urlText = showQrcode;
      } else {
        this.visible = false;
        this.urlText = "";
      }
    },
  },
  methods: {
    handleMyTeam() {
      if (this.myTeams.length > 1) {
        this.$router.push({ name: "我的团队", params: { list: this.myTeams } });
      } else {
        this.$router.push({
          name: "团队详情",
          query: {
            id: this.myTeams[0].id,
          },
        });
      }
      this.handleClose();
    },
    handleOpen() {
      this.createQr(this.urlText);
    },
    handleClose() {
      store.set("showQrcode", "");
    },
    createQr(textValue) {
      // 生成二维码
      let qrnode = new AraleQRCode({
        render: "canvas",
        correctLevel: 0,
        text: textValue,
        size: 300,
        background: "#fff",
        foreground: "#434343",
        pdground: "#e44825",
      });
      setTimeout(() => {
        let node = document.getElementById("qrcodeCanvas");
        if (node) {
          node.innerHTML = "";
          node.appendChild(qrnode);
        } else {
          console.warn("二维码元素未就绪");
        }
      }, 0);
    },
  },
  created() {},
};
</script>

<style scoped>
.qrCode {
  color: #999;
  text-align: center;
  padding-top: 60px;
}
.qrCode ._code {
  width: 300px;
  margin: auto;
}
.actions {
  padding: 20px 0;
  text-align: center;
}
</style>