<template>
  <div class="scrollbar">

    <div class="flex-row">
      <div class="flex-1 box blockLayout">
        <div>文件上传：</div>
        <uploader multiple @change="handleUploadFile" />
      </div>
    </div>
    <div class="flex-row">
      <div class="flex-1 box blockLayout">
        <div>图片上传：</div>
        <uploadImage @change="handleUploadImage" />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {
    uploader: resolve =>
      require(["@/common/components/uploader"], resolve),
    uploadImage: resolve =>
      require(["@/common/components/upload_image"], resolve)
  },
  data() {
    return {
      images: [],
      files: []
    }
  },
  methods: {
    handleUploadImage(files) {
      this.images = files;
    },
    handleUploadFile(files) {
      this.files = files;
    }
  }
}
</script>

<style scoped>
.box{
  height: 250px;
}
</style>
