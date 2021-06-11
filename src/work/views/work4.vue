<template>
  <div class="workPage scrollbar">
    <div class="teamInfo">
      <div class="channelTitle">创: 创作一部原创红色文化作品</div>
      <div class="p">
        依据党的历史事件、人物、故事及学习党史过程中的心得体会等，创作一部原创作品，可以但不限于微电影、动漫、书法、绘画、剧本、诗歌、散文、小论文等。
      </div>
    </div>
    <van-form ref="theForm" class="theForm" @submit="doSubmit()">
      
      <div class="teamInfo">
        <van-field
          required
          :value="editForm.cat"
          readonly
          clickable
          label="作品类别"
          input-align="right"
          :rules="[
            {
              required: canEdit,
              message: '请选择作品类别',
            },
          ]"
          @click="canEdit && (showTypePicker = true)"
        >
          <template #button v-if="canEdit">
            <div class="_link">
              <van-icon name="arrow" />
            </div>
          </template>
        </van-field>
        <van-popup v-model.trim="showTypePicker" position="bottom">
          <van-cascader
            v-model="editForm.cat"
            title="请选择作品类别"
            :options="createCats"
            :field-names="{text: 'label',value: 'label',}"
            @close="showTypePicker = false"
            @finish="showTypePicker = false"
          />
        </van-popup>

        <van-field
          required
          v-model.trim="editForm.name"
          :maxlength="100"
          label="作品名称"
          input-align="right"
          placeholder="请输入"
          :readonly="!canEdit"
          :rules="[
            {
              required: canEdit,
              message: '请输入作品名称',
            },
          ]"
        >
        </van-field>
      </div>

      <div class="teamInfo">
        <div class="blockTitle">
          作品描述
        </div>
        <van-field
          v-model.trim="editForm.remark"
          :maxlength="1000"
          label=""
          type="textarea"
          :row="6"
          placeholder="如果描述内容较多可通过上传附件上传作品描述文档"
          :readonly="!canEdit"
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
import createCats from "../assets/cat";

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
      showTypePicker: false,
      teamInfo: {},
      editForm: {
        cat: null,
        name: null,
        remark: null,
        files: null,
        filesExt: null,
        teamId: null,
      },
      createCats
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
    handleTypePick(value) {
      this.editForm.cat=value;
      this.showTypePicker = false
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
      const actionApi = this.editForm.id ? api.editcreate : api.addcreate;
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
        .getcreate({
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
  background: url(../../team/assets/img/work/work4.png) center center no-repeat
    #fe664e;
  background-size: 70% auto;
  border-radius: 4px;
}
.blockTitle{
  font-size: 1.3em;
  padding: 0 10px ;
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
