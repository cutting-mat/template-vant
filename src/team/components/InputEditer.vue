<template>
  <van-popup
    :value="visible"
    position="right"
    :style="{ width: '100%', height: '100%' }"
    @close="$emit('close')"
  >
    <div class="flex-col SchoolPickerInput">
      <div class="flex-1 scrollbar contBox">
        <div class="van-hairline--bottom">
          <van-field
            v-model.trim="value"
            :label="labelText"
            :type="filedType"
            :autosize="filedType==='textarea'"
            required
            :rules="[{ required: true, message: `请填写${labelText}` }]"
          />
        </div>
      </div>
      <div class="actions">
        <van-button
          block
          color="linear-gradient(to right, #fa533e, #fe3d53)"
          native-type="button"
          @click="
            $emit('change', value);
            $emit('close');
          "
          :disabled="!value.trim()"
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
    labelText: {
      type: String,
      required: false,
      default: '',
    },
    filedType: {
      type: String,
      required: false,
      default: 'text',
    },
    currentValue: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      state: store.state,
      value: "",
    };
  },
  watch: {
    currentValue: {
      handler(){
        this.value = (this.currentValue && this.currentValue.split) ? this.currentValue.trim() : ''
      },
      immediate: true
    }
  },
  methods: {

  },
};
</script>

<style scoped>
.SchoolPickerInput {
  background: #f2f5f9;
  height: 100%;
  box-sizing: border-box;
  padding: 1em;
}
.SchoolPickerInput .contBox {
  padding: 1em;
  background: #fff;
  border-radius: 6px;
  margin-bottom: 1em;
}
</style>
