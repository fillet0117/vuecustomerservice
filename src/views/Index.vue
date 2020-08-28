<template>
  <div class="content-bg">
    <el-button size="mini" @click="submit" type="primary" plain>{{ $t("views.main.logout") }}</el-button>
    <el-tabs class="tabs-chat" type="border-card">
      <el-tab-pane :label="$t('views.main.Chat')">
        <cschat />
      </el-tab-pane>
      <!-- <el-tab-pane :label="$t('views.main.cannedmessage')" name="2">
        <canmsg />
      </el-tab-pane>-->
      <el-tab-pane :label="$t('views.main.MemberChatRecord')">
        <membermsg />
      </el-tab-pane>
      <!-- <el-tab-pane :label="$t('views.main.CanMsgCategory')" name="1">
        <cancategory />
      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>
<script>
import cschat from "./components/About";
// import cancategory from "./components/Cancategory";
// import canmsg from "./components/canmsg/index";
import membermsg from "./components/Record";
import Cookies from "js-cookie";
export default {
  name: "others-chat",
  components: {
    cschat,
    // cancategory,
    // canmsg,
    membermsg,
  },
  methods: {
    submit() {
      Cookies.remove("chattoken");
      // this.$router.push("/").catch(() => {
      //   return;
      // });
      if (this.$route.path !== "/") {
        this.$router.push("/").catch((err) => {
          console.log(err);
        });
      }
    },
  },
};
</script>
