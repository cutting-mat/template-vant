<template>
  <div class="flex-col inviteTeamPage">
    <div class="flex-1">
      <div style="font-size: 1.2em">
        我正在参加“五个一”学党史大赛团队成员，邀请你加入我的团队
      </div>
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
        </div>
        <div class="_info">
          <i class="icon icon3"></i> 队长：{{ teamInfo.leaderName }}
        </div>
        <div class="_info">
          <i class="icon icon2"></i>
          成员：<span style="color: #fe907f">{{
            (teamInfo.members && teamInfo.members.length) || 0
          }}</span
          >/10
        </div>
        <div class="_info">
          <i class="icon"></i>
          指导教师/辅导员：{{
            (teamInfo.teachers && teamInfo.teachers.length) || 0
          }}/2
        </div>
      </div>
    </div>

    <div class="actions">
      <div class="_tips">学生上限10人，指导教师/辅导员上限2人</div>
      <div v-if="!isCaptain">
        <!-- 游客 -->
        <van-button
          v-if="!disabledJoin"
          block
          native-type="button"
          size="lardge"
          color="linear-gradient(to right, #fa533e, #fe3d53)"
          @click="handleTriggerInvite"
        >
          立即报名加入
        </van-button>
      </div>
      <div v-else>
        <!-- 队长 -->
        <van-button
          v-if="!disabledJoin"
          block
          native-type="button"
          size="lardge"
          color="linear-gradient(to right, #fa533e, #fe3d53)"
          @click="triggerShare"
        >
          分享邀请学生或教师加入团队
        </van-button>
        <van-button
          class="plainBtn"
          block
          native-type="button"
          plain
          type="danger"
          size="lardge"
          @click="
            $router.replace({
              name: '团队详情',
              query: { id: teamInfo.id },
            })
          "
        >
          查看我的“五个一”团队
        </van-button>
      </div>
    </div>
    <!-- APP分享 -->
    <van-share-sheet
      v-model="showShare"
      title="分享到"
      :options="options"
      @select="handleShare"
    />
    <!-- 微信分享弹层 -->
    <van-overlay
      :show="showWeixinTip"
      @click="showWeixinTip = false"
      class="WeixinShareTip"
    >
      <img src="../assets/img/arrow_top.png" class="_arrow" />
      <div class="_tip">请在微信中打开并分享</div>
    </van-overlay>
    <!-- 邀请二维码 -->
    <InviteDialog />
  </div>
</template>

<script>
import { store } from "@/store";
import * as util from "@/main/assets/util";
import { hasCaptainPermission } from "../assets/util";
import * as team from "../api/team";
import { bridge } from "@/main/assets/flutter";

export default {
  data() {
    return {
      state: store.state,
      loading: false,
      showShare: false,
      showWeixinTip: false,
      options: [
        { name: "微信", icon: "wechat" },
        { name: "朋友圈", icon: "wechat-moments" },
        { name: "二维码", icon: "qrcode" },
        { name: "复制链接", icon: "link" },
      ],
      teamInfo: {},
      defaultAvatar: require("../assets/img/team.png"),
      publicPath: process.env.BASE_URL
    };
  },
  computed: {
    isCaptain() {
      // 当前用户是否为队长
      return hasCaptainPermission(this.state.user, this.teamInfo);
    },
    disabledJoin() {
      return (
        this.teamInfo.teachers &&
        this.teamInfo.teachers.length === 2 &&
        this.teamInfo.members &&
        this.teamInfo.members.length === 10
      );
    },
  },
  methods: {
    handleTriggerInvite() {
      // 点击立即加入
      if (this.state.user && this.state.user.id) {
        // 已登陆
        this.addMember();
      } else {
        // 携带 schoolId 跳转登录
        this.$router.push({
          name: "登录",
          query: {
            schoolId: this.teamInfo.schoolId,
            schoolName: this.teamInfo.schoolName,
            from: this.$router.currentRoute.fullPath,
          },
        });
      }
    },
    createQr() {
      store.set(
        "showQrcode",
        `${window.location.origin}${this.publicPath}/#/team/invite?id=${this.teamInfo.id}`
      );
    },
    triggerShare() {
      if (util.storage("is_webview")) {
        // app环境，调用api
        this.showShare = true;
      } else {
        // 微信环境，显示浮层
        this.showWeixinTip = true;
      }
    },
    handleShare(options, index) {
      console.log(options, index);
      // app分享 调用api
      let shareImg = `${window.location.origin}${this.publicPath}/wx/logo.png`;
      let shareUrl = `${window.location.origin}/fiveoneh5/#/team/invite?id=${this.teamInfo.id}`;
      switch (options.name) {
        case "复制链接":
          bridge("setClipboard", {
            url: shareUrl,
            msg: `分享链接已复制`,
          });

          break;
        case "二维码":
          this.createQr();
          break;
        case "微信":
          bridge("wechatShare", {
            img: shareImg,
            title: '我正在参与思政课实践教学联盟“五个一”学党史大赛，和我一起组队吧',
            url: shareUrl,
            type: 2
          })
          break;
        case "朋友圈":
          bridge("wechatShare", {
            img: shareImg,
            title: '我正在参与思政课实践教学联盟“五个一”学党史大赛，和我一起组队吧',
            url: shareUrl,
            type: 1
          })
          break;
          default:
            console.warn(`app分享指令异常：${options.name}`)
      }
      this.showShare = false;
    },
    addMember() {
      // 立即加入
      this.loading = true;
      team
        .addMember({
          teamId: this.teamInfo.id,
          memberId: this.state.user.id,
        })
        .then((res) => {
          this.loading = false;
          if (res.data.code == 200) {
            this.$dialog
              .alert({
                title: "入队成功",
                message: "您已成功加入团队",
                confirmButtonText: "查看我的“五个一”团队",
                confirmButtonColor: "#fe3d53",
              })
              .then(() => {
                this.$router.push({
                  name: "团队详情",
                  query: {
                    id: this.teamInfo.id,
                  },
                });
              });
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
    fetchData() {
      this.loading = true;
      team
        .get({
          id: this.$route.query.id,
        })
        .then((res) => {
          this.loading = false;
          this.teamInfo = res.data.data;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
  created() {
    if (this.$route.query.id) {
      this.fetchData();
    } else {
      console.warn("页面参数缺少teamId");
    }
  },
};
</script>

<style scoped>
.inviteTeamPage {
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
.teamInfo ._info{
  margin-bottom: .2em;
}
.actions {
  padding: 0.5em 0;
}
.actions .van-button {
  margin-top: 0.5em;
}
.checked_icon {
  font-size: 1.5em;
  color: #fe3d53;
}
.actions ._tips {
  text-align: center;
  color: #aaaaaa;
  padding: 1em;
}

.plainBtn {
  color: #fe664e;
  border-color: #fe664e;
  background: #fcefef;
}

/* 微信分享 */
.WeixinShareTip ._arrow {
  max-width: 50%;
  float: right;
}
.WeixinShareTip ._tip {
  clear: right;
  text-align: center;
  color: #fff;
  font-size: 16px;
}
/* 图标 */
.icon{
  display: inline-block;
  width: 1.3em;
  height: 1.3em;
  background-image: url(../assets/img/leader.png);
  background-repeat: no-repeat;
  background-size: contain;
  vertical-align: -.2em;
}
.icon2{
  background-image: url(../assets/img/group.png);
}
.icon3{
  background-image: url(../assets/img/captain.png);
}
</style>