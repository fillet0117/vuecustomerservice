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
            :placeholder="$t('views.main.name')"
            @keyup.enter.native="submit"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            type="password"
            v-model="ruleForm.password"
            :placeholder="$t('views.main.password')"
            @keyup.enter.native="submit"
          ></el-input>
        </el-form-item>
        <el-button
          size="default"
          @click="submit"
          type="primary"
          class="button-login"
          style="margin-right: 5px"
          >{{ $t("views.main.login") }}</el-button
        >
        <el-dropdown>
          <el-button type="primary">
            {{ $t("views.main.language") }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handleEdit('en')">
              <img class="imglang" src="../assets/lang_eng.jpg" />
              {{ $t("views.main.english") }}
            </el-dropdown-item>
            <el-dropdown-item @click.native="handleEdit('ch')">
              <img class="imglang" src="../assets/lang_chn.jpg" />
              {{ $t("views.main.chinese") }}
            </el-dropdown-item>
            <el-dropdown-item @click.native="handleEdit('thai')">
              <img class="imglang" src="../assets/lang_thai.jpg" />
              {{ $t("views.main.thai") }}
            </el-dropdown-item>
            <el-dropdown-item @click.native="handleEdit('vnm')">
              <img class="imglang" src="../assets/lang_vnm.jpg" />
              {{ $t("views.main.vietnamese") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
    window.a = this;
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
          Cookies.set("SameSite", "Strict");
          Cookies.set("chattoken", res.jwt, currentCookieSetting);
          Cookies.set("level", res.level);
          this.$router.push("/about");
        } else {
          this.$message({
            message: this.$t("views.main.loginError"),
            type: "error",
            showClose: true,
            duration: 3000,
          });
        }
      });
    },
    handleEdit(lang) {
      this.$i18n.locale = lang;
      Cookies.set("language", lang);
    },
  },
};
</script>
<style>
.elcard {
  width: 400px;
}
.imglang {
  height: 10%;
  width: 10%;
  margin-right: 5px;
  border-radius: 50%;
  margin-bottom: 5px;
}
</style>
