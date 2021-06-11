<template>
  <div class="workPage scrollbar">
    <div class="teamInfo">
      <div class="channelTitle">干：干一件有益于社区、学校、家乡 或某有特定困难群体的实事</div>
      <div class="p">
        调研社会、群体、家乡等急难愁盼的需求，力所能及办一件看得见、摸得着的实事，记录一份开展服务实事的档案
      </div>
    </div>
    <van-form ref="theForm" class="theForm" @submit="doSubmit()">
      <div class="teamInfo">
        <van-field
          v-model="editForm.gps"
          required
          readonly
          label="定位打卡"
          :rules="[
            {
              required: canEdit,
              message: '未获取到定位',
            },
          ]"
        >
          <template #input>
            {{null}}
          </template>
          <template #button>
            <div class="_link" @click="showMapPicker = true">
              {{ gpsLoading ? "定位中" : "定位成功" }}
              <van-icon name="arrow" />
            </div>
          </template>
        </van-field>
      </div>

      <div class="teamInfo">
        <van-field
          v-model="editForm.date"
          required
          readonly
          clickable
          label="日期"
          input-align="right"
          @click="showDatePicker = true"
          :rules="[
            {
              required: canEdit,
              message: '请选择日期',
            },
          ]"
        >
          <template #input>
            {{ editForm.date | date("day") }}
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
          label="事实名称"
          input-align="right"
          placeholder="请输入"
          :rules="[
            {
              required: canEdit,
              message: '请输入景点名称',
            },
          ]"
        />
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
        <div style="text-align: center">
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
    <!-- 地图选择弹窗 -->
    <BaiduMapPicker
      :visible="showMapPicker"
      :currentValue="currentGps"
      @refreshGps="getGps"
      @change="handleChange"
      @close="showMapPicker = false"
    />
    <!-- 非app拦截 -->
    <appTip />
  </div>
</template>

<script>
import * as util from "@/main/assets/util";
import * as api from "../api/api";
import { bridge } from "@/main/assets/flutter";

const packageInfo = require("../components/WidgetBMap/package.json");
import * as bmapsdk from "../components/WidgetBMap/bmap-sdk";

export default {
  components: {
    BaiduMapPicker: (resolve) =>
      require(["../components/BaiduMapPicker.vue"], resolve),
    FileUploader: () => import("@/main/components/FileUploader.vue"),
    FileList: () => import("../components/FileList.vue"),
    appTip: () => import("../components/appTip.vue"),
  },
  data() {
    return {
      loading: false,
      uploading: false,
      showDatePicker: false,
      showMapPicker: false,
      gpsLoading: false,
      teamInfo: {},
      editForm: {
        gps: null,
        date: null,
        name: null,
        files: null,
        filesExt: null,
        teamId: null,
      },
      currentGps: null,
    };
  },
  computed: {
    canEdit() {
      // 非app端不能编辑
      return String(this.$route.query.canEdit) === "true" && !!util.storage("is_webview");
    },
  },
  watch: {
    currentGps() {
      if (this.currentGps) {
        // 首次定位自动赋值
        if (!this.editForm.gps) {
          this.editForm.gps = this.currentGps;
          this.editForm.date = new Date().getTime();
          this.fetchPointFromGps(this.editForm.gps);
        }
      }
    },
  },
  methods: {
    handleRemoveFile(index) {
      // 删除已上传文件
      this.editForm.filesExt.splice(index, 1);
      this.editForm.files = this.editForm.filesExt.map((e) => e.id);
    },
    fetchPointFromGps(gpsStr) {
      // 通过高德gps自动获取附近第一个景点
      let gaodeGps = {
        lng: gpsStr.split(",")[0],
        lat: gpsStr.split(",")[1],
      };
      bmapsdk.init(packageInfo.AK, () => {
        if (gaodeGps && gaodeGps.lng && gaodeGps.lat) {
          // 坐标转换并定位
          bmapsdk.convertCoord([gaodeGps], (data) => {
            if (data.status === 0) {
              let baiduPoint = data.points[0];
              // 监听center执行搜索
              bmapsdk.search(baiduPoint, "景点", (results) => {
                let first = results.getPoi(0);
                if (first) {
                  this.editForm.name = first.title;
                }
              });
            }
          });
        }
      });
    },
    handleChange(item) {
      // 选择景点
      console.log(item);
      if (item && item.title) {
        this.editForm.name = item.title;
      }
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
      const actionApi = this.editForm.id ? api.editactive : api.addactive;
      // 更新gps
      if (this.currentGps) {
        this.editForm.gps = this.currentGps;
      }
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
        .getactive({
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
    getGps() {
      this.gpsLoading = true;
      bridge("getGps");
      if (!util.storage("is_webview")) {
        setTimeout(() => {
          const mark = parseInt(Math.random() * 100);
          window.sendGps(`121.44093417988238,37.46599055920108,${mark}`);
        }, 2000);
      }
    },
    handleGps(gps) {
      this.gpsLoading = false;
      if (gps && gps.split) {
        this.currentGps = gps;
      } else {
        return console.warn("gps信息异常");
      }
    },
  },
  created: function () {
    if (this.$route.query.id) {
      this.editForm.teamId = this.$route.query.id;
      this.fetchData();
    } else {
      console.warn("页面参数缺少teamId");
    }
    this.getGps();
  },
  mounted() {
    // 接收gps
    window.sendGps = (gps) => {
      this.handleGps(gps);
    };
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
  background: url(../../team/assets/img/work/work5.png) center center no-repeat
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
.theForm ._link .van-icon {
  vertical-align: middle;
}
.upBtn {
  border: 0;
  color: #fe664e;
}
.actions {
  margin: 1em 0 0;
}

</style>
