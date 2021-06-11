<template>
  <div class="teamEditPage flex-col">
    <div class="contBox flex-1 scrollbar">
      <div class="cellItem van-hairline--bottom flex-row align-center">
        <div class="flex-1 _label">团队头像</div>
        <van-image
          style="border: 1px solid #dedede"
          round
          fit="cover"
          width="3em"
          height="3em"
          :src="teamInfo.avatar || defaultAvatar"
        />
        <div class="_link" @click="isCaptain && editAble && (showAvatarEditer = true)" v-if="isCaptain && editAble">
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="cellItem van-hairline--bottom flex-row align-center">
        <div class="flex-1 _label">团队名称</div>
        <div class="el">
          {{ teamInfo.name }}
        </div>
        <div class="_link" @click="handleEditName()" v-if="isCaptain && editAble">
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="cellItem van-hairline--bottom flex-row align-center">
        <div class="flex-1 _label">成立时间</div>
        <div>
          {{ teamInfo.createTime | date("day") }}
        </div>
      </div>
      <div class="cellItem van-hairline--bottom flex-row align-center">
        <div class="flex-1 _label">团队成员</div>
        <div>
          指导教师/辅导员：{{ teamInfo.teachers && teamInfo.teachers.length || 0 }}人
          成员：{{ teamInfo.members && teamInfo.members.length || 0 }}人
        </div>
        <div class="_link" @click="$router.push({name: '团队成员', query: {id: teamInfo.id}})">
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="cellItem van-hairline--bottom">
        <div class="flex-row align-center">
          <div class="flex-1 _label">邮寄地址</div>
          <div class="_link" @click="handleEditAddress()" v-if="isCaptain && editAble">
            修改
            <van-icon name="arrow" />
          </div>
        </div>
        <div style="margin-top: 0.5em">
          {{ teamInfo.mailAddress }}
        </div>
      </div>
    </div>
    <van-button
      v-if="isCaptain && editAble"
      block
      native-type="button"
      size="lardge"
      color="linear-gradient(to right, #fa533e, #fe3d53)"
      @click="save"
    >
      保存
    </van-button>
    <!-- 头像编辑 -->
    <AvatarEditer
      :visible="showAvatarEditer"
      :url="teamInfo.avatar"
      :disabled="!isCaptain"
      @change="handleAvatar"
      @close="showAvatarEditer = false"
    />
    <!-- 文字编辑 -->
    <InputEditer
      :visible="showInputEditer"
      :labelText="InputEditerLabel"
      :currentValue="InputEditerValue"
      :filedType="InputEditerType"
      @change="handleInput"
      @close="showInputEditer = false"
    />
  </div>
</template>

<script>
import * as util from "@/main/assets/util";
import { store } from "@/store";
import { hasCaptainPermission } from "../assets/util";
import * as team from "../api/team";

export default {
  components: {
    AvatarEditer: () => import("../components/AvatarEditer.vue"),
    InputEditer: () => import("../components/InputEditer.vue"),
  },
  data() {
    return {
      state: store.state,
      loading: false,
      showAvatarEditer: false,
      showInputEditer: false,
      queryParam: {
        id: null,
      },
      teamInfo: {},
      defaultAvatar: require("../assets/img/team.png"),
      InputEditerLabel: "",
      InputEditerValue: "",
      InputEditerType: "text",
    };
  },
  computed: {
    isCaptain() {
      // 当前用户是否为队长
      return hasCaptainPermission(this.state.user, this.teamInfo);
    },
    editAble() {
      return !!util.storage("is_webview")
    }
  },
  methods: {
    handleEditName() {
      this.InputEditerLabel = "团队名称";
      this.InputEditerValue = this.teamInfo.name;
      this.InputEditerType = "text";
      this.showInputEditer = true;
    },
    handleEditAddress() {
      this.InputEditerLabel = "邮寄地址";
      this.InputEditerValue = this.teamInfo.mailAddress;
      this.InputEditerType = "textarea";
      this.showInputEditer = true;
    },
    handleInput(value) {
      console.log(value);
      if (this.InputEditerLabel === "团队名称") {
        this.teamInfo.name = value;
      } else if (this.InputEditerLabel === "邮寄地址") {
        this.teamInfo.mailAddress = value;
      }
    },
    handleAvatar(url) {
      if (url && url.split) {
        this.teamInfo.avatar = url;
      }
    },
    save() {
      if(this.loading){
        return null;
      }
      this.loading = true;
      team
        .edit(this.teamInfo)
        .then(() => {
          this.loading = false;
          this.$toast("保存成功");
          this.fetchData();
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
  }
};
</script>

<style scoped>
.teamEditPage {
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
/* 表单 */
.cellItem {
  padding: 1em 0;
  color: #999;
}
.cellItem ._label {
  color: #333;
  min-width: 5em;
}
.cellItem ._link {
  color: #fe664e;
  padding: 0 0.2em;
}
.cellItem ._link .van-icon {
  font-size: 1.2em;
  vertical-align: middle;
}
</style>