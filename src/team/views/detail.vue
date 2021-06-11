<template>
  <div class="validTeamPage">
    <div class="teamInfo">
      <div class="flex-row align-center teamInfoBlock">
        <van-image
          class="school_icon"
          style="border: 1px solid #dedede"
          round
          fit="cover"
          :src="teamInfo.avatar || defaultAvatar"
        />
        <div class="flex-1">
          <div class="school_name">{{ teamInfo.schoolName }}</div>
          <div class="team_name">{{ teamInfo.name }}</div>
        </div>
        <div
          class="_link"
          @click="
            $router.push({ name: '团队信息', query: { id: teamInfo.id } })
          "
        >
          团队信息<van-icon name="arrow" />
        </div>
      </div>
      <div class="_info">
        <i class="_ico _ico4"></i>
        指导教师/辅导员：{{
          (teamInfo.teachers && teamInfo.teachers.length) || 0
        }}人
      </div>
      <div class="_info">
        <i class="_ico _ico5"></i>
        成员：{{ (teamInfo.members && teamInfo.members.length) || 0 }}人
      </div>
      <div class="_info flex-row align-center" v-if="teamInfo.progressRank">
        <div class="_ico _ico1"></div>
        <div class="flex-1">
          进度排名：全国第
          <span style="color: #5ac724">{{ teamInfo.progressRank }}</span> 名
        </div>
        <div class="_link" @click="$router.push({ name: '进度排名' })">
          查看更多<van-icon name="arrow" />
        </div>
      </div>
      <div class="_info flex-row align-center" v-if="teamInfo.teamVotesNumber">
        <div class="_ico _ico2"></div>
        <div class="flex-1">
          团队票数：<span style="color: #267bf0; margin-right: 4em">{{
            teamInfo.teamVotesNumber
          }}</span>
          全国第
          <span style="color: #5ac724">{{ teamInfo.teamVotesRank }}</span> 名
        </div>
        <div class="_link">查看更多<van-icon name="arrow" /></div>
      </div>
      <div class="_info flex-row align-center" v-if="teamInfo.workVotesNumber">
        <div class="_ico _ico3"></div>
        <div class="flex-1">
          作品票数：<span style="color: #e3401b; margin-right: 4em">{{
            teamInfo.workVotesNumber
          }}</span>
          全国第
          <span style="color: #5ac724">{{ teamInfo.workVotesRank }}</span> 名
        </div>
        <div class="_link">查看更多<van-icon name="arrow" /></div>
      </div>
    </div>
    <div class="teamInfo">
      <div class="flex-row align-center">
        <div class="_title flex-1">当前阶段</div>
        <div class="_link" @click="$router.push('/')">
          活动信息<van-icon name="arrow" />
        </div>
      </div>
      <div class="_subTitle">
        {{ projectStateText }}
      </div>
      <div class="workStateList van-hairline--top-bottom">
        <div
          v-for="(item, index) in workStateList"
          :key="index"
          class="_item"
          :class="{
            done: isDone(index),
            editable: canEdit(index),
            cur: isCurrent(index),
            'van-hairline--top': index > 0,
          }"
          @click="handleWorkClick(index)"
        >
          <div class="_mark">{{ item.slice(0, 1) }}</div>
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as util from "@/main/assets/util";
import { store } from "@/store";
import {
  projectStateList,
  workStateList,
  hasCaptainPermission,
} from "../assets/util";
import * as team from "../api/team";
// 五个一
const workChannelNames = ["学", "走", "访", "创", "干"];

