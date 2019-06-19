<template>
  <div>
    <h1 class="title">login</h1>
    <form class="myform">
      <div class="_item">
        <cube-input v-model="form.username" placeholder="用户名"></cube-input>
      </div>
      <div class="_item">
        <cube-input type="password" v-model="form.password" placeholder="密码"></cube-input>
      </div>
      <cube-button primary type="submit">登录</cube-button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      }
    };
  }
};
</script>

<style scoped>
.title{font-size:1.5em;margin: 2rem 0;text-align: center;}
.myform {
  padding: 1rem;
}
.myform ._item {
  margin-bottom: 0.5rem;
}
</style>
