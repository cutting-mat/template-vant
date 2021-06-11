<template>
  <div class="flex-col">
    <div class="teamMemberPage flex-1 scrollbar">
      <div style="font-size: 1.2em">
        指导教师/辅导员（{{
          (teamInfo.teachers && teamInfo.teachers.length) || 0
        }}/2 人）
      </div>
      <div class="contBox">
        <div v-if="teamInfo.teachers && teamInfo.teachers.length">
          <div
            v-for="(item, index) in teamInfo.teachers"
            :key="'t' + index"
            class="peopleItem van-hairline--bottom flex-row align-center"
          >
            <van-image
              class="_avatar"
              round
              fit="cover"
              width="3em"
              height="3em"
              :src="(item.avatarExt && item.avatarExt.url) || defaultAvatar"
            />
            <div class="flex-1">
              <div class="_name">
                {{ item.accountName }}
                <div
                  class="_teacher_type"
                  :class="['_teacher_type_' + item.teacherType]"
                >
                  {{ item.teacherType == 1 ? "教师" : "辅导员" }}
                </div>
                <div class="_captain" v-if="isCaptain(item)"></div>
              </div>
              {{ item.contactNumber }}
            </div>
            <div
              class="_link"
              @click="handleRemoveMember(item)"
              v-if="hasCaptainPermission && !isSelf(item) && !isCaptain(item)"
            >
              <van-icon name="clear" />
            </div>
          </div>
        </div>
        <van-empty v-else description="请分享邀请教师加入" />
      </div>
      <div style="font-size: 1.2em">
        学生（{{ (teamInfo.members && teamInfo.members.length) || 0 }}/10 人）
      </div>
      <div class="contBox">
        <div v-if="teamInfo.members && teamInfo.members.length">
          <div
            v-for="(item, index) in teamInfo.members"
            :key="'t' + index"
            class="peopleItem van-hairline--bottom flex-row align-center"
          >
            <van-image
              class="_avatar"
              round
              fit="cover"
              width="3em"
              height="3em"
              :src="(item.avatarExt && item.avatarExt.url) || defaultAvatar"
            />
            <div class="flex-1">
              <div class="_name">
                {{ item.accountName }}
                <div class="_captain" v-if="isCaptain(item)"></div>
              </div>
              {{ item.contactNumber }}
            </div>
            <van-button
              v-if="isCaptain() && !isSelf(item) && !isCaptain(item)"
              plain
              hairline
              round
              size="small"
              type="danger"
              @click="setCap(item)"
              >委任队长</van-button
            >
            <div
              class="_link"
              @click="handleRemoveMember(item)"
              v-if="hasCaptainPermission && !isSelf(item) && !isCaptain(item)"
            >
              <van-icon name="clear" />
            </div>
          </div>
        </div>
        <van-empty v-else description="请分享邀请学生加入" />
      </div>
    </div>
    <div
      class="footer flex-row align-center"
      v-if="editAble && hasCaptainPermission && !disabledJoin"
    >
      <div class="flex-1 _title">分享邀请学生/教师加入团队</div>
      <van-button
        v-if="hasCaptainPermission"
        native-type="button"
        color="linear-gradient(to right, #fa533e, #fe3d53)"
        @click="$router.push({ name: '团队邀请', query: { id: teamInfo.id } })"
      >
        分享
      </van-button>
    </div>
  </div>
</template>

<script>
import * as util from "@/main/assets/util";
import { store } from "@/store";
import { hasCaptainPermission, isCaptain } from "../assets/util";
import * as team from "../api/team";

export default {
  data() {
    return {
      state: store.state,
      loading: false,
      queryParam: {
        id: null,
      },
      teamInfo: {},
      defaultAvatar: require("../assets/img/default.png"),
    };
  },
  computed: {
    hasCaptainPermission() {
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
    editAble() {
      return !!util.storage("is_webview")
    }
  },
  methods: {
    isCaptain(user, teamInfo) {
      // 是否是队长
      return isCaptain(user || this.state.user, teamInfo || this.teamInfo);
    },
    isSelf(user) {
      // 判断用户是自己
      return this.state.user.id && this.state.user.id === user.memberId;
    },
    handleRemoveMember(item) {
      // 移除成员
      this.loading = true;
      team
        .editMember({
          teamId: this.teamInfo.id,
          id: item.id,
          memberId: item.memberId,
          state: 3,
        })
        .then(() => {
          this.loading = false;
          this.$toast("操作成功");
          this.fetchData();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    setCap(item) {
      // 委任队长
      this.loading = true;
      team
        .setLeader({
          teamId: this.teamInfo.id,
          memberId: item.memberId,
        })
        .then((res) => {
          this.loading = false;
          if (res.data.code === 200) {
            this.$toast("操作成功");
            this.fetchData();
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
        .get(this.queryParam)
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
      this.queryParam.id = this.$route.query.id;
      this.fetchData();
    } else {
      console.warn("页面参数缺少teamId");
    }
  },
};
</script>

<style scoped>
.teamMemberPage {
  padding: 1em;
  background: #f2f5f9;
  font-size: 1.1em;
}
.contBox {
  background: #fff;
  border-radius: 6px;
  padding: 1em;
  margin: 1em 0;
}
._link {
  padding-left: 0.5em;
  color: #fe6750;
}
._link .van-icon {
  vertical-align: middle;
}
/* 成员样式 */
.peopleItem {
  color: #999;
  padding: 0.5em 0;
}
.peopleItem:last-child::after {
  display: none;
}
.peopleItem ._avatar {
  margin-right: 0.5em;
}
.peopleItem ._name {
  font-size: 1.1em;
  color: #333;
}
.peopleItem ._captain {
  display: inline-block;
  width: 1em;
  height: 1em;
  background: url(../assets/img/captain.png) center center no-repeat;
  background-size: contain;
}
.peopleItem ._teacher_type {
  display: inline-block;
  vertical-align: middle;
  line-height: 1.7em;
  height: 1.7em;
  padding: 0 1em;
  border-radius: 1em;
  color: #fff;
  background: linear-gradient(135deg, #ff3d54, #fa543e);
  font-size: 12px;
  transform: scale(0.9);
}
._link {
  padding-left: 0.5em;
  color: #fe6750;
}
.peopleItem ._link .van-icon {
  font-size: 1.5em;
}
/* 底部 */
.footer {
  background: #fff;
  padding: 0.5em 1em;
}
.footer .van-button {
  padding: 0 2em;
}
.footer ._title {
  font-size: 1.2em;
}

.placeholder {
  padding: 1em;
  text-align: center;
  color: #ccc;
}
</style>