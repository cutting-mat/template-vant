<template>
  <div class="flex-col createTeamPage">
    <van-form ref="theForm" @submit="doSubmit" class="flex-1 theForm">
      <div class="van-hairline--bottom">
        <van-field
          required
          v-model.trim="queryParam.name"
          label="团队名称"
          :rules="[{ required: true, message: '请填写团队名称' }]"
        />
      </div>
    </van-form>

    <div class="actions">
      <div class="_tips">学生上限为10人</div>
      <van-button
        block
        native-type="button"
        size="lardge"
        color="linear-gradient(to right, #fa533e, #fe3d53)"
        @click="$refs.theForm.submit()"
      >
        保存并分享，邀请学生加入团队
      </van-button>
    </div>
  </div>
</template>

<script>
import * as team from "../api/team";

export default {
  data() {
    return {
      loading: false,
      queryParam: {
        name: "",
      },
      options: [
        { name: "微信", icon: "wechat" },
        { name: "朋友圈", icon: "weibo" },
      ],
      teamInfo: null,
    };
  },
  methods: {
    doSubmit() {
      if (this.loading) {
        return null;
      }
      this.loading = true;
      team
        .add(this.queryParam)
        .then((res) => {
          this.loading = false;
          if (res.data.code === 200) {
            this.teamInfo = res.data.data;
            if (this.teamInfo && this.teamInfo.id) {
              this.$router.push({
                name: "团队邀请",
                query: {
                  id: this.teamInfo.id,
                },
              });
            }
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
};
</script>

<style scoped>
.createTeamPage {
  padding: 1em;
}
.createTeamPage .theForm {
  padding: 1em;
  background: #fff;
  border-radius: 6px;
}

.actions {
  padding: 1em;
}
.actions ._tips {
  text-align: center;
  color: #aaaaaa;
  padding: 1em;
}
</style>