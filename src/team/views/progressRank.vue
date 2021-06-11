<template>
  <div class="myTeamPage flex-col">
    <van-field
      class="searchInput"
      clearable
      :value="queryParam.schoolName || '学校：不限'"
      placeholder="学校名称搜索"
      clickable
      @click="showSchoolPicker = true"
      readonly
    >
      <template #button>
        <van-icon name="filter-o" />
      </template>
    </van-field>
    <van-list
      class="flex-1 scrollbar"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="fetchData"
    >
      <van-cell v-for="(teamInfo, index) in list" :key="index" class="teamInfo">
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
              {{ teamInfo.schoolName }}
            </div>
            <div class="team_name">
              {{ teamInfo.name }}
            </div>
          </div>
        </div>
        <div class="_info">
          <i class="_ico _ico4"></i>
          指导教师/辅导员：{{ teamInfo.teacherCount || 0}}人
        </div>
        <div>
          <i class="_ico _ico5"></i>
          成员：{{ teamInfo.memberCount || 0 }}人
        </div>
        <div class="_info flex-row align-center" v-if="teamInfo.rank">
          <div class="_ico _ico1"></div>
          <div class="flex-1">
            进度排名：全国第
            <span style="color: #5ac724">{{ teamInfo.rank }}</span> 名
          </div>
        </div>
      </van-cell>
    </van-list>
    <!-- 选择学校 （已报名的，不能添加）-->
    <SchoolPicker
      :visible="showSchoolPicker"
      dataType="2"
      @change="handlePickSchool"
      @close="showSchoolPicker = false"
    />
  </div>
</template>

<script>
import * as rank from "../api/rank";

export default {
  components: {
    SchoolPicker: (resolve) =>
      require(["@/main/components/SchoolPicker.vue"], resolve),
  },
  data() {
    return {
      loading: false,
      showSchoolPicker: false,
      queryParam: {
        p: 0,
        pageSize: 10,
        schoolId: null,
        schoolName: null,
      },
      totalCount: 0,
      totalPage: 0,
      list: [],
      finished: false,
      defaultAvatar: require("../assets/img/team.png"),
    };
  },
  methods: {
    handlePickSchool(item) {
      if(!item){
        item = {}
      }
      this.queryParam.schoolId = item.id || null;
      this.queryParam.schoolName = item.name || null;
      this.fetchData(true);
    },
    fetchData(reload) {
      if (reload) {
        this.queryParam.p = 1;
      } else {
        this.queryParam.p++;
      }
      this.loading = true;
      rank
        .progressRank(this.queryParam)
        .then((res) => {
          this.loading = false;
          const data = res.data.data;
          if (data && data.list) {
            if (reload) {
              this.list = data.list;
            } else {
              data.list.forEach((item) => {
                this.list.push(item);
              });
            }

            this.totalCount = data.totalCount;
            this.totalPage = data.totalPage;

            this.finished = !(this.totalCount > this.list.length);
          } else {
            console.warn("接口数据异常");
            this.finished = true;
          }
        })
        .catch(() => {
          this.loading = false;
          this.finished = true;
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
/* 图标 */
.teamInfo ._ico {
  display: inline-block;
  vertical-align: middle;
  width: 1.1em;
  height: 1.1em;
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
</style>