export default {
  data() {
    return {
      state: store.state,
      loading: false,
      queryParam: {
        id: null,
      },
      teamInfo: {},
      defaultAvatar: require("../assets/img/team.png"),
      projectStateList, // 项目阶段
      workStateList, // 五个一工作阶段
    };
  },
  computed: {
    isCaptain() {
      return hasCaptainPermission(this.state.user, this.teamInfo);
    },
    projectState() {
      return this.teamInfo.projectState || 1;
    },
    workState() {
      return this.teamInfo.workState || 1;
    },
    projectStateText() {
      return this.projectStateList[this.projectState - 1];
    },
    workStateText() {
      return this.workStateList[this.workState - 1];
    },
  },
  methods: {
    isDone(index) {
      return this.teamInfo.workState - 1 > index;
    },
    canEdit(index) {
      let projectStateVilible = false;
      if (index === 0) {
        projectStateVilible = this.teamInfo.projectState < 3;
      } else {
        projectStateVilible = this.teamInfo.projectState === 2;
      }
      return projectStateVilible;
    },
    isCurrent(index) {
      return this.teamInfo.workState - 1 === index;
    },
    handleWorkClick(index) {
      // 非app端拦截后四步
      if (index > 0 && !util.storage("is_webview")) {
        return this.$dialog
          .alert({
            title: "请前往App录入",
            message: `走、访、创、干等四步的内容
请前往App提交`,
            showCancelButton: true,
            confirmButtonText: "前往下载APP",
            confirmButtonColor: "#0265ed",
            cancelButtonText: "好的",
          })
          .then(() => {
            // 跳转官网下载页
            window.open("/a/downloadapp/index.html");
          })
          .catch(() => {})
      }
      // 点击五个一
      if (this.isDone(index) || this.isCurrent(index)) {
        this.$router.push({
          name: `五个一-${workChannelNames[index]}`,
          query: {
            id: this.teamInfo.id,
            canEdit: this.canEdit(index),
          },
        });
      }
    },
    fetchData() {
      this.loading = true;
      team
        .get(this.queryParam)
        .then((res) => {
          if (res.data.code === 200) {
            this.loading = false;
            this.teamInfo = res.data.data;
          } else {
            this.$notify({
              message: res.data.msg || "操作失败",
              type: "warning",
            });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
  created() {
    if (this.$route.query.id) {
      this.queryParam.id = this.$route.query.id;
      this.fetchData();
    } else {
      console.warn("页面参数缺少teamId");
    }
  },
};
</script>

<style scoped>
.validTeamPage {
  padding: 1em;
  background: #f2f5f9;
}
.teamInfo {
  background: #fff;
  border-radius: 6px;
  padding: 1em;
  margin: 1em 0;
}
.teamInfoBlock {
  border-bottom: 1px dashed #e7e7e7;
  padding-bottom: 1em;
  margin-bottom: 1em;
}
.teamInfo ._info {
  margin-top: 0.5em;
}
.teamInfo .school_icon {
  width: 3.5em;
  height: 3.5em;
  background: url(../assets/img/team.png) center no-repeat;
  background-size: contain;
  margin-right: 1em;
}
.teamInfo .school_name {
  font-size: 0.9em;
  color: #9b9b9b;
}
.teamInfo .team_name {
  font-size: 1.2em;
  color: #333;
}
.teamInfo ._link {
  color: #fe6750;
}
/* 图标 */
.teamInfo ._ico {
  display: inline-block;
  vertical-align: middle;
  width: 1.2em;
  height: 1.2em;
  background-size: contain !important;
  margin-right: 2px;
}
.teamInfo ._ico1 {
  background: url(../assets/img/ico1.png) center no-repeat;
}
.teamInfo ._ico2 {
  background: url(../assets/img/ico2.png) center no-repeat;
}
.teamInfo ._ico3 {
  background: url(../assets/img/ico3.png) center no-repeat;
}
.teamInfo ._ico4 {
  background-image: url(../assets/img/leader.png);
}
.teamInfo ._ico5 {
  background-image: url(../assets/img/group.png);
}
.teamInfo ._ico6 {
  background-image: url(../assets/img/captain.png);
}
/* 标题 */
.teamInfo ._title {
  font-size: 1.5em;
  color: #333;
}
.teamInfo ._subTitle {
  font-size: 1.2em;
  color: #333;
}
/* 五个一工作列表 */
.workStateList {
  padding-left: 25px;
  margin-top: 1em;
}
.workStateList ._item {
  position: relative;
  padding: 1em 1em 1em 30px;
  border-bottom: 1px solid #f5f5f5;
}
.workStateList ._item:last-child {
  border: 0;
}
.workStateList ._mark {
  position: absolute;
  left: -22px;
  top: 1em;
  width: 1.5em;
  height: 1.5em;
  line-height: 1.5em;
  text-align: center;
  font-size: 12px;
  background: #d8d8d8;
  color: #fff;
  border-radius: 50%;
  overflow: hidden;
  z-index: 2;
}

.workStateList ._item::before {
  content: "";
  width: 0;
  height: 3em;
  position: absolute;
  left: -14px;
  top: 2em;
  z-index: 1;
  border-left: 1px dashed #d8d8d8;
}
.workStateList ._item::after {
  content: "";
  position: absolute;
  left: 5px;
  top: 1em;
  width: 20px;
  height: 20px;
  background: url(../assets/img/work/work1.png) center center no-repeat;
  background-size: 70% auto;
  background-color: #c4c4c4;
  border-radius: 4px;
  transform: scale(1);
}
.workStateList ._item:nth-child(2):after {
  background-image: url(../assets/img/work/work2.png);
}
.workStateList ._item:nth-child(3):after {
  background-image: url(../assets/img/work/work3.png);
}
.workStateList ._item:nth-child(4):after {
  background-image: url(../assets/img/work/work4.png);
}
.workStateList ._item:nth-child(5):after {
  background-image: url(../assets/img/work/work5.png);
}

.workStateList ._item:last-child::before {
  display: none;
}
.workStateList ._item.cur {
  color: #fe664e;
}
.workStateList ._item.done {
  color: #fe664e;
}
.workStateList ._item.done ._mark {
  background: #fe664e;
  color: #fff;
}
.workStateList ._item.done::before {
  border-left: 1px solid #fe664e;
}
.workStateList ._item.done::after {
  background-color: #fe664e;
}
</style>