<template>
  <van-uploader
    :accept="accept"
    result-type="file"
    v-model="files"
    :on-success="handleSuccess"
    :on-error="handleError"
    :before-read="beforeUpload"
    :after-read="customUpload"
    :disabled="disabled"
  ></van-uploader>
</template>

<script>
import { upload } from "@/common/api/common";
import * as util from "@/common/assets/util";
import { store } from "@/store";

export default {
  props: {
    propvalue: {
      type: Array,
      required: false,
      default: function() {
        /*
        [{id: '', name: "food.jpeg", url:"..."}]
        */
        return [];
      }
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false
    },
    accept: {
      type: String,
      required: false,
      default: "*"
    }
  },
  data() {
    return {
      state: store.state,
      loading: false,
      files: []
    };
  },
  watch: {
    propvalue: {
      handler: function(propvalue) {
        this.files = propvalue;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    customUpload: function(file) {
      file.status = "uploading";
      file.message = "上传中...";

      let formData = new FormData();
      formData.append("file", file.file);

      upload(formData)
        .then(res => {
          this.handleSuccess(res.data, file);
        })
        .catch(err => {
          this.handleError(err, file);
        });
    },
    filePreview: util.filePreview,
    triggerSubmit() {
      const result = this.multiple ? this.files : [this.files[0]];
      this.$emit("change", result);
    },
    handleSuccess: function(res, file) {
      file.id = res.data.id;
      file.url = res.data.url;
      file.name = res.data.name;

      file.status = "done";
      file.message = "上传成功";
    },
    handleRemove(file) {
      this.list = this.list.filter(e => {
        return e.id != file.id;
      });
    },
    handleError: function(err, file) {
      file.status = "failed";
      file.message = "上传失败";

      this.loading = false;
      return util.catchError(err);
    },
    beforeUpload(file) {
      this.loading = true;
      const filePass = util.checkUpload(file);
      if (!filePass) {
        this.loading = false;
      }
      return filePass;
    }
  },
  created: function() {}
};
</script>

<style scoped>

</style>
