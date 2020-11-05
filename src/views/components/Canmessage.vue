<template>
  <div>
    <notifications group="foo" position="top right" />
    <el-button size="mini" @click="dialogVisible = true">
      {{
      $t("views.main.add")
      }}
    </el-button>
    <el-dialog
      :title="$t('views.main.add') + $t('views.main.canmsg')"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
      v-if="dialogVisible"
    >
      <addcanmessage @childByValue="childByValue" />
    </el-dialog>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column :label="$t('views.main.id')" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('views.main.type')" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('views.main.content')" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.content }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('views.main.state')" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.status }}</span>
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
      :title="$t('views.main.update') + $t('views.main.canmsg')"
      :visible.sync="dialogVisible2"
      v-if="dialogVisible2"
      width="50%"
      :before-close="handleClose"
    >
      <editcanmessage :data="dialogdata" @childByValue="childByValue" />
    </el-dialog>
  </div>
</template>

<script>
import { getCanMsg, getCanCategory, editCanMsg } from "../../api/chat";
import addcanmessage from "./canmessagecom/CanMessageAdd";
import editcanmessage from "./canmessagecom/CanMessageEdit";
export default {
  components: {
    addcanmessage,
    editcanmessage,
  },
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      dialogVisible2: false,
      dialogdata: "",
      cancategory: [],
    };
  },
  mounted() {
    getCanCategory({ status: "all" }).then((res) => {
      if (res !== "error" && res.length !== 0) {
        this.cancategory = [];
        res.forEach((element) => {
          let tmp = {
            id: element.id,
            type: element.content,
          };
          this.cancategory.push(tmp);
        });
      }
    });
    this.handlegetcanmsg();
  },
  methods: {
    handleEdit(index) {
      this.dialogdata = "";
      this.dialogdata = this.tableData[index];
      this.dialogVisible2 = true;
    },
    handleClose(done) {
      done();
      this.handlegetcanmsg();
      this.dialogVisible = false;
      this.dialogVisible2 = false;
    },
    handlegetcanmsg() {
      getCanMsg({ status: "all" }).then((res) => {
        if (res !== "error" && res.length !== 0) {
          this.tableData = [];
          this.dialogdata = "";
          let st = {
            1: this.$t("views.main.enable"),
            0: this.$t("views.main.deactivate"),
          };
          res.forEach((element) => {
            let type = this.cancategory.find(
              (ty) => ty.id === element.msg_categoryid
            );
            let typech = "";
            if (type !== undefined) {
              typech = type.type;
            }
            let tmp = {
              id: element.id,
              content: element.content,
              status: st[element.status],
              st: element.status,
              type: typech,
              ty: element.msg_categoryid,
            };
            this.tableData.push(tmp);
          });
        }
      });
    },
    childByValue: function () {
      this.dialogVisible = false;
      this.dialogVisible2 = false;
      this.handlegetcanmsg();
    },
    handleDelete(index) {
      let data = this.tableData[index];
      let tmp = {
        id: data.id,
        content: data.content,
        categoryid: data.ty,
        status: "2",
      };
      editCanMsg(tmp).then((res) => {
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
          this.handlegetcanmsg();
        }
      });
    },
  },
};
</script>
