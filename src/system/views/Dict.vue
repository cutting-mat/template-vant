<template>
  <div v-loading="loading">
    <ToolBar>
      <van-button
        v-if="!picker"
        v-auth="dict.add"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="dialogVisible = true"
      >
        添加
      </van-button>
    </ToolBar>

    <!-- list -->
    <van-table :data="list" style="width: 100%" @row-click="handleRowClick">
      <van-table-column label="选择" width="50" align="center" v-if="picker">
        <template slot-scope="scope">
          <i
            class="el-icon-success"
            :class="{
              checkIcon: true,
              checked: scope.row.dictCode === currentChecked.dictCode,
            }"
          ></i>
        </template>
      </van-table-column>
      <van-table-column v-else type="index" width="50"> </van-table-column>
      <van-table-column
        prop="dictName"
        label="名称"
        align="center"
      ></van-table-column>
      <van-table-column
        prop="dictCode"
        label="CODE"
        align="center"
      ></van-table-column>
      <van-table-column
        prop="remark"
        label="备注"
        align="center"
      ></van-table-column>
      <van-table-column label="操作" width="300" align="center" v-if="!picker">
        <template slot-scope="scope">
          <van-button v-auth="dict.edit" size="mini" @click="edit(scope.row)"
            >编辑</van-button
          >
          <van-button
            v-auth="dict.itemEdit"
            size="mini"
            type="warning"
            plain
            @click="editItem(scope.row)"
            >数据维护</van-button
          >
          <van-button
            v-auth="dict.remove"
            size="mini"
            type="danger"
            plain
            @click="remove(scope.row)"
            >删除</van-button
          >
        </template>
      </van-table-column>
    </van-table>
    <!-- page -->
    <Pagination
      :page-size="queryParam.pageSize"
      :current-page="queryParam.p"
      :total-count="totalCount"
      :total-page="totalPage"
      @current-change="handleCurrentChange"
    ></Pagination>
    <!-- 弹窗 -->
    <van-dialog
      :close-on-click-modal="false"
      title="字典信息"
      :visible="dialogVisible"
      width="600px"
      @close="handleCloseDialog"
    >
      <van-form
        size="small"
        ref="editForm"
        :rules="rules"
        :model="editForm"
        label-width="80px"
      >
        <van-form-item label="名称" prop="dictName">
          <van-field v-model="editForm.dictName"></van-field>
        </van-form-item>
        <van-form-item label="CODE" prop="dictCode">
          <van-field
            v-model="editForm.dictCode"
            :readonly="!!editForm.id"
          ></van-field>
        </van-form-item>
        <van-form-item label="备注" prop="remark">
          <van-field v-model="editForm.remark"></van-field>
        </van-form-item>
      </van-form>
      <span slot="footer" class="dialog-footer">
        <van-button type="primary" @click="save">确 定</van-button>
        <van-button @click="dialogVisible = false">取 消</van-button>
      </span>
    </van-dialog>
    <!-- 数据维护 -->
    <DictEditer
      :visible="editerVisible"
      :dict-code="editForm.dictCode"
      @close="editerVisible = false"
    />
  </div>
</template>

<script>
import { deepcopy } from "@/core";
import * as dict from "../api/dict";

export default {
  props: {
    picker: {
      type: Boolean,
      required: false,
      default: false,
    },
    picked: {
      type: Object,
      required: false,
      default: function () {
        return {};
      },
    },
  },
  components: {
    DictEditer: () => import("../components/DictEditer"),
  },
  data() {
    return {
      dict,
      dialogVisible: false,
      editerVisible: false,
      loading: false,
      list: [],
      editForm: {
        dictName: "",
        dictCode: "",
        remark: "",
      },
      queryParam: {
        pageSize: 10,
        p: 1,
        dictName: "",
        testNull: null,
        testStr: "",
      },
      totalCount: 0,
      totalPage: 0,
      rules: {
        dictName: [
          { required: true, message: "请输入字典名称", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度 1 到 100 个字符",
            trigger: "blur",
          },
        ],
        dictCode: [
          { required: true, message: "请输入字典CODE", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度 1 到 100 个字符",
            trigger: "blur",
          },
        ],
      },
      currentChecked: {},
    };
  },
  watch: {
    picked: {
      handler: function (picked) {
        this.currentChecked = picked;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleRowClick(row) {
      if (this.picker) {
        this.currentChecked = row;
        this.$emit("change", row);
      }
    },
    editItem(data) {
      const editObj = Object.assign({}, data);
      this.editForm = editObj;
      this.editerVisible = true;
    },
    resetSearch() {
      this.queryParam.dictName = "";
      this.fetchData(true);
    },
    handleCurrentChange(currentPage) {
      this.queryParam.p = currentPage;
      this.fetchData();
    },
    edit: function (data) {
      const editObj = Object.assign({}, data);
      this.editForm = editObj;
      this.dialogVisible = true;
    },
    save() {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          let formData = deepcopy(this.editForm);
          this.handleCloseDialog();

          if (!formData.id) {
            dict.add(formData).then(() => {
              this.fetchData();
              this.$message({
                message: "添加成功",
                type: "success",
              });
            });
          } else {
            dict.edit(formData).then(() => {
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
    handleCloseDialog: function () {
      this.dialogVisible = false;
      this.editForm = {
        dictName: "",
        dictCode: "",
        remark: "",
      };
      this.$refs.editForm && this.$refs.editForm.resetFields();
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
          .remove({
            dictCode: item.dictCode,
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
    fetchData: function (reload) {
      if (reload) {
        this.queryParam.p = 1;
      }
      this.loading = true;
      dict.list(this.queryParam).then((res) => {
        this.loading = false;
        const data = res.data;
        if (data) {
          this.list = data.list;
          this.totalCount = data.totalCount;
          this.totalPage = data.totalPage;
        }
      });
    },
  },
  created: function () {
    this.fetchData();
  },
};
</script>

<style scoped>
.dict-box {
  padding: 20px 20px 0;
}
.checkIcon {
  color: #ccc;
}
.checkIcon.checked {
  color: #409eff;
}
</style>
