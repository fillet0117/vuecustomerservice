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
import { login } from "../api/login";
import Cookies from "js-cookie";
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
  mounted() {
    if (Cookies.get("chattoken") !== undefined) {
      this.$router.push("/about");
    }
  },
  methods: {
    submit() {
      login(this.ruleForm).then((res) => {
        if (res !== "error") {
          let currentCookieSetting = {
            expires: 1,
          };
          Cookies.set("chattoken", res, currentCookieSetting);
          this.$router.push("/about");
        }
      });
    },
  },
};
</script>
<style>
.elcard {
  width: 400px;
}
</style>
