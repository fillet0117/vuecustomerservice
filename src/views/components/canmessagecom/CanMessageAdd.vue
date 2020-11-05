<template>
  <el-form
    :rules="rules"
    :inline="true"
    label-position="left"
    ref="form"
    :model="form"
    label-width="100px"
  >
    <el-form-item :label="$t('views.main.canmsgcategory')">
      <el-select v-model="form.region" :placeholder="$t('views.main.selectcategory')">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('views.main.content')" prop="content">
      <el-input v-model="form.content" style="width:450px"></el-input>
    </el-form-item>
    <el-form-item :label="$t('views.main.state')">
      <el-switch v-model="form.status"></el-switch>
    </el-form-item>
    <br />
    <el-form-item>
      <el-button type="primary" @click="onSubmit()">{{ $t('views.main.add') }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { addCanMsg, getCanCategory } from "../../../api/chat";
export default {
  data() {
    return {
      options: [],
      form: {
        content: "",
        status: true,
      },
      rules: {
        content: [
          {
            required: true,
            message: this.$t("views.main.entercontent"),
            trigger: "blur",
          },
          {
            min: 1,
            max: 20,
            message: this.$t("views.main.contentlength"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    getCanCategory({ status: "all" }).then((res) => {
      if (res !== "error" && res.length !== 0) {
        this.options = [];
        res.forEach((element) => {
          let tmp = {
            value: element.id,
            label: element.content,
          };
          this.options.push(tmp);
        });
      }
    });
  },
  methods: {
    onSubmit() {
      var _this = this;
      _this.$refs["form"].validate((valid) => {
        if (valid) {
          let status = this.form.status == true ? "1" : "0";
          let tmp = {
            id: this.form.id,
            msg_categoryid: this.form.region,
            content: this.form.content,
            status: status,
          };
          addCanMsg(tmp).then((res) => {
            if (res === false) {
              this.$message({
                showClose: true,
                message: this.$t(`views.main.addfail`),
                type: "error",
                duration: 3000,
              });
              this.$emit("childByValue");
            } else {
              this.$message({
                showClose: true,
                message: this.$t(`views.main.addsuccess`),
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