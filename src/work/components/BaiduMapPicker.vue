<template>
  <van-popup
    :value="visible"
    position="bottom"
    :style="{ width: '100%', height: '100%' }"
    @close="$emit('close')"
  >
    <div class="flex-col mapPicker">
      <div class="_hd" style="overflow: hidden">
        <div class="pageTitle">定位打卡</div>
      </div>
      
      <WidgetBMap class="flex-1" :center="gaodePoint" @change="handleChange" />

      <div class="actions flex-row">
        <van-button class="flex-1"
          native-type="button"
          @click="$emit('refreshGps')"
        >
          刷新定位
        </van-button>
        <van-button class="flex-1"
          color="linear-gradient(to right, #fa533e, #fe3d53)"
          native-type="button"
          @click="save()"
          :disabled="!editForm.title"
        >
          确认
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
    WidgetBMap: () => import("./WidgetBMap/index.vue"),
  },
  data() {
    return {
      state: store.state,
      editForm: {
        name: null,
      },
    };
  },
  computed: {
    gaodePoint() {
      if(this.currentValue && this.currentValue.split){
        const arr = this.currentValue.split(',');
        return {
          lng: arr[0],
          lat:  arr[1]
        }
      }else{
        return null
      }
    }
  },
  methods: {
    handleChange(item) {
      console.log(item)
      this.editForm = item;
    },
    save() {
      if (this.editForm.title) {
        this.$emit("change", this.editForm);
        this.$emit("close");
      }
    },
  },
};
</script>

<style scoped>
.mapPicker {
  background: #fff;
  height: 100%;
  box-sizing: border-box;
}
.mapPicker ._hd {
  margin-bottom: 1em;
}
.pageTitle {
  font-size: 1.1em;
  padding: 1em 1em 0;
}


.actions .van-button{
  margin: 1em;
}
</style>
