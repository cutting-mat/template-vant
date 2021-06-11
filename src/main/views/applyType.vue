<template>
  <div class="applyType">
    <ul>
      <!-- 报名类型(0 学校报名 1 教师报名 2 学生报名) -->
      <li class="flex-row align-center applyTypeItem" @click="$router.push({name: '提交报名', query: {type: 0}})">
        <img src="../assets/img/apply_type_1.png" class="_icon" />
        <div class="flex-1">
          <h3 class="_t">学校</h3>
          <p class="_p">如果您是学校相关负责人，想组织学校参赛，请选择此项</p>
        </div>
        <van-icon name="arrow" class="_arrow" />
      </li>
      <li class="flex-row align-center applyTypeItem" @click="$router.push({name: '提交报名', query: {type: 2}})">
        <img src="../assets/img/apply_type_2.png" class="_icon" />
        <div class="flex-1">
          <h3 class="_t">学生</h3>
          <p class="_p">如果您是学生，个人想参加比赛，请选择此项</p>
        </div>
        <van-icon name="arrow" class="_arrow" />
      </li>
      <li class="flex-row align-center applyTypeItem" @click="$router.push({name: '提交报名', query: {type: 1}})">
        <img src="../assets/img/apply_type_3.png" class="_icon" />
        <div class="flex-1">
          <h3 class="_t">教师</h3>
          <p class="_p">如果您是教师，个人想代领学生参赛，请选择此项</p>
        </div>
        <van-icon name="arrow" class="_arrow" />
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  data() {
    return {
      
    };
  },
  methods: {
    
  },
};
</script>

<style scoped>
.applyType{
  padding: 1em;
  background:#fff;
}
.applyTypeItem{
  color: #fff;
  border-radius: 6px;
  margin-top: 1em;
  padding: 1.5em 1em;
}
.applyTypeItem ._icon{
  height: 6em;
  margin-right: 1em;
}
.applyTypeItem ._t{
  font-size: 1.5em;
  font-weight: normal;
  margin: 0;
}
.applyTypeItem ._p{
  line-height: 1.5em;
  opacity: 0.7;
}
.applyTypeItem ._arrow{
  font-size: 1.5em;
  margin-left: .5em;
}
.applyTypeItem:nth-child(1){
  background: linear-gradient(211deg,#00b2ff, #0078ff);
}
.applyTypeItem:nth-child(2){
  background: linear-gradient(270deg,#ffa01b, #f76b1c);
}
.applyTypeItem:nth-child(3){
  background: linear-gradient(135deg,#ff3d54, #fa543e);
}

</style>