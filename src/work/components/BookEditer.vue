<template>
  <van-popup
    :value="visible"
    position="right"
    :style="{ width: '100%', height: '100%' }"
    @close="$emit('close')"
  >
    <div class="flex-col BookEditer">
      <div class="_hd" style="overflow: hidden">
        <div class="pageTitle">录入书籍或文献</div>
      </div>
      <div class="flex-1 scrollbar contBox">
        <van-form ref="theForm" class="theForm">
          <div class="van-hairline--bottom">
            <van-field
              v-model.trim="editForm.name"
              label="名称"
              type="text"
              required
              :rules="[{ required: true, message: `请填写名称` }]"
            />
          </div>
          <div class="van-hairline--bottom">
            <van-cell>
              <div class="flex-row align-center">
                <div class="flex-1">
                  <van-image
                    width="3em"
                    height="4em"
                    :src="editForm.cover"
                    fit="cover"
                  />
                </div>
                <ImageUploader
                  :multiple="false"
                  block
                  :previewImage="false"
                  @change="handleUpload"
                >
                  <div class="_link">上传 <van-icon name="arrow" /></div>
                </ImageUploader>
              </div>
            </van-cell>
          </div>
        </van-form>
      </div>
      <div class="actions">
        <van-button
          block
          color="linear-gradient(to right, #fa533e, #fe3d53)"
          native-type="button"
          @click="save()"
          :disabled="!editForm.name"
        >
          保存
        </van-button>
      </div>
    </div>
    <i
      role="button"
      class="van-icon van-icon-cross van-popup__close-icon van-popup__close-icon--top-right"
      @click="$emit('close')"
      ><!----></i
    >
  </van-popup>
</template>

<script>
import { store } from "@/store";

export default {
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false,
    },
    currentValue: {
      type: String,
      required: false,
      default: "",
    },
  },
  components: {
    ImageUploader: () => import("@/main/components/ImageUploader.vue"),
  },
  data() {
    return {
      state: store.state,
      editForm: {
        name: null,
        cover: null,
      },
    };
  },
  watch: {
    currentValue: {
      handler() {
        this.value =
          this.currentValue && this.currentValue.split
            ? this.currentValue.trim()
            : "";
      },
      immediate: true,
    },
  },
  methods: {
    handleUpload(files) {
      console.log(files);
      if (Array.isArray(files) && files.length) {
        this.editForm.cover = files[0].url;
      }
    },
    save() {
      if (this.editForm.name) {
        this.$emit("change", this.editForm);
        this.$emit("close");
      }
    },
  },
};
</script>

<style scoped>
.BookEditer {
  background: #f2f5f9;
  height: 100%;
  box-sizing: border-box;
  padding: 1em;
}
.BookEditer ._hd {
  margin-bottom: 1em;
}
.pageTitle {
  font-size: 1.1em;
  padding: 1em 1em 0;
}

.BookEditer .contBox {
  padding: 1em;
  background: #fff;
  border-radius: 6px;
  margin-bottom: 1em;
}

.theForm .van-cell {
  padding: 16px;
}

.theForm ._link {
  color: #fe664e;
}
</style>
