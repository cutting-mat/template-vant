<template>
  <div class="mainCont scrollbar registerPage">
    <div class="pageTitle">请填写报名信息</div>

    <van-form ref="theForm" class="theForm" @submit="doSubmit">
      <van-field
        required
        readonly
        clickable
        :value="editForm.name"
        label="学校"
        placeholder="请选择学校"
        @click="showSchoolPicker = true"
        :rules="[
          {
            required: true,
            validator: validateSchool,
            message: '请选择学校',
            trigger: 'onChange',
          },
        ]"
      >
        <template #button>
          <div class="_link">
            选择 <van-icon name="arrow" />
          </div>
        </template>
      </van-field>
      <!-- 选择学校 -->
      <SchoolPicker
        :visible="showSchoolPicker"
        dataType="1"
        @change="pickedSchool=$event"
        @close="showSchoolPicker = false"
      />
      <van-field
        required
        v-model="editForm.contactsName"
        label="姓名"
        placeholder="请填写姓名"
        :rules="[{ required: true, message: '请填写姓名' }]"
      />
      <van-field
        required
        v-model="editForm.contactsTel"
        type="tel"
        label="手机号"
        placeholder="请填写手机号"
        :rules="[{ required: true, pattern: validMobile, message: '请正确填写手机号' }]"
      >
        <template #button>
          <ValidCode :mobile="editForm.contactsTel" />
        </template>
      </van-field>
      <van-field
        required
        v-model="editForm.verifyCode"
        type="digit"
        label="验证码"
        placeholder="请填写验证码"
        :rules="[{ required: true, message: '请填写验证码' }]"
      />
      <van-field
        required
        v-model="editForm.email"
        label="邮箱"
        placeholder="请填写邮箱"
        :rules="[{ required: true, message: '请填写邮箱' }]"
      />

      <template v-if="showJoinUnitTip">
        <span class="dangerTip">系统检测到该学校目前还不是联盟成员</span>
        <van-field required label="是否有意向加入联盟" label-width="10em">
          <template #input>
            <van-radio-group v-model="editForm.leagueMemberIntent" direction="horizontal">
              <van-radio :name="true">是</van-radio>
              <van-radio :name="false">否</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </template>

    </van-form>

    <div style="margin: 16px 0">
      <van-button
        block
        color="linear-gradient(to right, #fa533e, #fe3d53)"
        native-type="button"
        @click="$refs.theForm.submit()"
      >
        提交报名信息
      </van-button>
    </div>
  </div>
</template>

<script>
import { add as addApply } from "@/main/api/apply";
import {validMobile} from "@/main/assets/util";

export default {
  components: {
    SchoolPicker: (resolve) =>
      require(["../components/SchoolPicker.vue"], resolve),
    ValidCode: (resolve) =>
      require(["../components/ValidCode.vue"], resolve),
  },
  data() {
    return {
      loading: false,
      showSchoolPicker: false,
      editForm: {
        schoolId: null,
        name: "",
        type: null,       // 0 学校报名 1 教师报名 2 学生报名
        verifyCode: "",
        email: "",
        contactsName: "",
        contactsTel: "",
        leagueMemberIntent: false,
      },
      pickedSchool: null,
      validMobile
    };
  },
  watch: {
    pickedSchool: {
      handler() {
        if(this.pickedSchool && this.pickedSchool.name){
          this.editForm.name = this.pickedSchool.name;
          this.editForm.schoolId = this.pickedSchool.id || null;
        }else{
          this.editForm.name = null;
          this.editForm.schoolId = null;
        }
      },
      deep: true
    }
  },
  computed: {
    showJoinUnitTip() {
      return this.editForm.type===0 && ((!!this.pickedSchool && (this.pickedSchool.leagueMember===0)) || (!!this.editForm.name && (this.editForm.schoolId===null)))
    }
  },
  methods: {
    validateSchool(value) {
      // 验证学校
      if (value && this.editForm.name) {
        return true;
      } else {
        return false;
      }
    },
    doSubmit() {
      if(this.loading){
        return null;
      }
      this.loading = true;
      addApply(this.editForm)
        .then((res) => {
          this.loading = false;
          if (res.data.code === 200) {
            this.$dialog.alert({
              title: '报名成功',
              message: '管理员收到后将审核学校信息并与您联系',
              cancelButtonText: '好的',
              confirmButtonColor: '#0265ed'
            }).then(() => {
              this.$router.replace('/')
            })
          } else {
            this.$dialog.alert({
              title: '报名失败',
              message: res.data.msg || '操作失败',
              cancelButtonText: '好的',
              confirmButtonColor: '#0265ed'
            })
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
  created() {
    // 报名类型(0 学校报名 1 教师报名 2 学生报名)
    const applyTypeTitle = ["学校报名", "教师报名", "学生报名"];
    const documentTitle = applyTypeTitle[Number(this.$route.query.type)];
    if (documentTitle) {
      this.editForm.type = Number(this.$route.query.type);
      document.title = documentTitle;
    }
  },
};
</script>

<style scoped>
.registerPage {
  padding: 1em;
}
.pageTitle {
  font-size: 1.1em;
  padding: 1em;
}
.theForm {
  border-radius: 6px;
  overflow: hidden;
}
.theForm .van-cell {
  padding: 16px;
}
.dangerTip{
  display: block;
  padding: 1em 0;
  color: #d70000;
}
.theForm ._link{
  color: #FE664E;
}
</style>