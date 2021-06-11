<template>
  <div class="myTeamPage">
    <div v-for="(teamInfo, index) in list" :key="index" class="teamInfo">
      <div class="flex-row align-center teamInfoBlock">
        <van-image
          class="school_icon"
          style="border: 1px solid #dedede"
          round
          fit="cover"
          :src="teamInfo.avatar || defaultAvatar"
        />
        <div class="flex-1">
          <div class="school_name">
            {{teamInfo.schoolName}}
          </div>
          <div class="team_name">
            {{teamInfo.name}}
          </div>
        </div>
        <div
          class="_link"
          @click="$router.push({ name: '团队详情', query: { id: teamInfo.id } })"
        >
          团队详情<van-icon name="arrow" />
        </div>
      </div>
      <div class="_info">指导教师/辅导员：{{ teamInfo.teachers && teamInfo.teachers.length || 0 }}人</div>
      <div>成员：{{ teamInfo.members && teamInfo.members.length || 0 }}人</div>
    </div>
  </div>
</template>

<script>
import * as team from "../api/team";

export default {
  data() {
    return {
      loading: false,
      list: [],
      defaultAvatar: require("../assets/img/team.png"),
    };
  },
  methods: {
    fetchData() {
      this.loading = true;
      team
        .my()
        .then((res) => {
          this.loading = false;
          this.list = res.data.data;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
  created() {
    if (Array.isArray(this.$route.params.list)) {
      this.list = this.$route.params.list;
    } else {
      this.fetchData();
    }
  },
};
</script>

<style scoped>
.myTeamPage {
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
.teamInfo ._link {
  color: #fe6750;
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