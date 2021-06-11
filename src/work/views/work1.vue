<template>
  <div class="workPage scrollbar">
    <div class="teamInfo">
      <div class="channelTitle">学：研读一篇经典文献</div>
      <div class="p">
        阅读一篇马克思主义经典文献，认真学习党史有关书目，研究学习经典著作蕴含的历史价值与时代价值，完成一份研读经典文献的读书笔记。
      </div>
    </div>
    <van-form ref="theForm" class="theForm" @submit="doSubmit()">
      <div class="teamInfo">
        <van-field
          v-model="editForm.bookName"
          required
          readonly
          clickable
          label="书籍或文献"
          input-align="right"
          @click="canEdit && (showBookPicker = true)"
          :rules="[
            {
              validator: validateBook,
              message: '请选择书籍',
            },
          ]"
        >
          <template #button v-if="canEdit">
            <div class="_link">
              <van-icon name="arrow" />
            </div>
          </template>
        </van-field>
        <!-- 选择书籍-->
        <BookPicker
          :visible="showBookPicker"
          @change="handlePickBook"
          @close="showBookPicker = false"
        />

        <van-field
          required
          :value="noteInputType === 1 ? '录入' : '上传'"
          readonly
          clickable
          label-width="9em"
          label="录入或上传读书笔记"
          input-align="right"
          :rules="[
            {
              required: canEdit,
              validator: validateNote,
              message: '请录入/上传读书笔记',
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
        <!-- 选择类型 -->
        <van-popup v-model.trim="showTypePicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="[
              { value: 1, name: '录入' },
              { value: 2, name: '上传' },
            ]"
            value-key="name"
            @confirm="handleTypeChange"
            @cancel="showTypePicker = false"
          />
        </van-popup>
      </div>
      <div class="teamInfo">
        <!-- 输入 -->
        <van-field
          v-if="noteInputType === 1"
          required
          v-model.trim="editForm.note"
          type="textarea"
          autosize
          :maxlength="5000"
          show-word-limit
          label="录入"
          placeholder="在此输入读书笔记"
          :readonly="!canEdit"
          
        />
        <div v-else>
          <div v-if="editForm.fileExt" class="flex-row align-center">
            <div class="flex-1">
              {{ editForm.fileExt.name }}
            </div>
            <van-icon v-if="canEdit"
              name="cross"
              @click="
                editForm.fileExt = null;
                editForm.file = null;
              "
            />
          </div>
          <div v-else style="text-align:center">
            <FileUploader :multiple="false" accept=".docx,.doc,.pdf" @change="handleUpload" @status="uploading=$event">
              <van-button block icon="back-top" class="upBtn" :loading="uploading"
                >上传文件</van-button
              >
            </FileUploader>
          </div>
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
  </div>
</template>

<script>
//import * as util from "@/main/assets/util";
import * as api from "../api/api";

export default {
  components: {
    BookPicker: (resolve) => require(["../components/BookPicker.vue"], resolve),
    FileUploader: () => import("@/main/components/FileUploader.vue"),
  },
  data() {
    return {
      loading: false,
      uploading: false,
      showBookPicker: false,
      showTypePicker: false,
      teamInfo: {},
      editForm: {
        bookId: null,
        bookName: null,
        cover: null,
        note: null,
        file: null,
        fileExt: null,
        teamId: null,
      },
      noteInputType: 1,
    };
  },
  computed: {
    canEdit() {
      return String(this.$route.query.canEdit)==='true'
    }
  },
  watch: {
    noteInputType(noteInputType) {
      if (noteInputType == 1) {
        // 录入
        this.editForm.file = null;
      } else {
        // 上传
        this.editForm.note = null;
      }
    },
  },
  methods: {
    handleUpload(files) {
      if (Array.isArray(files) && files.length) {
        this.editForm.file = files[0].id;
        this.editForm.fileExt = files[0];
      }
    },
    handlePickBook(item) {
      // 选择书籍
      if (!item) {
        item = {};
      }
      this.editForm.bookId = item.id || null;
      this.editForm.bookName = item.name || null;
      this.editForm.cover = item.cover || null;
    },
    validateBook(value) {
      // 验证书籍
      if(!this.canEdit){
        return true
      }
      if (value) {
        return true;
      } else {
        return false;
      }
    },
    validateNote() {
      if(!this.canEdit){
        return true
      }
      // 验证笔记输入
      if (this.noteInputType === 1) {
        return !!this.editForm.note;
      } else if (this.noteInputType === 2) {
        return !!this.editForm.file;
      } else {
        return false;
      }
    },
    handleTypeChange(item) {
      // 切换录入上传类型
      this.noteInputType = item.value;
      this.showTypePicker = false;
    },
    doSubmit() {
      if (this.loading) {
        return null;
      }
      this.loading = true;
      const actionApi = this.editForm.id ? api.editlearn : api.addlearn;
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
        .getlearn({
          teamId: this.$route.query.id,
        })
        .then((res) => {
          this.loading = false;
          if (res.data.data) {
            this.editForm = res.data.data;
            //
            if (this.editForm.file) {
              this.noteInputType = 2;
            }
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
.channelTitle::after{
  content: "";
  position: absolute;
  left: 0;
  top: 10px;
  width: 20px;
  height: 20px;
  background:url(../../team/assets/img/work/work2.png) center center no-repeat #FE664E;
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
.upBtn{
  border: 0;
  color: #fe664e;
}
.actions {
  margin: 1em 0 0;
}

</style>
