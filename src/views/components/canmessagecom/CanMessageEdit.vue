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
      <el-select
        v-model="form.region"
        :placeholder="$t('views.main.selectcategory')"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('views.main.content')" prop="content">
      <el-input
        type="textarea"
        v-model="form.content"
        style="width: 400px"
      ></el-input>
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
import { editCanMsg, getCanCategory } from "../../../api/chat";
export default {
  props: ["data"],
  data() {
    return {
      options: [],
      form: {
        content: "",
        status: false,
        region: "",
      },
      rules: {
        content: [
          {
            min: 1,
            max: 100000,
            message: this.$t("views.main.typelength"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.form.content = this.data.content;
    this.form.region = this.data.type;
    this.form.status = this.data.st == "1" ? true : false;
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
      let check = this.options.find((op) => op.label === this.form.region);
      if (typeof check !== "undefined") {
        this.form.region = check.value;
      }
      var _this = this;
      _this.$refs["form"].validate((valid) => {
        if (valid) {
          let status = this.form.status == true ? "1" : "0";
          let tmp = {
            id: this.data.id,
            categoryid: this.form.region,
            content: this.form.content,
            status: status,
          };
          editCanMsg(tmp).then((res) => {
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
<style></style>
