<template>
  <van-drawer
    :visible="visible"
    direction="rtl"
    size="900px"
    :withHeader="false"
    @opened="handleInit"
    @close="requireClose"
    v-loading.fullscreen="loading"
  >
    <div class="myform flex-col">
      <ToolBar title="字典数据维护" :back="requireClose">
        <van-button
          v-auth="dict.itemAdd"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="dialogVisible = true"
        >
          添加数据
        </van-button>
      </ToolBar>
      <div class="flex-1 scrollbar">
        <van-table
          :data="list"
          style="width: 100%; margin-bottom: 20px"
          row-key="id"
          border
          default-expand-all
        >
          <van-table-column prop="value" label="值"></van-table-column>
          <van-table-column
            prop="dictCode"
            label="CODE"
            align="center"
          ></van-table-column>
          <van-table-column label="操作" width="300" align="center">
            <template slot-scope="scope">
              <van-button
                v-auth="dict.itemEdit"
                size="mini"
                @click="edit(scope.row)"
                >编辑</van-button
              >
              <van-button
                v-auth="dict.itemEdit"
                size="mini"
                @click="append(scope.row)"
                >添加下级</van-button
              >
              <van-button
                v-auth="dict.itemRemove"
                size="mini"
                type="danger"
                plain
                @click="remove(scope.row)"
                >删除</van-button
              >
            </template>
          </van-table-column>
        </van-table>
      </div>
      <!-- 数据编辑 -->
      <van-dialog
        :close-on-click-modal="false"
        title="字典数据"
        :visible="dialogVisible"
        width="600px"
        append-to-body
        @close="handleCloseDialog"
      >
        <van-form
          size="small"
          ref="editForm"
          :rules="rules"
          :model="editForm"
          label-width="80px"
        >
          <van-form-item label="值" prop="value">
            <van-field v-model="editForm.value"></van-field>
          </van-form-item>
          <van-form-item label="CODE" prop="dictCode">
            <van-field v-model="editForm.dictCode"></van-field>
          </van-form-item>
        </van-form>
        <span slot="footer" class="dialog-footer">
          <van-button type="primary" @click="save">确 定</van-button>
          <van-button @click="dialogVisible = false">取 消</van-button>
        </span>
      </van-dialog>
    </div>
  </van-drawer>
</template>

<script>
import { deepcopy, buildTree } from "@/core";
import * as dict from "../api/dict";

export default {
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false,
    },
    dictCode: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      dict,
      loading: true,
      dialogVisible: false,
      queryParam: {
        dictCode: "",
      },
      list: [],
      editForm: {
        pid: "",
        value: "",
        dictCode: "",
      },
      rules: {
        value: [
          { required: true, message: "请输入数据值", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度 1 到 100 个字符",
            trigger: "blur",
          },
        ],
        dictCode: [
          {
            min: 1,
            max: 100,
            message: "长度 1 到 100 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    dictCode: function () {
      this.$set(this.queryParam, "dictCode", this.dictCode);
    },
  },
  methods: {
    append(data) {
      this.$set(this.editForm, "pid", data.id);
      this.dialogVisible = true;
    },
    edit(data) {
      const editObj = Object.assign({}, data);
      this.editForm = editObj;
      this.dialogVisible = true;
    },
    save() {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          let formData = deepcopy(this.editForm);
          formData.dictCode = this.queryParam.dictCode;
          this.handleCloseDialog();
          this.loading = true;

          if (!formData.id) {
            dict.itemAdd(formData).then(() => {
              this.fetchData();
              this.$message({
                message: "添加成功",
                type: "success",
              });
            });
          } else {
            dict.itemEdit(formData).then(() => {
              this.fetchData();
              this.$message({
                message: "编辑成功",
                type: "success",
              });
            });
          }
        }
      });
    },
    remove(item) {
      if (!item) {
        return null;
      }
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        dict
          .itemRemove({
            id: item.id,
          })
          .then(() => {
            this.fetchData();
            this.$message({
              message: "删除成功",
              type: "success",
            });
          });
      });
    },
    handleCloseDialog: function () {
      this.editForm = {
        pid: "",
        value: "",
        dictCode: "",
      };
      this.dialogVisible = false;
    },
    requireClose() {
      this.list = [];
      this.$emit("close");
    },
    fetchData() {
      this.loading = true;
      dict.itemList(this.queryParam).then((res) => {
        this.loading = false;
        this.list = buildTree(res.data);
      });
    },
    handleInit() {
      if (this.queryParam.dictCode) {
        this.fetchData();
      }
    },
  },
  created() {},
};
</script>

<style scoped>
.myform {
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}
</style>
