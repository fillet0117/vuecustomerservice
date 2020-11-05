<template>
  <div>
    <notifications group="foo" position="top right" />
    <el-button size="mini" @click="dialogVisible = true">
      {{
      $t("views.main.add")
      }}
    </el-button>
    <el-dialog
      :title="$t('views.main.add') + $t('views.main.backendmanager')"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      v-if="dialogVisible"
    >
      <addmanager @childByValue="childByValue" />
    </el-dialog>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column :label="$t('views.main.id')" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.managerid }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('views.main.name')" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('views.main.nickname')" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('views.main.photo')" width="180">
        <template slot-scope="scope">
          <img
            v-if="scope.row.photo !== ''"
            :src="scope.row.photo"
            style="width: 60px;height: 60px;"
          />
        </template>
      </el-table-column>

      <el-table-column :label="$t('views.main.state')" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('views.main.level')" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.level }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('views.main.operating')">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index)"
            type="primary"
          >{{ $t("views.main.update") }}</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="handleDelete(scope.$index)"
          >{{ $t("views.main.delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="$t('views.main.update') + $t('views.main.backendmanager')"
      :visible.sync="dialogVisible2"
      v-if="dialogVisible2"
      width="50%"
      :before-close="handleClose"
    >
      <editManager :data="dialogdata" @childByValue="childByValue" />
    </el-dialog>
  </div>
</template>

<script>
import { getmanager, editmanager } from "../../api/chat";
import addmanager from "./managercom/ManagerAdd";
import editManager from "./managercom/ManagerEdit";
export default {
  components: {
    addmanager,
    editManager,
  },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      dialogVisible2: false,
      dialogdata: "",
    };
  },
  mounted() {
    this.handlegetmanager();
  },
  methods: {
    handleEdit(index) {
      this.dialogdata = "";
      this.dialogdata = this.tableData[index];
      this.dialogVisible2 = true;
    },
    handleClose(done) {
      done();
      this.handlegetmanager();
      this.dialogVisible = false;
      this.dialogVisible2 = false;
    },
    handlegetmanager() {
      getmanager({}).then((res) => {
        if (res !== "error" && res.length !== 0) {
          this.tableData = [];
          this.dialogdata = "";
          let st = {
            1: this.$t("views.main.enable"),
            0: this.$t("views.main.deactivate"),
          };
          let le = {
            1: this.$t("views.main.backendmanager"),
            2: this.$t("views.main.customerservice"),
            3: this.$t("view.main.admin")
          };
          res.forEach((element) => {
            let tmp = {
              name: element.accountcode,
              managerid: element.managerid,
              nickname: element.name,
              photo: element.photo,
              status: st[element.status],
              st: element.status,
              level: le[element.level],
              le: element.level,
            };
            this.tableData.push(tmp);
          });
        }
      });
    },
    childByValue: function () {
      this.dialogVisible = false;
      this.dialogVisible2 = false;
      this.handlegetmanager();
    },
    handleDelete(index) {
      let data = this.tableData[index];
      let tmp = {
        id: data.managerid,
        accountcode: data.name,
        status: "2",
      };
      editmanager(tmp).then((res) => {
        if (res === false) {
          this.$message({
            showClose: true,
            message: this.$t(`views.main.editfail`),
            type: "error",
            duration: 3000,
          });
        } else {
          this.$message({
            showClose: true,
            message: this.$t(`views.main.editsuccess`),
            type: "success",
            duration: 3000,
          });
          this.handlegetmanager();
        }
      });
    },
  },
};
</script>
