<template>
  <div class="orgPick-box">
    <van-field
      :size="size"
      readonly
      :value="showTitle"
      @focus="dialogVisible = true"
      placeholder="请选择"
    ></van-field>
    <!-- 弹窗 -->
    <van-dialog
      class="custom-dialog"
      append-to-body
      :close-on-click-modal="false"
      title="选择组织"
      :visible.sync="dialogVisible"
      width="1000px"
      @open="dialogOpen"
    >
      <div class="orgPicker">
        <OrgTree
          v-if="dialogVisible"
          :value="list"
          picker
          @pick="checkedNode = $event"
        ></OrgTree>
      </div>

      <div slot="footer">
        <van-button size="medium" type="primary" @click="submit"
          >确 定</van-button
        >
        <van-button size="medium" @click="dialogVisible = false"
          >取 消</van-button
        >
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { buildTree, deepcopy } from "@/core";
import { list } from "../api/org";

export default {
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      // 已选中机构id
      type: [Number, String],
      required: false,
    },
    adapter: {
      // 输入框显示适配
      type: Function,
      required: false,
      default(value, obj) {
        return obj.name || value;
      },
    },
    size: {
      type: String,
      required: false,
      default: "small",
    },
  },
  components: {
    OrgTree: () => require("../components/OrgTree"),
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      list: [],
      checkedNode: {},
      submitNode: {},
    };
  },
  computed: {
    showTitle() {
      return this.adapter(this.value, this.submitNode);
    },
  },
  methods: {
    dialogOpen() {
      this.checkedNode = {};
      this.submitNode = {};
    },
    fetchData: function () {
      this.loading = true;
      list()
        .then((res) => {
          this.loading = false;
          if (res.data) {
            this.list = buildTree(res.data);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    submit() {
      if (this.checkedNode && this.checkedNode[0]) {
        this.submitNode = deepcopy(this.checkedNode[0]);
        this.$emit("change", this.checkedNode[0].id);
      }

      this.dialogVisible = false;
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style scoped>
.orgPicker {
  height: 50vh;
  min-height: 350px;
}
.orgPicker ._side {
  width: 280px;
  border-right: 1px solid #f5f5f5;
  margin-right: 12px;
}
.orgPicker ._keyword {
  padding: 0 12px 12px;
  border-bottom: 1px solid #f5f5f5;
  margin-bottom: 12px;
}
.orgPicker ._action {
  text-align: center;
  margin-top: 20px;
}
</style>
