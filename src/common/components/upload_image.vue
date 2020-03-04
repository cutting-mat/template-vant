<template>
  <van-uploader
    accept="image/*"
    v-model="list"
    :max-count="limit"
    :before-read="beforeUpload"
    :after-read="customUpload"
    :delete="handleRemove"
    :disabled="disabled"
  >
  </van-uploader>
</template>

<script>
import { uploadImg } from "@/common/api/common";
import * as util from "@/common/assets/util";
let { fixBySelector, fixImgFile } = require("ios-photo-repair")
import {store} from "@/store"

export default {
  props: {
    propvalue: {
      type: [Object, Array],
      required: false,
      default: function() {
        return null;
      }
    },
    multiple: {
      type: Boolean,
      required: false,
      default: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    limit: {
      type: Number,
      default: 9
    }
  },
  data() {
    return {
      state: store.state,
      loading: false,
      list: []
    };
  },
  watch: {
    propvalue: {
      handler: function(propvalue) {
        if(propvalue){
          if (!this.multiple) {
            if (propvalue.id) {
              this.list = [propvalue];
            } else {
              this.list = [];
            }
          } else {
            if(propvalue[0] && propvalue[0].id){
              this.list = propvalue;
            }
          }
        }
        
      },
      deep: true,
      immediate: true
    },
    list: {
      handler: function(list) {
        const result = !this.multiple ? list[0] || {} : list;
        this.$emit("change", result);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleSuccess: function(res, file) {
      file.id = res.data.id;
      file.url = res.data.url;
      file.name = res.data.name;

      file.status = 'done';
      file.message = '上传成功';
    },
    handleRemove(file, fileList) {
      this.list = this.list.filter(e => {
        return e.id != file.id;
      });
    },
    handleError: function(err, file) {
      file.status = 'failed';
      file.message = '上传失败';

      this.loading = false;
      return util.catchError(err);
    },
    beforeUpload: function(file) {
      this.loading = true;
      const imgExt = ["jpg", "jpeg", "png"];
      const ext = util.get_suffix(file.name);
      if(ext && imgExt.indexOf(ext)!==-1){
        return true
      }
      this.$message.warning('文件格式错误');
      this.loading = false;
      return false;
    },
    customUpload: function(file, detail){
      file.status = 'uploading';
      file.message = '上传中...';
      //console.log(file)
      fixImgFile(file.file, {
        width: 1000,
        height: 1000
      }).then(base64 => {
        const name = file.file.name.split('.')[0]+'.png';
        if(base64 && name){
          uploadImg({
            base64,
            name
          }).then(res => {
            this.handleSuccess(res.data, file)
          }).catch((err) => {
            this.handleError(err, file)
          })
        }else{
          console.warn('error', base64, name)
        }
      })
    }
  },
  created: function() {}
};
</script>

<style scoped>

</style>

