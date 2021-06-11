<template>
  <div class="workPage scrollbar">
    <div class="teamInfo">
      <div class="channelTitle">访: 采访以为优秀党员</div>
      <div class="p">
        采访身边的一位优秀党员，深入了解其感人事迹及入党初心，以访谈录的形式记录采访内容。
      </div>
    </div>
    <van-form ref="theForm" class="theForm" @submit="doSubmit()">
      
      <div class="teamInfo">
        <van-field
          v-model="editForm.date"
          required
          readonly
          clickable
          label="日期"
          input-align="right"
          @click="canEdit && (showDatePicker = true)"
          :rules="[
            {
              required: canEdit,
              message: '请选择日期',
            },
          ]"
        >
          <template #input>
            {{ editForm.date | date('day') }}
          </template>
          <template #button v-if="canEdit">
            <div class="_link">
              <van-icon name="arrow" />
            </div>
          </template>
        </van-field>
        <van-calendar v-model="showDatePicker" @confirm="handleDate" />

        <van-field
          required
          v-model.trim="editForm.name"
          :maxlength="100"
          label="采访对象姓名"
          input-align="right"
          placeholder="请输入"
          :readonly="!canEdit"
          :rules="[
            {
              required: canEdit,
              message: '请填写采访对象',
            },
          ]"
        >
        </van-field>
      </div>

      <div class="teamInfo">
        <van-field
          readonly
          label="附件"
        >
          <template #input>
            {{null}}
          </template>
        </van-field>
        <!-- 上传文件展示 -->
        <FileList 
          :list="editForm.filesExt"
          :canEdit='canEdit'
          @remove="handleRemoveFile"
        />
        
        <div style="text-align:center" v-if="canEdit">
            <FileUploader :multiple="false" @change="handleUpload" @status="uploading=$event">
              <van-button block icon="back-top" class="upBtn" :loading="uploading"
                >上传文件</van-button
              >
            </FileUploader>
          </div>
      </div>
    </van-form>
    <div class="actions" v-if="canEdit">
      <van-button
        block
        color="linear-gradient(to right, #fa533e, #fe3d53)"
        native-type="submit"
        size="lardge"
        @click="$refs.theForm.submit()"
      >
        提交
      </van-button>
    </div>
    <!-- 非app拦截 -->
    <appTip />
  </div>
</template>

<script>
import * as util from "@/main/assets/util";
import * as api from "../api/api";

export default {
  components: {
    FileUploader: () => import("@/main/components/FileUploader.vue"),
    FileList: () => import("../components/FileList.vue"),
    appTip: () => import("../components/appTip.vue"),
  },
  data() {
    return {
      loading: false,
      uploading: false,
      showDatePicker: false,
      teamInfo: {},
      editForm: {
        date: null,
        name: null,
        files: null,
        filesExt: null,
        teamId: null,
      },
    };
  },
  computed: {
    canEdit() {
      // 非app端不能编辑
      return String(this.$route.query.canEdit) === "true" && !!util.storage("is_webview");
    },
  },
  methods: {
    handleRemoveFile(index) {
      // 删除已上传文件
      this.editForm.filesExt.splice(index, 1);
      this.editForm.files = this.editForm.filesExt.map((e) => e.id);
    },
    handleDate($event) {
      this.editForm.date = $event.getTime();
      this.showDatePicker = false;
    },
    handleUpload(files) {
      if (Array.isArray(files) && files.length) {
        if (!Array.isArray(this.editForm.filesExt)) {
          this.editForm.filesExt = [];
        }
        this.editForm.filesExt.push(files[files.length - 1]);
        this.editForm.files = this.editForm.filesExt.map((e) => e.id);
      }
    },
    doSubmit() {
      if (this.loading) {
        return null;
      }
      this.loading = true;
      const actionApi = this.editForm.id ? api.editvisit : api.addvisit;
      actionApi(this.editForm)
        .then(() => {
          this.loading = false;
          this.$toast("操作成功");
          this.$router.go(-1);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    fetchData() {
      this.loading = true;
      api
        .getvisit({
          teamId: this.$route.query.id,
        })
        .then((res) => {
          this.loading = false;
          if (res.data.data) {
            this.editForm = res.data.data;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
  created: function () {
    if (this.$route.query.id) {
      this.editForm.teamId = this.$route.query.id;
      this.fetchData();
    } else {
      console.warn("页面参数缺少teamId");
    }
  },
};
</script>

<style scoped>
.workPage {
  padding: 1em;
  background: #f2f5f9;
}
.teamInfo {
  background: #fff;
  border-radius: 6px;
  padding: 1em;
  margin: 1em 0;
}
.channelTitle {
  position: relative;
  font-size: 1.3em;
  margin-bottom: 10px;
  padding: 8px 10px 8px 30px;
  border-bottom: 1px solid #dedede;
}
.channelTitle::after {
  content: "";
  position: absolute;
  left: 0;
  top: 10px;
  width: 20px;
  height: 20px;
  background: url(../../team/assets/img/work/work3.png) center center no-repeat
    #fe664e;
  background-size: 70% auto;
  border-radius: 4px;
}
.p {
  color: #9b9b9b;
}

.theForm .van-cell {
  padding: 16px;
}

.theForm ._link {
  color: #fe664e;
}
.upBtn {
  border: 0;
  color: #fe664e;
}
.actions {
  margin: 1em 0 0;
}

/* fileItem */
.fileItem{
  padding: .5em 0;
  border-bottom: 1px solid #dedede;
}
.fileItem ._album{
  width: 3em;
  height: 3em;
}
.fileItem ._title{
  line-height: 1.5em;
  height: 3em;
  color: #999;
  overflow: hidden;
}
.fileItem ._remove{
  color: #FE664E;
  cursor: pointer;
}

</style>
