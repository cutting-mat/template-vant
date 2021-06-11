<template>
  <van-uploader :class="{isBlock: block}"
    :accept="actualAccept"
    v-model="list"
    :max-count="limit"
    :before-read="handleBeforeUpload"
    :after-read="customUpload"
    :disabled="disabled"
    :preview-image="previewImage"
    @delete="handleRemove"
  >
    <slot></slot>
  </van-uploader>
</template>

<script>
import { uploadImg } from "@/main/api/common";
import * as util from "@/main/assets/util";
let { fixImgFile } = require("ios-photo-repair");
import { store } from "@/store";
import { getExtByAccept } from "../assets/FileType";

export default {
  props: {
    propvalue: {
      type: Array,
      required: false,
      default: function () {
        return [];
      },
    },
    multiple: {
      type: Boolean,
      required: false,
      default: true,
    },
    block: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    limit: {
      type: Number,
      required: false,
      default: undefined,
    },
    accept: {
      type: String,
      required: false,
      default: "t-image",
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
    previewImage: {
      type: Boolean,
      required: false,
      default: true,
    }
  },
  data() {
    return {
      state: store.state,
      loading: false,
      list: [],
    };
  },
  computed: {
    actualAccept() {
      if (this.accept.indexOf("t-") !== -1) {
        let result = getExtByAccept(this.accept);

        if (result.length) {
          return result.map((ext) => `.${ext}`).join(",");
        } else {
          return "*";
        }
      } else {
        return this.accept;
      }
    },
  },
  watch: {
    propvalue: {
      handler: function (propvalue) {
        if (Array.isArray(propvalue)) {
          this.list = propvalue;
        }
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    triggerSubmit() {
      this.$emit("change", this.list);
    },
    handleSuccess: function (res, file) {
      file.id = res.data.id;
      file.url = res.data.url;
      file.name = res.data.name;

      file.status = "done";
      file.message = "上传成功";
      if(!this.multiple){
        // 单选剪裁list
        this.list = [this.list[this.list.length - 1]]
      }
      this.triggerSubmit()
    },
    handleRemove() {
      this.triggerSubmit()
    },
    handleError: function (err, file) {
      file.status = "failed";
      file.message = "上传失败";

      this.loading = false;
      return util.catchError(err);
    },
    handleBeforeUpload: function (file) {
      // 尺寸校验
      const limitSize = 100 * 1024 * 1024; // 100M
      if (file.size > limitSize) {
        this.$message.warning("文件超出最大限制");
        return false;
      }

      // 扩展校验方法
      return this.beforeUpload(file);
    },
    customUpload: function (file) {
      file.status = "uploading";
      file.message = "上传中...";
      //console.log(file)
      fixImgFile(file.file, {
        width: 1000,
        height: 1000,
      }).then((base64) => {
        const name = file.file.name.split(".")[0] + ".png";
        if (base64 && name) {
          uploadImg(
            Object.assign(
              {
                base64,
                name,
              },
              this.dataExt
            )
          )
            .then((res) => {
              this.handleSuccess(res.data, file);
            })
            .catch((err) => {
              this.handleError(err, file);
            });
        } else {
          console.warn("error", base64, name);
        }
      });
    },
  },
  created: function () {},
};
</script>

<style scoped>
.isBlock {
  display: block;
}
.isBlock >>> .van-uploader__wrapper{
  display: block;
}
</style>

