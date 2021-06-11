<template>
  <div class="mainCont scrollbar registerPage">
    <div class="pageTitle">请填写注册信息</div>

    <van-form ref="theForm" class="theForm" @submit="doSubmit">
      <van-field
        required
        readonly
        clickable
        :value="editForm.typeName"
        label="账号类型"
        placeholder="选择账号类型"
        @click="showTypePicker = true"
        :rules="[
          {
            required: true,
            validator: validateType,
            message: '选择账号类型',
            trigger: 'onChange',
          },
        ]"
      />
      <!-- 选择账号类型 -->
      <van-popup v-model.trim="showTypePicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="[
            { value: 1, name: '教师' },
            { value: 2, name: '学生' },
          ]"
          value-key="name"
          @confirm="handleTypeChange"
          @cancel="showTypePicker = false"
        />
      </van-popup>
      <van-field
        v-if="editForm.type == 1"
        required
        readonly
        clickable
        :value="editForm.teacherTypeName"
        label="教师类型"
        placeholder="选择教师类型"
        @click="showTeacherTypePicker = true"
        :rules="[
          {
            required: true,
            validator: validateTeacherType,
            message: '选择教师类型',
            trigger: 'onChange',
          },
        ]"
      />
      <!-- 选择教师类型 -->
      <van-popup v-model.trim="showTeacherTypePicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="[
            { value: 1, name: '教师' },
            { value: 2, name: '辅导员' },
          ]"
          value-key="name"
          @confirm="handleTeacherTypeChange"
          @cancel="showTeacherTypePicker = false"
        />
      </van-popup>
      <van-field
        required
        readonly
        clickable
        :value="editForm.schoolName"
        label="学校"
        placeholder="请选择学校"
        @click="!lockSchool && (showSchoolPicker = true)"
        :disabled="lockSchool"
        :rules="[
          {
            required: true,
            validator: validateSchool,
            message: '请选择学校',
            trigger: 'onChange',
          },
        ]"
      >
        <template #button v-if="!lockSchool">
          <div class="_link">
            选择 <van-icon name="arrow" />
          </div>
        </template>
      </van-field>
      <!-- 选择学校 （已报名的，不能添加）-->
      <SchoolPicker
        :visible="showSchoolPicker"
        dataType="2"
        @change="handlePickSchool"
        @close="showSchoolPicker = false"
      />
      <van-field
        required
        v-model.trim="editForm.name"
        label="姓名"
        placeholder="请填写姓名"
        :rules="[{ required: true, message: '请填写姓名' }]"
      />
      <van-field
        required
        v-model.trim="editForm.contactsNumber"
        type="tel"
        label="手机号"
        placeholder="请填写手机号"
        :rules="[{ required: true, message: '请填写手机号' }]"
      />
      <van-field
        required
        v-model.trim="editForm.verifyCode"
        type="digit"
        label="验证码"
        placeholder="请填写验证码"
        :rules="[{ required: true, message: '请填写验证码' }]"
      >
        <template #button>
          <ValidCode :mobile="editForm.contactsNumber" />
        </template>
      </van-field>
      <van-field
        required
        v-model.trim="editForm.password"
        type="password"
        label="设置密码"
        placeholder="请填写密码"
        :rules="[
          {
            required: true,
            pattern: new RegExp('^[a-zA-Z0-9]{6,16}$'),
            message: '请填写6~16位密码',
          },
        ]"
      />
      <van-field
        required
        v-model.trim="editForm.checkPassword"
        type="password"
        label="确认密码"
        placeholder="请确认密码"
        :rules="[
          {
            required: true,
            validator: validatePass2,
            message: '两次输入密码不一致',
          },
        ]"
      />
    </van-form>

    <div style="margin: 16px 0">
      <van-button
        :loading="loading"
        block
        color="linear-gradient(to right, #fa533e, #fe3d53)"
        native-type="button"
        @click="$refs.theForm.submit()"
        size="lardge"
      >
        提交
      </van-button>
    </div>
  </div>
</template>

<script>
import { regist } from "@/main/api/common";
import { emit } from "../assets/util";

export default {
  components: {
    SchoolPicker: (resolve) =>
      require(["../components/SchoolPicker.vue"], resolve),
    ValidCode: (resolve) => require(["../components/ValidCode.vue"], resolve),
  },
  data() {
    return {
      loading: false,
      showTypePicker: false,
      showSchoolPicker: false,
      showTeacherTypePicker: false,
      editForm: {
        schoolId: null,
        schoolName: null,
        name: "",
        contactsNumber: "",
        password: "",
        checkPassword: null,
        type: null,
        typeName: null,
        teacherType: 0,
        teacherTypeName: null,
        verifyCode: null,
      },
      lockSchool: false, // 从团队邀请过来的，锁定学校
    };
  },
  methods: {
    handleTeacherTypeChange(item) {
      if (item && item.value) {
        this.editForm.teacherType = item.value;
        this.editForm.teacherTypeName = item.name;
      }
      this.showTeacherTypePicker = false;
    },
    handlePickSchool(item) {
      if(!item){
        item = {}
      }
      this.editForm.schoolId = item.id || null;
      this.editForm.schoolName = item.name || null;
    },
    handleTypeChange(item) {
      // 选择账号类型回调
      if (item && item.value) {
        this.editForm.type = item.value;
        this.editForm.typeName = item.name;
      }
      this.showTypePicker = false;
    },
    validateSchool(value) {
      // 验证学校
      if (value && this.editForm.schoolId) {
        return true;
      } else {
        return false;
      }
    },
    validateType(value) {
      // 验证账号类型
      if (value && this.editForm.type) {
        return true;
      } else {
        return false;
      }
    },
    validateTeacherType(value) {
      // 验证教师类型
      if (this.editForm.type != 1) {
        // 不是教师账号不验证此字段
        return true;
      }
      if (value && this.editForm.teacherType) {
        return true;
      } else {
        return false;
      }
    },
    validatePass2(value) {
      // 再次输入密码验证
      if (value === "") {
        return false;
      } else if (value !== this.editForm.password) {
        return false;
      } else {
        return true;
      }
    },
    doSubmit() {
      if (this.loading) {
        return null;
      }
      this.loading = true;

      regist(this.editForm)
        .then((res) => {
          this.loading = false;
          if (res.data.code === 200) {
            // 注册后自动登录
            emit("login", {
              from: this.$router.currentRoute.query.from || '/',
              data: { accessToken: res.data.data },
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
  },
  created() {
    if (this.$route.query.schoolId && this.$route.query.schoolName) {
      this.lockSchool = true;
      this.editForm.schoolId = this.$route.query.schoolId;
      this.editForm.schoolName = this.$route.query.schoolName;
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

.theForm ._link{
  color: #FE664E;
}
</style>