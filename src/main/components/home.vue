<template>
  <div class="scrollbar homeWrap" id="homeWrap">
    <div class="homePage">
      <div class="actions flex-row">
        <van-button
          block
          size="lardge"
          color="#FFDB4A"
          @click="$router.push({ name: '登录' })"
          v-if="userState === 0"
          >登录</van-button
        >
        <van-button
          v-if="userState === 0 || userState === 1"
          block
          size="lardge"
          color="#FFDB4A"
          @click="$router.push({ name: '立即报名' })"
          >立即报名</van-button
        >
        <van-button
          v-if="userState === 1"
          block
          size="lardge"
          color="#FFDB4A"
          @click="$router.push({ name: '创建团队' })"
          >创建团队</van-button
        >
        <van-button
          v-if="userState === 2"
          block
          size="lardge"
          color="#FFDB4A"
          @click="handleMyTeam"
          >查看团队</van-button
        >
      </div>
    </div>
    <div class="pageWrap">
      <div class="pageTitle">
        <img src="../assets/img/t1.png" alt="大赛理念" />
      </div>
      <div class="pBlock" style="text-align: center">
        <p>为庆祝中国共产党成立100周年，</p>
        <p>
          深入贯彻落实习近平总书记关于深化思想政治理论课改革创新和加强“四史”教育的重要指示批示精神，
        </p>
        <p>全面落实习近平总书记在党史学习教育动员大会上的重要讲话精神，</p>
        <p>推动高校思想政治理论课实践教学开展，</p>
        <p>动员大学生加强党史学习，</p>
        <p>
          引导大学生在“大思政课”中受教育、长才干、作贡献，坚定不移听党话、跟党走，
        </p>
        <p>全国高校思想政治理论课实践教学联盟决定面向全体会员单位及个人会员</p>
        <strong> 开展“五个一”学党史专项社会实践成果征集活动。 </strong>
      </div>
    </div>
    <div class="pageWrap">
      <div class="pageTitle">
        <img src="../assets/img/t2.png" alt="征集时间" />
      </div>
      <div class="stepList">
        <div class="_item">
          <div class="_t">第一阶段</div>
          <p>即刻开始~2021年6月20日</p>
          <p class="_intro">
            完成参赛实践团队组建报名且至少完成“研读一篇经典文献”成果上传评审
          </p>
        </div>
        <div class="_item">
          <div class="_t">第二阶段</div>
          <p>2021年6月20日~9月20日</p>
          <p class="_intro">完成其余“四个一”的成果作品上传及评审工作</p>
        </div>
      </div>
    </div>
    <div class="pageWrap">
      <div class="pageTitle">
        <img src="../assets/img/t3.png" alt="奖项设置" />
      </div>
      <div class="awardsList">
        <div class="_item">
          <div class="_name">优秀组织奖</div>
          <div class="_title tc">优秀组织奖 X 30个</div>
          <strong class="_mark _line tc"> 奖金4000元 </strong>
          <div class="_intro">
            用于奖励在赛事组织过程中积极参与的联盟成员单位，非联盟成员单位需申请加入联盟后，方可参与优秀组织奖评选。
          </div>
        </div>
        <div class="_item">
          <div class="_name">优秀指导教师奖</div>
          <div class="_title tc">优秀指导教师 x 150位</div>
          <strong class="_mark _line tc"> 奖金2000元 </strong>
          <div class="_intro">
            用于奖励在赛事组织作出积极贡献并在学生团队开展“五个一”提供专业性指导取得优异成绩的指导教师。
          </div>
        </div>
        <div class="_item">
          <div class="_name">优秀团队奖</div>
          <div class="_tr flex-row align-center">
            <div class="flex-1">
              <div class="_title">一等奖 x 20名</div>
              <div class="_intro_mini">(或参赛团队数量1-3%)</div>
            </div>
            <strong class="_mark tc"> 3000元 </strong>
          </div>
          <div class="_tr flex-row align-center">
            <div class="flex-1">
              <div class="_title">二等奖 x 50名</div>
              <div class="_intro_mini">(或参赛团队数量1-3%)</div>
            </div>
            <strong class="_mark tc"> 1000元 </strong>
          </div>
          <div class="_tr flex-row align-center">
            <div class="flex-1">
              <div class="_title">三等奖 x 100名</div>
              <div class="_intro_mini">(或参赛团队数量1-3%)</div>
            </div>
            <strong class="_mark tc"> 500元 </strong>
          </div>
        </div>
        <div class="_item">
          <div class="_name">原创作品奖</div>
          <div class="_tr flex-row align-center">
            <div class="flex-1">
              <div class="_title">一等奖 x 20名</div>
            </div>
            <strong class="_mark tc"> 2000元 </strong>
          </div>
          <div class="_tr flex-row align-center">
            <div class="flex-1">
              <div class="_title">二等奖 x 50名</div>
            </div>
            <strong class="_mark tc"> 1000元 </strong>
          </div>
          <div class="_tr flex-row align-center">
            <div class="flex-1">
              <div class="_title">三等奖 x 100名</div>
            </div>
            <strong class="_mark tc"> 500元 </strong>
          </div>
        </div>
        <div class="_item">
          <div class="_name">最佳人气奖</div>
          <div class="_tr flex-row align-center">
            <div class="flex-1">
              <div class="_title">TOP 1</div>
            </div>
            <strong class="_mark tc"> 奖金4000元 </strong>
          </div>
          <div class="_tr flex-row align-center">
            <div class="flex-1">
              <div class="_title">TOP 10</div>
            </div>
            <strong class="_mark tc"> 奖金2000元 </strong>
          </div>
        </div>
        <div class="_item">
          <div class="_name">最佳创意奖</div>
          <div class="_tr flex-row align-center">
            <div class="_title flex-1 tc">最佳创意奖若干</div>
          </div>
          <div class="_tr flex-row align-center">
            <strong class="flex-1 _mark _line tc"> 奖金4000元 </strong>
          </div>
        </div>
      </div>
    </div>
    <div class="pageWrap">
      <div class="pageTitle">
        <img src="../assets/img/t4.png" alt="作品要求" />
      </div>
      <div class="dlList">
        <div class="_item">
          <div class="_title">学：研读一篇经典文献</div>
          原原本本阅读一篇马克思主义经典文献，认真学习党史有关书目，研究学习经典著作蕴含的历史价值与时代价值，完成一份研读经典文献的读书笔记。
        </div>
        <div class="_item">
          <div class="_title">访：采访一位优秀党员</div>
          采访身边的一位优秀党员，深入了解其感人事迹及入党初心，以访谈录的形式记录采访内容。
        </div>
        <div class="_item">
          <div class="_title">走：参观考察一个红色景点</div>
          组织开展缅怀革命先烈、走访红色革命根据地，实地学习党的历史，在红色景点拍摄一组照片并打卡记录。
        </div>
        <div class="_item">
          <div class="_title">创：原创一部红色文化作品</div>
          依据党的历史事件、人物、故事及学习党史过程中的心得体会等，创作一部原创作品，可以但不限于微电影、动漫、书法、绘画、剧本、诗歌、散文、小论文等。
        </div>
        <div class="_item">
          <div class="_title">干：干一件有益的实事</div>
          调研社会、群体、家乡等急难愁盼的需求，力所能及办一件看得见、摸得着的实事，记录一份开展服务实事的档案。
        </div>
      </div>
    </div>
    <div class="pageWrap">
      <div class="pageTitle">
        <img src="../assets/img/t5.png" alt="参赛方式" />
      </div>
      <div class="dlList introList">
        <ul>
          <li class="_item">
            本次大赛依托
            <span class="_mark"
              >实践教学联盟官网和联盟开发的实践教学管理系统</span
            >
            进行作品报送、赛事过程记录和最终评审工作。
          </li>
          <li class="_item">
            参赛选手必须是在校大学生，以团队为单位参赛，每个团队上限
            6人，每个团队需要请一位 <span class="_mark">思政课教师</span> 或
            <span class="_mark">辅导员</span> 担任指导教师。
          </li>
          <li class="_item">
            参与者
            <span class="_mark">需由所在学校统一组织报名参加</span
            >，参赛团队需完成全部五个类型的实践并根据要求上传成果。
          </li>
          <li class="_item">
            联盟将为每个参与学校设置
            <span class="_mark">一个参赛网页及管理员账号</span>
            ，统一管理维护所在学校的参赛队员，并以此作为评选优秀组织奖的考核条件。
          </li>
        </ul>
      </div>
    </div>
    <div class="pageWrap">
      <div class="pageTitle">
        <img src="../assets/img/t6.png" alt="其他事项" />
      </div>
      <div class="contBlock">
        <p>本次大赛不收取任何参赛费用。</p>
      <p>赛事组织者对收集上来的实践成果享有宣传、推广、进行成果转化等权利。</p>
      <p>
        本次大赛所有提交实践成果作品的作者需获得版权，如产生版权争议引发的一切问题由提交作品作者承担。
      </p>
      <p>
        参与单位务必强调学生参与活动的自愿性，并提醒学生不得从事任何危险性活动。
      </p>
      <p class="_mark">*本次大赛最终解释权归大赛组委会所有</p>
      </div>
    </div>
    <!-- arrow_down -->
    <div v-show="!goToNext" class="arrow_down"></div>
  </div>
