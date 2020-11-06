<template>
  <el-form
    :rules="rules"
    :inline="true"
    label-position="left"
    ref="form"
    :model="form"
    label-width="80px"
  >
    <el-form-item :label="$t('views.main.type')" prop="content">
      <el-input v-model="form.content" style="width: 350px"></el-input>
    </el-form-item>
    <el-form-item :label="$t('views.main.state')">
      <el-switch v-model="form.status"></el-switch>
    </el-form-item>
    <br />
    <el-form-item>
      <el-button type="primary" @click="onSubmit()">{{
        $t("views.main.update")
      }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { editCanCategory } from "../../../api/chat";
export default {
  props: ["data"],
  data() {
    return {
      form: {
        content: "",
        status: false,
      },
      rules: {
        content: [
          {
            min: 1,
            max: 1000000,
            message: this.$t("views.main.typelength"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.form.content = this.data.content;
    this.form.status = this.data.st == "1" ? true : false;
  },
  methods: {
    onSubmit() {
      var _this = this;
      _this.$refs["form"].validate((valid) => {
        if (valid) {
          let status = this.form.status == true ? "1" : "0";
          let tmp = {
            id: this.data.id,
            content: this.form.content,
            status: status,
          };
          editCanCategory(tmp).then((res) => {
            if (res === false) {
              this.$message({
                showClose: true,
                message: this.$t(`views.main.editfail`),
                type: "error",
                duration: 3000,
              });
              this.$emit("childByValue");
            } else {
              this.$message({
                showClose: true,
                message: this.$t(`views.main.editsuccess`),
                type: "success",
                duration: 3000,
              });
              this.$emit("childByValue");
            }
          });
        } else {
          this.$message({
            showClose: true,
            message: this.$t(`views.main.enterfail`),
            type: "error",
            duration: 3000,
          });
        }
      });
    },
  },
};
</script>
<style>
</style>