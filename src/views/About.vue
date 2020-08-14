<template>
  <div>
    <el-row>
      <el-form size="mini" :inline="true" @submit.native.prevent>
        <el-form-item :label="$t(`views.main.state`)">
          <el-radio-group v-model="busyornot" @change="statuschange">
            <el-radio-button label="auto">{{
              $t("views.main.wiringAutomatic")
            }}</el-radio-button>
            <el-radio-button label="manu">{{
              $t("views.main.wiringManual ")
            }}</el-radio-button>
            <el-radio-button label="disc">{{
              $t("views.main.Offlinde")
            }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <i> {{ $t("views.main.csOnlineNumber") }} : {{ online }} </i>
      <i> {{ $t("views.main.memberOnline") }} : {{ useronline }} </i>
    </el-row>
    <el-row>
      <el-col :span="5" style="border: 1px solid gainsboro;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('views.main.wiringHall')" name="first">
            <el-row>
              <el-table
                ref="singleTable"
                :data="newtableData"
                height="640"
                style="width: 100%;"
                :row-class-name="tableNotice"
                :row-style="{ height: '30px' }"
              >
                <el-table-column
                  property="name"
                  :label="$t('views.main.name')"
                ></el-table-column>
                <el-table-column
                  property="waittime"
                  :label="$t('views.main.waitingTime')"
                  width="60"
                ></el-table-column>
                <el-table-column
                  property="linktime"
                  :label="$t('views.main.connectionTime')"
                  width="60"
                ></el-table-column>
                <el-table-column
                  property="servicestatus"
                  :label="$t('views.main.state')"
                  width="70"
                ></el-table-column>
                <el-table-column :label="$t('views.main.incoming')" width="62">
                  <template slot-scope="scope">
                    <el-button
                      size="small"
                      :disabled="scope.row.inroom"
                      @click="getinroom(scope.row, scope.$index)"
                      >{{ $t("views.main.incoming") }}</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-tab-pane>
          <el-tab-pane :label="$t('views.main.myOnlineCustomer')" name="second">
            <el-table
              ref="singleTable"
              :data="mytableData"
              height="640"
              style="width: 100%;"
              @current-change="handleCurrentChange"
              highlight-current-row
              :row-style="{ height: '30px' }"
            >
              <el-table-column
                property="name"
                :label="$t('views.main.name')"
              ></el-table-column>
              <el-table-column
                property="waittime"
                :label="$t('views.main.waitingTime')"
                width="60"
              ></el-table-column>
              <el-table-column
                property="linktime"
                :label="$t('views.main.connectionTime')"
                width="60"
              ></el-table-column>
              <el-table-column
                property="no"
                :label="$t('views.main.inform')"
                width="70"
              >
                <template slot-scope="scope">
                  <el-badge
                    v-if="scope.row.no != 0"
                    :value="scope.row.no"
                  ></el-badge>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane
            :label="$t('views.main.todayCustomerRecord')"
            name="third"
          >
            <el-table
              ref="singleTable"
              :data="tableData"
              height="640"
              style="width: 100%;"
              @current-change="handleRecord"
              :row-style="{ height: '30px' }"
            >
              <el-table-column
                property="name"
                :label="$t('views.main.name')"
              ></el-table-column>
              <el-table-column
                property="linktime"
                :label="$t('views.main.lastEntry')"
              ></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col style="border: 1px solid gainsboro;" :span="15">
        <el-main class="container">Main</el-main>
        <el-footer style="border: 1px solid gainsboro;">Footer</el-footer>
        <el-container style="border: 1px solid gainsboro;">
          <el-main style="border: 1px solid gainsboro;">Main</el-main>
          <el-aside style="border: 1px solid gainsboro;">aside</el-aside>
        </el-container>
      </el-col>
      <el-col style="border: 1px solid gainsboro;" :span="4"> </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      busyornot: "disc",
      online: 0,
      useronline: 0,
      activeName: "second",
    };
  },
  methods: {
    // 轉換cs的status
    statuschange(val) {
      console.log(val);
      // if (this.myroom.length > 0 && val == "disc") {
      //   // 接線中點選離線
      //   this.busyornot = this.last;
      //   this.$message({
      //     type: "info",
      //     message: this.$t("views.main.canNotOfflineDuringWiring"),
      //   });
      //   return;
      // }
      // let nowstatus = this.last;
      // this.socket.emit("getbusyvalue", val, nowstatus, this.nickname);
      // this.last = val;
    },
    handleClick() {
      console.log(this.activeName);
    },
  },
};
</script>
<style>
.container {
  height: 740px;
  overflow-y: scroll;
  overflow-x: hide;
  border: 1px solid gainsboro;
  white-space: pre-line;
}
</style>