</template>

<script>
import { store } from "@/store";
import { my as myTeam } from "@/team/api/team";

export default {
  data() {
    return {
      state: store.state,
      loading: false,
      myTeams: [],
      goToNext: false, // 是否滚动到非首页
    };
  },
  computed: {
    userState() {
      /* 
      - 0未登录

      登录(注册)、报名

      - 1登录未参赛

      报名、创建团队

      - 2登录且有团队

      查看团队
      */
      if (store.get("accessToken") && store.get("user").id) {
        if (Array.isArray(this.myTeams) && this.myTeams.length) {
          return 2;
        } else {
          return 1;
        }
      } else {
        return 0;
      }
    },
  },
  methods: {
    handleMyTeam() {
      if (this.myTeams.length > 1) {
        this.$router.push({ name: "我的团队", params: { list: this.myTeams } });
      } else {
        this.$router.push({
          name: "团队详情",
          query: {
            id: this.myTeams[0].id,
          },
        });
      }
    },
    fetchTeam() {
      this.loading = true;
      myTeam()
        .then((res) => {
          this.loading = false;
          this.myTeams = res.data.data;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
  created() {
    if (store.get("accessToken")) {
      this.fetchTeam();
    }
  },
  mounted() {
    let homeWrap = document.getElementById("homeWrap");
    if (homeWrap) {
      homeWrap.onscroll = (evt) => {
        let el = evt.target;
        if (el.scrollTop > 10) {
          this.goToNext = true;
        } else {
          this.goToNext = false;
        }
      };
    }

  },
};
</script>

<style scoped>
.homeWrap {
  background: #f8f6f6;
}
.homePage {
  position: relative;
  height: 100vh;
  background: url(../assets/img/b.jpg) center center no-repeat;
  background-size: cover;
}
.actions {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 1em 1em 50px;
  /* background: rgba(255, 255, 255, 0.3); */
}
.actions .van-button {
  margin: 0 0.5em;
}
.actions >>> .van-button__text {
  color: #f22626 !important;
}

.arrow_down {
  position: fixed;
  left: 50%;
  bottom: 10px;
  margin-left: -16px;
  width: 32px;
  height: 32px;
  background: url(../assets/img/arrow_down.png) center no-repeat;
  background-size: contain;
  animation: rotatefresh 2s infinite ease;
  transition: all 0.6s;
}
@keyframes rotatefresh {
  0% {
    transform: translateY(0px);
    opacity: 1;
  }
  50% {
    transform: translateY(10px);
    opacity: 0.3;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}
/* 内容样式 */
.pageWrap {
  padding: 1em;
}
.pageTitle {
  margin: 3em 0 2em;
}
.pageTitle img {
  display: block;
  max-width: 40%;
  margin: auto;
}
.pBlock {
  line-height: 2.5;
  color: #555;
}
.pBlock strong {
  color: #e1340c;
  text-decoration: underline;
}

.stepList {
  margin-left: 1.5em;
  padding: 2em 1em 1em 1.5em;
  position: relative;
}
.stepList::before {
  content: "";
  width: 2px;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    #e1340c 30%,
    #e1340c 70%,
    rgba(0, 0, 0, 0) 100%
  );
  z-index: 1;
}
.stepList ._item {
  position: relative;
  z-index: 2;
  padding: 1em 0;
}
.stepList ._item::before {
  content: "";
  position: absolute;
  left: -2.2em;
  top: 1.3em;
  width: 1.5em;
  height: 1.5em;
  background: #e1340c;
}

.stepList ._t {
  font-size: 1.2em;
  color: #e1340c;
}
.stepList ._intro {
  color: #999;
}

.awardsList {
  padding-top: 2em;
  margin-left: -4%;
  overflow: hidden;
}
.awardsList ._item {
  position: relative;
  float: left;
  width: 46%;
  margin: 0 0 8% 4%;
  background: #fff;
  border-radius: 6px;
  padding: 2em 1em 1em;
  box-sizing: border-box;
  line-height: 2;
}
.awardsList ._item:nth-child(odd) {
  clear: left;
}
.awardsList ._name {
  position: absolute;
  top: -1em;
  left: 50%;
  margin-left: -4em;
  width: 8em;
  height: 2em;
  line-height: 2em;
  font-size: 1.2em;
  color: #fff;
  font-weight: 700;
  background: #e1340c;
  text-align: center;
  overflow: hidden;
  border-radius: 1em;
}
.awardsList ._title {
  color: #333;
  font-size: 1.1em;
}
.awardsList ._mark {
  display: block;
  color: #e1340c;
  font-family: Arial, Helvetica, sans-serif;
}
.awardsList ._line {
  text-decoration: underline;
}
.awardsList ._intro {
  color: #999;
}
.awardsList ._tr {
  height: 4em;
}
.awardsList ._intro_mini {
  color: #999;
  transform: scale(0.7) translateX(-20%);
  width: 200%;
  line-height: 1;
  overflow: hidden;
}
.dlList ._item {
  position: relative;
  background: #fff;
  border-radius: 6px;
  padding: 1em 1em 1em 6em;
  margin: 1em 0;
  line-height: 2;
}
.dlList ._item::before {
  content: "";
  position: absolute;
  left: 1.5em;
  top: 1.5em;
  width: 3em;
  height: 3em;
  background: url(../assets/img/work1.png) center center no-repeat;
  background-size: contain;
}
.dlList ._title {
  font-size: 1.2em;
  color: #e1340c;
}
.dlList ._item:nth-child(2):before {
  background-image: url(../assets/img/work2.png);
}
.dlList ._item:nth-child(2) ._title {
  color: #24a266;
}
.dlList ._item:nth-child(3):before {
  background-image: url(../assets/img/work3.png);
}
.dlList ._item:nth-child(3) ._title {
  color: #ffa340;
}
.dlList ._item:nth-child(4):before {
  background-image: url(../assets/img/work4.png);
}
.dlList ._item:nth-child(4) ._title {
  color: #0c89e1;
}
.dlList ._item:nth-child(5):before {
  background-image: url(../assets/img/work5.png);
}
.dlList ._item:nth-child(5) ._title {
  color: #e1340c;
}

.introList ul {
  counter-reset: sectioncounter;
}
.introList ._item {
  padding-left: 4em;
}
.introList ._item::before {
  display: none;
}
.introList ._item::after {
  content: counter(sectioncounter);
  counter-increment: sectioncounter;
  position: absolute;
  left: 1em;
  top: 1.5em;
  width: 2em;
  height: 2em;
  line-height: 2em;
  text-align: center;
  color: #fff;
  background: #e1340c;
  border-radius: 1em;
}
.introList ._mark {
  color: #e1340c;
}
.contBlock{
  margin-top: -3.5em;
  border:1px solid #e45230;
  background:#fff;
  border-radius: 6px;
  padding: 3em 1em 1em;
  text-align: center;
  line-height: 2;
}
.contBlock ._mark{
  color: #e1340c;
}
</style>
