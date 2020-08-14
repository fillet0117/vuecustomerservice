<template>
  <div class="home">
    <el-card shadow="always" class="elcard">
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item>
          <el-input
            type="text"
            v-model="ruleForm.accountcode"
            placeholder="帳號"
            @keyup.enter.native="submit"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            type="password"
            v-model="ruleForm.password"
            placeholder="密碼"
            @keyup.enter.native="submit"
          >
          </el-input>
        </el-form-item>
        <el-button
          size="default"
          @click="submit"
          type="primary"
          class="button-login"
          >送出
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// @ is an alias to /src
import { login } from "../api/login";
export default {
  name: "Home",
  components: {},
  data() {
    return {
      ruleForm: {
        accountcode: "",
        password: "",
      },
    };
  },
  computed: {},
  methods: {
    submit() {
      login(this.ruleForm);
      console.log(this.ruleForm);
    },
  },
};
</script>
<style>
.elcard {
  width: 400px;
}
</style>
