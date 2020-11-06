<template>
  <div class="content-bg">
    <el-button size="mini" @click="submit" type="primary" plain>{{
      $t("views.main.logout")
    }}</el-button>
    <el-tabs class="tabs-chat" type="border-card" v-model="activeName">
      <el-tab-pane :label="$t('views.main.Chat')" :disabled="dis" name="first">
        <cschat @checkcount="checkcount" />
      </el-tab-pane>
      <el-tab-pane :label="$t('views.main.MemberChatRecord')" name="second">
        <membermsg />
      </el-tab-pane>
      <el-tab-pane :label="$t('views.main.canmsgcategory')" name="third">
        <cancategory />
      </el-tab-pane>
      <el-tab-pane :label="$t('views.main.cannedmessage')" name="fourth">
        <canmsg />
      </el-tab-pane>
      <el-tab-pane
        v-if="level === '3'"
        :label="$t('views.main.customerservicemanagement')"
        name="sixth"
      >
        <manager />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import cschat from "./components/About";
import cancategory from "./components/Cancategory";
import canmsg from "./components/Canmessage";
import membermsg from "./components/Record";
import manager from "./components/Manager";
import Cookies from "js-cookie";
export default {
  name: "others-chat",
  components: {
    cschat,
    membermsg,
    canmsg,
    cancategory,
    manager,
  },
  data() {
    return {
      level: "2",
      dis: false,
      activeName: "first",
    };
  },
  mounted() {
    this.level = Cookies.get("level");
    let language = Cookies.get("language");
    if (language !== undefined) {
      this.$i18n.locale = language;
    }
  },
  methods: {
    submit() {
      Cookies.remove("chattoken");
      if (this.$route.path !== "/") {
        this.$router.push("/").catch((err) => {
          console.log(err);
        });
      }
    },
    checkcount: function(status) {
      if (status == "limit") {
        this.$message({
          message: this.$t("views.main.limit"),
          type: "warning",
          showClose: true,
          duration: 3000,
        });
      } else if (status == "disconnect") {
        this.$message({
          showClose: true,
          message: this.$t("views.main.alreadydisconnect"),
          type: "warning",
          duration: 3000,
        });
      } else if (status == "double") {
        this.$message({
          showClose: true,
          message: this.$t(`views.main.notSupportDoubleOpening`),
          type: "warning",
          duration: 3000,
        });
      } else if (status == "noLogin") {
        this.$message({
          showClose: true,
          message: this.$t(`views.main.notLoggedIn`),
          type: "warning",
          duration: 3000,
        });
      }
      this.activeName = "second";
      this.dis = true;
    },
  },
};
</script>
