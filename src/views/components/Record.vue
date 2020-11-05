<template>
  <div class="content-Box">
    <notifications group="foo" position="top right" />
    <el-row :gutter="20">
      <el-col :span="5">
        <el-row :gutter="10">
          <el-date-picker
            v-model="date"
            type="daterange"
            :picker-options="pickerOptions"
            @change="pickTime"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-row>
        <el-row :gutter="10">
          <el-table
            ref="singleTable"
            :data="tableData"
            @current-change="handleCurrentChange"
            height="750"
            style="width: 100%; margin-top: 15px;"
            :row-style="{ height: '10px' }"
            highlight-current-row
          >
            <el-table-column
              property="name"
              :label="$t('views.main.nickname')"
            ></el-table-column>
            <el-table-column
              property="linktime"
              :label="$t('views.main.lastEntry')"
            ></el-table-column>
          </el-table>
        </el-row>
      </el-col>
      <el-col :span="13">
        <div class="container" ref="chatContent2">
          <ul v-for="(item, index) in msglist" :key="index">
            <!-- 日期分隔線 -->
            <li v-if="item.style == 'divider'">
              <el-divider>{{ item.msg }}</el-divider>
            </li>
            <li
              v-if="item.style !== 'divider' && item.image === false"
              :class="item.style"
            >
              <div v-if="item.fontstyle == 'fontright'">
                <i :class="item.fontstyle">{{ item.msg }}</i>
                <b>{{ item.name }}</b>
                <br />
              </div>
              <div v-if="item.fontstyle == 'fontleft'">
                <b>{{ item.name }}</b>
                <i :class="item.fontstyle">{{ item.msg }}</i>
                <br />
              </div>
              <i class="time">{{ item.curtime }}</i>
            </li>
            <li
              v-if="item.style !== 'divider' && item.image"
              :class="item.style"
            >
              <div v-if="item.fontstyle == 'fontright'">
                <el-image
                  v-if="item.image"
                  :src="item.msg"
                  :preview-src-list="srcList"
                ></el-image>
                <b>{{ item.name }}</b>
                <br />
              </div>
              <div v-if="item.fontstyle == 'fontleft'">
                <b style="margin-right: 5px;">{{ item.name }}</b>
                <el-image
                  v-if="item.image"
                  :src="item.msg"
                  :preview-src-list="srcList"
                ></el-image>
                <br />
              </div>
              <i class="time">{{ item.curtime }}</i>
            </li>
          </ul>
          <br />
          <br />
        </div>
      </el-col>
      <el-col :span="6">
        <el-card class="userdetial" style="margin-top: 17px">
          <div slot="header" class="clearfix">
            <span>{{ $t("views.main.member_information") }}</span>
          </div>
          <div>
            <i
              v-if="typeof detiallist != 'undefined'"
              class="el-icon-location-outline"
              >{{ detiallist.place }}</i
            >
          </div>
          <div>
            <i>{{ $t("views.main.AccountOrNickname") }} :</i>
            <i v-if="typeof detiallist != 'undefined'">{{ detiallist.name }}</i>
          </div>
          <div>
            <i>IP{{ $t("views.main.address") }} :</i>
            <i v-if="typeof detiallist != 'undefined'">{{ detiallist.ip }}</i>
          </div>
          <div>
            <i>{{ $t("views.main.browser") }} :</i>
            <i v-if="typeof detiallist != 'undefined'">{{
              detiallist.browser
            }}</i>
          </div>
          <div>
            <i>{{ $t("views.main.os") }} :</i>
            <i v-if="typeof detiallist != 'undefined'">{{ detiallist.os }}</i>
          </div>
          <div>
            <i>{{ $t("views.main.device") }} :</i>
            <i v-if="typeof detiallist != 'undefined'">{{
              detiallist.device
            }}</i>
          </div>
          <div>
            <i>{{ $t("views.main.viewport") }} :</i>
            <i v-if="typeof detiallist != 'undefined'"
              >{{ detiallist.height }} x {{ detiallist.width }}</i
            >
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getMemberMsg, getdetial, getroom } from "../../api/chat";
import Cookies from "js-cookie";
import moment from "moment";
export default {
  data() {
    return {
      tableData: [],
      roommsg: "",
      roomdetial: "",
      msglist: [],
      currentroom: "",
      msgtime: "1990/01/01",
      detiallist: "",
      date: [],
      pickerOptions: "",
      stime: "",
      etime: "",
      srcList: [],
      turn: {
        left: "right",
        right: "left",
      },
    };
  },
  mounted() {
    if (Cookies.get("chattoken") === undefined) {
      this.$message({
        showClose: true,
        message: this.$t(`views.main.notLoggedIn`),
        type: "warning",
        duration: 3000,
      });
      if (this.$router.path !== "/") {
        this.$router.push("/");
      }
      return;
    }
    let date2 = new Date();
    this.date = [
      `${date2.getFullYear()}-${date2.getMonth() + 1}-${date2.getDate()}`,
      `${date2.getFullYear()}-${date2.getMonth() + 1}-${date2.getDate()}`,
    ];
    if (this.$store.state.readable === "1") {
      this.rowHandle.edit.disabled = true;
    }
    let tmp = {
      stime: this.date[0],
      etime: this.date[1],
    };
    getroom(tmp).then((res) => {
      if (res !== "error") {
        for (let x in res) {
          let lt = [];
          if (res[x].lasttime != false) {
            lt[x] = moment(res[x].lasttime).format("YYYY/MM/DD HH:mm:ss");
          }
          this.tableData.push({
            name: res[x].roomname,
            room: res[x].room,
            linktime: lt[x],
          });
        }
      }
    });
    this.roommsg = new Map();
    this.roomdetial = new Map();
  },
  methods: {
    handleCurrentChange(data) {
      this.srcList = [];
      if (!data || this.currentroom == data.room) {
        return;
      }
      this.msglist = [];
      this.msgtime = "1990/01/01";
      if (
        this.roommsg.has(data.room) &&
        this.stime == this.date[0] &&
        this.etime == this.date[1]
      ) {
        this.roommsg.get(data.room).forEach((value) => {
          this.msglist.push(value);
        });
      } else {
        this.roommsg.set(data.room, new Set());
        let tmp = {
          room: data.room,
          stime: this.date[0],
          etime: this.date[1],
        };
        getMemberMsg(tmp).then((res) => {
          for (let x in res) {
            let da = "";
            res[x].created_at = moment
              .utc(res[x].created_at)
              .format("YYYY/MM/DD HH:mm:ss");
            let time = res[x].created_at.split(" ");
            if (time[0] != this.msgtime) {
              da = {
                style: "divider",
                msg: time[0],
              };
              this.roommsg.get(data.room).add(da);
              this.msglist.push(da);
              this.msgtime = time[0];
            }
            if (typeof res[x].mid === "string" && res[x].mid !== "") {
              // 訊息是emoji
              if (
                res[x].content.indexOf("0x1") !== -1 &&
                this.checkImg(res[x].content) === false
              ) {
                res[x].content = this.getemoji(res[x].content);
              }
              da = {
                curtime: res[x].created_at,
                name: res[x].mid,
                msg: res[x].content,
                style: "right",
                fontstyle: "fontright",
              };
              if (this.checkImg(res[x].content) === true) {
                this.srcList.push(res[x].content);
              }
              da["image"] = this.checkImg(res[x].content);
              this.roommsg.get(data.room).add(da);
              this.msglist.push(da);
            } else if (typeof res[x].uid === "string" && res[x].uid !== "") {
              // 訊息是emoji
              if (
                res[x].content.indexOf("0x1") != -1 &&
                this.checkImg(res[x].content) == false
              ) {
                res[x].content = this.getemoji(res[x].content);
              }
              da = {
                curtime: res[x].created_at,
                name: res[x].uid,
                msg: res[x].content,
                style: "left",
                fontstyle: "fontleft",
              };
              if (this.checkImg(res[x].content) == true) {
                this.srcList.push(res[x].content);
              }
              da["image"] = this.checkImg(res[x].content);
              this.roommsg.get(data.room).add(da);
              this.msglist.push(da);
            }
            this.scrollToBottom();
          }
        });
      }
      this.getroomdetial(data);
      this.currentroom = data.room;
    },
    getDate(indate) {
      var date = "";
      if (indate == "") {
        date = new Date();
      } else {
        date = new Date(indate);
      }
      var month, day, hour, min;
      if (date.getMonth() / 10 < 1) {
        month = date.getMonth() + 1;
        month = "0" + month;
      } else {
        month = date.getMonth();
      }
      if (date.getDate() / 10 < 1) {
        day = "0" + date.getDate();
      } else {
        day = date.getDate();
      }
      if (date.getHours() / 10 < 1) {
        hour = "0" + date.getHours();
      } else {
        hour = date.getHours();
      }
      if (date.getMinutes() / 10 < 1) {
        min = "0" + date.getMinutes();
      } else {
        min = date.getMinutes();
      }
      date =
        date.getYear() +
        1900 +
        "/" +
        month +
        "/" +
        day +
        " " +
        hour +
        ":" +
        min;
      return date;
    },
    checkImg(data) {
      if (data.indexOf("/router/msgimage/") !== -1) {
        return true;
      } else {
        return false;
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.chatContent2.scrollTop = this.$refs.chatContent2.scrollHeight;
      });
    },
    getemoji(str) {
      var index = str.indexOf("0x1");
      var final = "";
      var third = "";
      if (index != -1) {
        do {
          let first = "";
          let test = "";
          first = str.substr(0, index);
          test = str.substr(index, 7);
          third = str.substr(index + 7);
          final += first + String.fromCodePoint(test); // + third;
          str = third;
          index = str.indexOf("0x1");
        } while (index != -1);
        final += third;
      } else {
        final = str;
      }
      return final;
    },
    getroomdetial(data) {
      this.detiallist = [];
      if (this.roomdetial.has(data.room)) {
        let turn = this.roomdetial.get(data.room).values();
        let turn2 = turn.next().value;
        this.detiallist = turn2;
      } else {
        let tmp = {
          name: data.name,
        };
        if (!this.roomdetial.has(data.room)) {
          this.roomdetial.set(data.room, new Set());
        }
        getdetial(tmp).then((res) => {
          var area = "";
          if (res !== "" && res !== "error") {
            try {
              area = res[0].area;
            } catch (e) {
              return;
            } finally {
              res[0]["place"] = area;
              this.roomdetial.get(data.room).add(res[0]);
              this.detiallist = res[0];
            }
          }
        });
      }
    },
    pickTime() {
      this.tableData = [];
      this.srcList = [];
      this.msglist = [];
      let tmp = {
        stime: this.date[0],
        etime: this.date[1],
      };
      getroom(tmp).then((res) => {
        if (res !== "error") {
          for (let x in res) {
            let lt = "";
            if (res[x].lasttime !== false && res[x].lasttime !== null) {
              lt = moment(res[x].lasttime).format("YYYY/MM/DD HH:mm:ss");
            }
            this.tableData.push({
              name: res[x].roomname,
              room: res[x].room,
              linktime: lt,
            });
          }
        }
      });
    },
  },
};
</script>
<style>
body > .scrollbar-macosx {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.container {
  margin-top: 15px;
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 10px;
  height: 800px;
  overflow-y: scroll;
  overflow-x: hidden;
  border: 2px solid gainsboro;
  border-radius: 5px;
  white-space: pre-line;
}
.container .right {
  text-align: right;
  margin-right: 10px;
}
.container .left {
  text-align: left;
  margin-left: 10px;
}
.container .fontright {
  border-radius: 18px 0px 18px 18px;
  color: #fff;
  padding: 3px 8px;
  display: inline-block;
  font-style: normal;
  background: #75afe0;
  word-break: break-all;
  text-align: left;
  font-size: 18px;
  margin: 0 10px;
}
.container .fontleft {
  border-radius: 0px 18px 18px 18px;
  color: #fff;
  padding: 3px 8px;
  display: inline-block;
  font-style: normal;
  background: #bfbfbf;
  word-break: break-all;
  text-align: left;
  font-size: 18px;
  margin: 0 10px;
}
.container i {
  display: block;
  margin-bottom: 10px;
}
.container .msg_img {
  width: 86%;
}
</style>
