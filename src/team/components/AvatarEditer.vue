<template>
  <div>
    <van-popup
      :value="visible"
      position="right"
      :style="{ width: '100%', height: '100%' }"
      @close="$emit('close')"
    >
      <div class="flex-col avatarEditer">
        <van-image
          class="flex-1"
          fit="contain"
          width="100%"
          height="3em"
          :src="value || url || defaultAvatar"
        />
        <div class="actions">
          <ImageUploader :multiple="false" block :previewImage="false" @change="handleUpload" v-if="!disabled">
            <van-button
              block
              color="linear-gradient(to right, #fa533e, #fe3d53)"
            >
              上传图片
            </van-button>
          </ImageUploader>
        </div>
      </div>
      <i
        role="button"
        class="van-icon van-icon-cross van-popup__close-icon van-popup__close-icon--top-right"
        @click="$emit('close')"
        ><!----></i
      >
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false,
    },
    url: {
      type: String,
      required: false,
      default: "",
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: {
    ImageUploader: () => import("@/main/components/ImageUploader.vue"),
  },
  data() {
    return {
      loading: false,
      value: "",
      defaultAvatar: require("../assets/img/team.png"),
    };
  },
  methods: {
    handleUpload(files) {
      console.log(files)
      if (Array.isArray(files) && files.length) {
        this.value = files[0].url;
        this.$emit("change", this.value);
      }
    },
  },
};
</script>

<style scoped>
.avatarEditer {
  height: 100%;
  padding: 1em;
  box-sizing: border-box;
}

.actions {
  padding: 0.5em 0;
}
.actions .van-button {
  margin-top: 0.5em;
}
</style>
