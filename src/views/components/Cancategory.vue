<template>
  <div>
    <div class="content-Box">
      <el-form ref="form" :model="form" :inline="true" size="mini">
        <el-form-item :label="$t(`views.main.status`)">
          <el-select v-model="form.select" @change="search()">
            <el-option :label="$t(`views.main.all`)" value></el-option>
            <el-option :label="$t(`views.main.enable`)" value="1"></el-option>
            <el-option :label="$t(`views.main.disable`)" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="floatRight">
          <el-button type="primary">
            <i class="fa fa-plus-square"></i>
            {{$t(`views.main.add`)}}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  getCanCategory,
  //   editCanCategory,
  //   addChatCategory,
  //   categoryChangeSort,
} from "../../api/chat";
export default {
  data() {
    return {
      form: {
        select: "",
      },
    };
  },
  mounted() {},
  methods: {
    search() {
      let tmp = {
        status: this.form.select,
      };
      getCanCategory(tmp).then((res) => {
        if (res !== "error") {
          this.data = [];
          if (res !== "") {
            let i, j;
            for (i in res) {
              j = Number(i);
              this.data.push({
                count: j + 1,
                id: res[i].id,
                sort: res[i].sort,
                status: res[i].status,
                title: res[i].value,
                created_time: res[i].created_at,
                updated_time: res[i].updated_at,
                isshow: res[i].status === "2",
              });
            }
          } else {
            this.$message({
              message: this.$t(`views.main.noRecordsYet`),
              type: "warning",
            });
          }
        }
      });
    },
  },
};
</script>
<style scoped>
.el-table tr td,
.el-table tr th {
  text-align: center;
}
</style>
