<template>
  <el-form
    :rules="rules"
    :inline="true"
    label-position="left"
    ref="form"
    :model="form"
    label-width="80px"
  >
    <el-form-item :label="$t('views.main.name')" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item :label="$t('views.main.password')" prop="password">
      <el-input v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item :label="$t('views.main.nickname')" prop="nickname">
      <el-input v-model="form.nickname"></el-input>
    </el-form-item>
    <el-form-item :label="$t('views.main.level')">
      <el-select
        v-model="form.level"
        :placeholder="$t('views.main.selectlevel')"
      >
        <el-option
          :label="$t('views.main.backendmanager')"
          value="1"
        ></el-option>
        <el-option
          :label="$t('views.main.customerservice')"
          value="2"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('views.main.state')">
      <el-switch v-model="form.status"></el-switch>
    </el-form-item>
    <el-form-item :label="$t('views.main.photo')">
      <el-upload
        list-type="upload-demo"
        action
        :auto-upload="false"
        :on-change="getFile"
        :on-remove="handleRemove"
        :limit="1"
        accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .GIF"
        ref="upload"
      >
        <i class="el-icon-picture-outline uploader-icon"></i>
      </el-upload>
      <el-popover v-if="upfile != ''">
        <img
          slot="reference"
          :src="upfile"
          style="width: 100px; height: 100px"
        />
      </el-popover>
    </el-form-item>
    <br />
    <el-form-item>
      <el-button type="primary" @click="onSubmit()">{{
        $t("views.main.add")
      }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { addmanager } from "../../../api/chat";
export default {
  data() {
    return {
      form: {
        name: "",
        password: "",
        level: "1",
        status: true,
      },
      upfile: "",
      rules: {
        name: [
          {
            required: true,
            message: this.$t("views.main.entername"),
            trigger: "blur",
          },
          {
            min: 3,
            max: 40,
            message: this.$t("views.main.namelength"),
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: this.$t("views.main.enterpassword"),
            trigger: "blur",
          },
          {
            min: 6,
            max: 20,
            message: this.$t("views.main.passwordlength"),
            trigger: "blur",
          },
        ],
        nickname: [
          {
            required: true,
            message: this.$t("views.main.enternickname"),
            trigger: "blur",
          },
          {
            min: 2,
            max: 20,
            message: this.$t("views.main.nicknamelength"),
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    onSubmit() {
      var _this = this;
      _this.$refs["form"].validate((valid) => {
        if (valid) {
          let status = this.form.status == true ? "1" : "0";
          let tmp = {
            accountcode: this.form.name,
            password: this.form.password,
            nickname: this.form.nickname,
            level: this.form.level,
            status: status,
            photo: this.upfile,
          };
          addmanager(tmp).then((res) => {
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
    getFile(file) {
      let maxsize = 1024 * 500; // 300KB
      if (file.size > maxsize) {
        this.$message({
          message: this.$t("views.main.pic_should_not_bigger_than") + "500KB",
          type: "warning",
          showClose: true,
          duration: 3000,
        });
        this.$refs.upload.clearFiles();
      } else {
        this.getBase64(file.raw).then((res) => {
          this.upfile = res;
        });
      }
    },
    // 把圖轉乘base64
    getBase64(file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function () {
          imgResult = reader.result;
          let newImage = new Image();
          newImage.src = imgResult;
          let imgWidth, imgHeight;
          newImage.onload = function () {
            imgWidth = this.width;
            imgHeight = this.height;
            let myWidth = 300;
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            if (Math.max(imgWidth, imgHeight) > myWidth) {
              if (imgWidth > imgHeight) {
                canvas.width = myWidth;
                canvas.height = (myWidth * imgHeight) / imgWidth;
              } else {
                canvas.height = myWidth;
                canvas.width = (myWidth * imgWidth) / imgHeight;
              }
            } else {
              canvas.width = imgWidth;
              canvas.height = imgHeight;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
            imgResult = canvas.toDataURL("image/jpeg", 0.8);
            resolve(imgResult);
          };
        };
        reader.onerror = function (error) {
          reject(error);
        };
      });
    },
    handleRemove() {
      this.upfile = "";
    },
  },
};
</script>
<style>
</style>