<template>
  <van-select
    v-bind="$attrs"
    v-model="bindValue"
    @change="$emit('change', $event)"
  >
    <van-option
      :label="$attrs.placeholder || '全部'"
      :value="null"
      v-if="nullAble"
    ></van-option>
    <van-option
      v-for="item in list"
      :key="item.value"
      :label="item[labelKey]"
      :value="item[valueKey]"
    ></van-option>
  </van-select>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: [String, Number],
      required: false,
    },
    valueKey: {
      type: String,
      required: false,
      default() {
        return "value";
      },
    },
    labelKey: {
      type: String,
      required: false,
      default() {
        return "label";
      },
    },
    nullAble: {
      type: Boolean,
      required: false,
      default() {
        return true;
      },
    },
    request: {
      type: Function,
      required: false,
    },
    param: {
      type: String,
      required: false,
      default() {
        return undefined;
      },
    },
    responseTransfer: {
      type: Function,
      required: false,
      default(response) {
        return response;
      },
    },
  },
  setup(props) {
    const internalInstance = getCurrentInstance();
    const $DictControl =
      internalInstance.appContext.config.globalProperties.$DictControl;
    const $DictControlKeys = Object.keys($DictControl);
    let newProps = {};
    for (let key in props) {
      if ($DictControlKeys.indexOf(key) !== -1) {
        newProps[key] = $DictControl[key];
      } else {
        newProps[key] = props[key];
      }
    }
    return newProps;
  },
  data() {
    return {
      bindValue: null,
      list: [],
    };
  },
  watch: {
    value: {
      handler() {
        if (this.value) {
          this.bindValue = this.value;
        }
      },
      immediate: true,
    },
  },
  methods: {
    fetchData: async function () {
      if (!Vue.$DictControl && !Vue.$DictControl.request && !this.request) {
        return console.warn(
          "DictControl: The required configuration [request] is missing!"
        );
      }

      const DataRequest = this.request || Vue.$DictControl.request;
      if (typeof DataRequest !== "function") {
        return console.warn("DictControl: [request] must be a Function!");
      }

      this.list = this.responseTransfer(await DataRequest(this.param));
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style scoped></style>
