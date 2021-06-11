<template>
  <van-uploader
    :accept="accept"
    result-type="file"
    v-model="files"
    :preview-image="false"
    :before-read="handleBeforeUpload"
    :after-read="customUpload"
    :disabled="disabled"
    @delete="handleRemove"
  >
    <slot></slot>
  </van-uploader>
</template>

<script>
import { upload } from "@/main/api/common";
import * as util from "@/main/assets/util";
import { store } from "@/store";

export default {
  props: {
    propvalue: {
      type: Array,
      required: false,
      default: function () {
        /*
        [{id: '', name: "food.jpeg", url:"..."}]
        */
        return [];
      },
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false,
    },
    accept: {
      type: String,
      required: false,
      default: "*",
    },
    beforeUpload: {
      type: Function,
      required: false,
      default() {
        return true;
      },
    },
    dataExt: {
      type: Object,
      require: false,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      state: store.state,
      loading: false,
      files: [],
    };
  },
  watch: {
    propvalue: {
      handler: function (propvalue) {
        this.files = propvalue;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    customUpload: function (file) {
      file.status = "uploading";
      file.message = "上传中...";
      this.loading = true;
      this.$emit('status', this.loading)

      let formData = new FormData();
      formData.append("file", file.file);
      // 扩展数据
      Object.keys(this.dataExt).forEach((key) => {
        formData.append(key, this.dataExt[key]);
      });
      upload(formData)
        .then((res) => {
          this.handleSuccess(res.data, file);
        })
        .catch((err) => {
          this.handleError(err, file);
        });
    },
    filePreview: util.filePreview,
    triggerSubmit() {
      this.loading = false;
      this.$emit('status', this.loading)
      this.$emit("change", this.files);
    },
    handleSuccess: function (res, file) {
      file.id = res.data.id;
      file.url = res.data.url;
      file.name = res.data.name;

      file.status = "done";
      file.message = "上传成功";
      this.triggerSubmit();
    },
    handleRemove() {
      this.triggerSubmit();
    },
    handleError: function (err, file) {
      file.status = "failed";
      file.message = "上传失败";

      this.loading = false;
      this.$emit('status', this.loading)
      return util.catchError(err);
    },
    handleBeforeUpload(file) {
      // 尺寸校验
      const limitSize = 100 * 1024 * 1024; // 100M
      if (file.size > limitSize) {
        this.$notify({
          message: "文件超出最大限制",
          type: "warning",
        });
        return false;
      }

      // 扩展校验方法
      return this.beforeUpload(file);
    },
  },
  created: function () {},
};
</script>

<style scoped>
</style>
