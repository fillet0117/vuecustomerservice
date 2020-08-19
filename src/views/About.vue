<template>
  <div>
    <div></div>
    <div class="content-Box">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-row>
            <el-col :span="6">
              <el-form size="mini" :inline="true" @submit.native.prevent>
                <el-form-item :label="$t(`views.main.state`)">
                  <el-radio-group v-model="busyornot" @change="statuschange">
                    <el-radio label="auto">
                      {{
                      $t("views.main.wiringAutomatic")
                      }}
                    </el-radio>
                    <el-radio label="manu">
                      {{
                      $t("views.main.wiringManual ")
                      }}
                    </el-radio>
                    <el-radio label="disc">
                      {{
                      $t("views.main.Offlinde")
                      }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="3">
              <h3
                style="color: #606266;font-size: 13px; margin-top: 6px;"
              >{{ $t("views.main.csOnlineNumber") }} : {{ online }}</h3>
            </el-col>
            <el-col :span="5">
              <h3
                style="color: #606266;font-size: 13px; margin-top: 6px;"
              >{{ $t("views.main.memberOnline") }} : {{ useronline }}</h3>
            </el-col>
            <el-col :span="10">
              <audio controls="controls" hidden src="http://vip66741.com/aud" ref="audio"></audio>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
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
                      <el-table-column property="name" :label="$t('views.main.name')"></el-table-column>
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
                          >{{ $t("views.main.incoming") }}</el-button>
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
                    <el-table-column property="name" :label="$t('views.main.name')"></el-table-column>
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
                    <el-table-column property="no" :label="$t('views.main.inform')" width="70">
                      <template slot-scope="scope">
                        <el-badge v-if="scope.row.no != 0" :value="scope.row.no"></el-badge>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane :label="$t('views.main.todayCustomerRecord')" name="third">
                  <el-table
                    ref="singleTable"
                    :data="tableData"
                    height="640"
                    style="width: 100%;"
                    @current-change="handleRecord"
                    :row-style="{ height: '30px' }"
                  >
                    <el-table-column property="name" :label="$t('views.main.name')"></el-table-column>
                    <el-table-column property="linktime" :label="$t('views.main.lastEntry')"></el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </el-col>
            <el-col :span="12">
              <el-row style="margin-top: 10px">
                <el-col :span="4">
                  <el-button
                    size="small"
                    type="danger"
                    @click="kicked()"
                    round
                    :disabled="activeName == 'third'"
                  >{{ $t("views.main.kickMemberOut") }}</el-button>
                </el-col>
              </el-row>
              <el-row>
                <div class="container" ref="chatContent" @scroll="scrollEvent">
                  <ul v-for="(item, index) in msglist" :key="index">
                    <li v-if="item.style == 'divider'">
                      <el-divider>{{ item.msg }}</el-divider>
                    </li>
                    <li
                      v-if="
                        item.style != 'center' &&
                          item.style != 'divider' &&
                          item.image == false
                      "
                      :class="item.style"
                    >
                      <div v-if="item.fontstyle == 'fontright'">
                        <i :class="item.fontstyle">{{ item.msg }}</i>
                        <b>{{ item.name }}</b>
                        <img
                          v-if="
                            photo != '' &&
                              item.style == 'right' &&
                              activeName != 'third' &&
                              item.name == nickname
                          "
                          :src="photo"
                          class="img_bor"
                        />
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
                      v-if="
                        item.style != 'center' &&
                          item.style != 'divider' &&
                          item.image
                      "
                      :class="item.style"
                    >
                      <div v-if="item.fontstyle == 'fontright'">
                        <el-popover :placement="turn[item.style]" style="margin-right: 5px;">
                          <img :src="item.msg" style="max-width: 1300px; max-height: 900px" />
                          <img slot="reference" :src="item.msg" style="width: 100px; height: 100px" />
                        </el-popover>
                        <b>{{ item.name }}</b>
                        <img
                          v-if="
                            photo != '' &&
                              item.style == 'right' &&
                              activeName != 'third' &&
                              item.name == nickname
                          "
                          :src="photo"
                          class="img_bor"
                        />
                        <br />
                      </div>
                      <div v-if="item.fontstyle == 'fontleft'">
                        <b style="margin-right: 5px;">{{ item.name }}</b>
                        <el-popover :placement="turn[item.style]">
                          <img :src="item.msg" style="max-width: 1300px; max-height: 900px" />
                          <img slot="reference" :src="item.msg" style="width: 100px; height: 100px" />
                        </el-popover>
                        <br />
                      </div>
                      <i class="time">{{ item.curtime }}</i>
                    </li>
                    <li v-if="item.style == 'center'" :class="item.style">
                      <i :class="item.fontstyle">{{ item.msg }}</i>
                    </li>
                  </ul>
                  <br />
                  <br />
                </div>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <textarea
                    type="textarea"
                    :placeholder="$t('views.main.validateVoid')"
                    v-model="form.msg"
                    class="inputtext"
                    @keyup.ctrl.enter="lineFeed()"
                    @keyup.enter.exact="publish($event)"
                    :disabled="activeName == 'third'"
                    style="margin-left:10px;resize:none;"
                  ></textarea>
                </el-col>
                <el-col :span="2">
                  <el-popover placement="top" width="400" height="400" trigger="click">
                    <ul class="emoji-container">
                      <li
                        @click="emojiclick(item)"
                        v-for="(item, index) in emojis"
                        :key="index"
                      >{{ item }}</li>
                    </ul>
                    <el-button
                      slot="reference"
                      circle
                      :disabled="activeName == 'third'"
                      type="text"
                      style="font-size:20px"
                    >&#x1F601;</el-button>
                  </el-popover>
                </el-col>
                <el-col :span="2">
                  <el-upload
                    list-type="upload-demo"
                    action
                    :auto-upload="false"
                    :on-change="getFile"
                    :on-remove="handleRemove"
                    :limit="1"
                    accept=".jpg, .jpeg, .png, .gif, .JPG, .JPEG, .GIF"
                    ref="upload"
                    :disabled="activeName == 'third'"
                  >
                    <i class="el-icon-picture-outline uploader-icon"></i>
                  </el-upload>
                  <el-popover v-if="upfile != ''">
                    <img :src="upfile" style="max-width: 1300px; max-height: 900px" />
                    <img slot="reference" :src="upfile" style="width: 100px; height: 100px" />
                  </el-popover>
                  <br />
                </el-col>
                <el-col :span="4">
                  <el-button
                    type="primary"
                    @click="publish"
                    :disabled="activeName == 'third'"
                    style="margin-top: 8px"
                  >{{ $t("views.main.send") }}</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-row style="margin-top: 10px">
                <i
                  style="color: #606266;font-size: 13px; margin-bottom: 5px;"
                >{{ $t("views.main.cannedmessage") }}</i>
                <br />
                <el-cascader
                  :props="{ multiple: false }"
                  v-model="value"
                  :options="options"
                  expand-trigger="click"
                  size="medium"
                  style="margin-top: 5px"
                  @change="handleChange"
                ></el-cascader>
              </el-row>
              <el-row style="margin-top: 20px">
                <i
                  style="color: #606266;font-size: 13px; margin-bottom: 5px;"
                >{{ $t("views.main.csOnline") }}</i>
                <br />
                <el-select
                  v-model="csvalue"
                  :placeholder="$t('views.main.select')"
                  @change="pullcs"
                >
                  <el-option
                    v-for="item in CsTable"
                    :key="item.socketid"
                    :label="item.cs"
                    :value="{ value: item.socketid, label: item.cs }"
                  ></el-option>
                </el-select>
              </el-row>
              <el-row style="margin-top: 20px">
                <el-card class="userdetial">
                  <div slot="header" class="clearfix">
                    <span>{{ $t("views.main.member_information") }}</span>
                  </div>
                  <div>
                    <i class="el-icon-location-outline">
                      {{
                      detiallist.place
                      }}
                    </i>
                  </div>
                  <div>
                    <i>{{ $t("views.main.nickname") }} :</i>
                    <i>{{ detiallist.accountcode }}</i>
                  </div>
                  <div>
                    <i>IP{{ $t("views.main.address") }} :</i>
                    <i>{{ detiallist.ip }}</i>
                  </div>
                  <div>
                    <i>{{ $t("views.main.browser") }} :</i>
                    <i>{{ detiallist.browser }}</i>
                  </div>
                  <div>
                    <i>{{ $t("views.main.os") }} :</i>
                    <i>{{ detiallist.os }}</i>
                  </div>
                  <div>
                    <i>{{ $t("views.main.device") }} :</i>
                    <i>{{ detiallist.device }}</i>
                  </div>
                  <div v-if="activeName != 'third'">
                    <i>{{ $t("views.main.question") }} :</i>
                    <i v-if="typeof detiallist.qa != 'undefined'">
                      {{
                      $t(`views.main.${detiallist.qa}`)
                      }}
                    </i>
                  </div>
                  <div>
                    <i>{{ $t("views.main.viewport") }} :</i>
                    <i>{{ detiallist.height }} x {{ detiallist.width }}</i>
                  </div>
                </el-card>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import {
  getCanMsg,
  getCanCategory,
  getMemberMsg,
  getroom,
  getlocal,
  getemoji,
  getdetial,
} from "../api/chat";
import io from "socket.io-client";
import Cookies from "js-cookie";
export default {
  name: "others-chat",
  data() {
    return {
      busyornot: "disc",
      last: "disc",
      online: 0,
      useronline: 0,
      newtableData: [],
      tableData: [],
      mytableData: [],
      CsTable: [],
      socket: "",
      value: [],
      options: [],
      cslist: [],
      room: "",
      accountid: "",
      nickname: "",
      accountcode: "",
      photo: "",
      whichcs: "",
      filename: this.$t(`views.main.uploadPicture`),
      form: {
        msg: "",
      },
      // reloadtimer:0,
      msglist: [],
      roommsg: "",
      roomdetial: "",
      msgstyle: "",
      image: "",
      upfile: "",
      currentroom: "",
      detiallist: {},
      myroom: [], // 正在服務的room
      pretime: "1990/01/01", // 訊息日期分割線
      csvalue: "", // cs下拉選單
      activeName: "first",
      recordmsg: [],
      emojis: [],
      emojimsg: "",
      noread: [],
      scrollcnt: 0,
      srcList: [],
      turn: {
        right: "left-start",
        left: "right-start",
      },
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  created() {
    console.log("created");
    window.addEventListener("beforeunload", (e) => this.beforeunloadFn(e));
  },
  mounted() {
    // 設定emoji
    this.setemojis();
    // 會員的等待時間
    this.setTime();
    // 拿罐頭訊息
    getCanCategory({ status: 1 }).then((res) => {
      if (res !== "error") {
        res.forEach((index) => {
          this.options.push({
            value: index.value,
            label: index.value,
            id: index.id,
            children: [],
          });
        });
        getCanMsg({ status: "1" }).then((res) => {
          if (res !== "error") {
            res.forEach((index) => {
              let op_index = this.options.indexOf(
                this.options.find((v) => v.id === index.msg_categoryid)
              );
              if (op_index != -1) {
                this.options[op_index].children.push({
                  value: index.value,
                  label: index.value,
                });
              }
            });
          }
        });
      } else {
        Cookies.remove("chattoken");
        this.$router.push("/");
        this.socket.disconnect();
      }
    });
    // 初始設定
    var _this = this;
    var double = "";
    this.roommsg = new Map();
    this.roomdetial = new Map();
    this.recordmsg = new Map();
    this.noread = new Map();
    // var chat_socket = window.localStorage.getItem("chat_socketId");
    var cookie = this.getcookie();
    // 沒有登入
    // if (cookie == false) {
    if (!("chattoken" in cookie)) {
      alert(_this.$t(`views.main.notLoggedIn`));
      this.$router.push("/");
      return;
    }
    // socket連線
    this.socket = io.connect("http://vip66741.com/");
    // 判斷雙開
    this.socket.on("double", function (data) {
      console.log("double");
      console.log(data);
      double = data;
      if (data == "yes") {
        alert(_this.$t(`views.main.notSupportDoubleOpening`));
        _this.socket.disconnect();
        _this.$router.push("/");
        return;
      }
    });
    // 拿取頭貼
    this.socket.on("getpic", function (pic) {
      console.log("getpic");
      _this.photo = pic;
    });
    // 線上會員數量
    this.socket.on("user_online", function (amount) {
      console.log("user_online");
      _this.useronline = amount;
    });
    // 將會員顯示在表格內
    this.socket.on("getRoom", function (
      roomid,
      name,
      detial,
      linktime,
      service
    ) {
      console.log("getRoom");
      var accode = name.split("("); // 分割名字 ex: 帳號(信用卡綁定名稱)
      _this.getindex(_this.newtableData, roomid).then(function (index) {
        let str = service != false ? _this.$t("views.main.inService") : "";
        if (index == -1) {
          _this.newtableData.unshift({
            name: name, // 名字
            waittime: "00:00", // 等待時間-->客服進線後並開始對話後歸零
            linktime: "00:00", // 連線時間
            csinroom: [], // 那些cs在room中(目前沒用到)
            room: roomid, // room id
            no: 0, // 新訊息提醒用-->不是當下的room才會顯示
            truetime: linktime, // 會員進入聊天室的時間,用來計算 waittime 和 linktime
            reloadtime: 0, // 用來重新計算waittime
            status: 0, // 用來判斷是否要繼續計算waittime
            inroom: false, // 判斷進線按鈕是否可以按,false->可按,true->不可按
            servicestatus: str, // 線路的狀態,分服務中或空字串
          });
        }
      });
      // 會員的資訊
      let tmp = {
        name: accode[0], // 會員帳號
        ip: detial.ip, // ip地址
        qa: detial.qa, // question
        os: detial.os, // 操作系統
        browser: detial.browser, // 瀏覽器
        device: detial.device, // 設備
        height: detial.height, // 高
        width: detial.width, // 寬
        lasttime: linktime,
      };
      getlocal(tmp).then(
        // 取的會員所在的位置 ex: ["中國","某地","某地"]
        (res) => {
          if (res !== "error") {
            var obj = JSON.parse(res);
            detial["accountcode"] = accode[0];
            detial["place"] = _this.getlocalvalue(obj);
            if (!_this.roomdetial.has(roomid)) {
              _this.roomdetial.set(roomid, new Set());
              _this.roomdetial.get(roomid).add(detial);
            }
            if (_this.myroom.length == 1) {
              _this.detiallist = detial;
            }
          }
        }
      );
      // tab跳轉,有人進線就跳到接線大廳
      _this.activeName = "first";
    });
    // 取的所有的客服
    this.socket.on("getallcs", function (socketId, name, bu) {
      console.log("getallcs");
      if (socketId != _this.socket.id && bu != 2) {
        // 不是本客服且客服不為離線
        _this.CsTable.unshift({
          cs: name,
          socketid: socketId,
        });
      }
    });
    // 設定mid
    this.socket.on("getMid", function (managerid) {
      console.log("getMid");
      _this.accountid = managerid;
    });
    // user離開,刪除table的值
    this.socket.on("userleave", function (roomid) {
      console.log("userleave");
      // 從接線大廳刪除
      _this.getindex(_this.newtableData, roomid).then(function (index) {
        if (index != -1) {
          _this.newtableData.splice(index, 1);
        }
      });
      // 從我的線上客戶刪除
      _this.getindex(_this.mytableData, roomid).then(function (index) {
        if (index != -1) {
          _this.mytableData.splice(index, 1);
        }
      });
      // 從myroom中移除
      var index = _this.myroom.indexOf(roomid);
      if (index != -1) {
        _this.myroom.splice(index, 1);
      }
      // 從roommsg中移除
      if (_this.roommsg.has(roomid)) {
        _this.roommsg.delete(roomid);
      }
      // 設定現在的所在的room
      if (_this.currentroom == roomid) {
        _this.currentroom = "";
      }
    });
    // cs離開,刪除table的值
    this.socket.on("csleave", function (socketid) {
      console.log("csleave");
      _this.getindexforcstable(socketid).then(function (index) {
        if (index != -1) {
          _this.CsTable.splice(index, 1);
        }
      });
    });
    // 接收訊息
    this.socket.on("msgReceived", function (name, data, roomid, pic, time) {
      console.log("msgReceived");
      if (data.msg.indexOf(_this.nickname) != -1) {
        return;
      }
      var msgstyle = "";
      var da = "";
      if (name == _this.nickname) {
        // 本客服
        msgstyle = "right";
      } else if (name != "System") {
        // 會員
        _this.play();
        msgstyle = "left";
      } else if (name == "System") {
        // 系統
        msgstyle = "center";
      }
      if (data.msg.indexOf("0x1") != -1 && _this.checkImg(data.msg) == false) {
        data.msg = _this.getemoji(data.msg);
      }
      da = {
        curtime: time, // 訊息的時間
        name: name, // 名稱
        msg: data.msg, // 訊息內容
        style: msgstyle, // 至左還是至右
        fontstyle: "font" + msgstyle, // 訊息的style
      };
      da["image"] = _this.checkImg(data.msg); // 是否是圖片
      if (_this.currentroom == roomid) {
        // 在現在服務的room中
        if (_this.checkImg(data.msg) == true) {
          _this.srcList.push(data.msg);
        }
        _this.msglist.push(da);
      } else {
        // 不在現在服務的room中
        _this.getindex(_this.mytableData, roomid).then(function (index) {
          // 有傳訊息的放到第一個
          if (index != -1 && name != "System") {
            // 有在myroom中且不是系統訊息
            _this.mytableData[index].no += 1; // 通知+1
            // 移動有訊息的room到最上方
            let turn = _this.mytableData[index];
            _this.mytableData.splice(index, 1);
            _this.mytableData.unshift(turn);
          }
        });
        // 未讀訊息
        if (!_this.noread.has(roomid) && name != "System") {
          _this.noread.set(roomid, new Set());
          if (_this.roommsg.has(roomid)) {
            let cnt = _this.roommsg.get(roomid).size;
            _this.noread.get(roomid).add(cnt);
            _this.roommsg.get(roomid).add({
              msg: _this.$t("views.main.unReadMessage"),
              style: "divider",
            });
          }
        }
      }
      // 增加訊息到roommsg內
      if (_this.roommsg.has(roomid)) {
        _this.roommsg.get(roomid).add(da);
      }
      _this.scrollToBottom();
      _this.activeName = "second";
    });
    // 通知cs已進入room
    this.socket.on("notic_getinroom", function (roomid) {
      console.log("notic_getinroom");
      if (_this.myroom.indexOf(roomid) == -1) {
        // 放到myroom中
        _this.myroom.push(roomid);
      }
      if (_this.myroom.length == 1) {
        // 如果myroom中只有一個room,設定現在的room為roomid
        _this.currentroom = roomid;
      }
      _this.getindex(_this.newtableData, roomid).then(function (index) {
        if (index != -1) {
          // 在接線大廳中
          var data = _this.newtableData[index];
          data.no = 0;
          data.inroom = true;
          _this.getindex(_this.mytableData, roomid).then(function (index) {
            if (index == -1) {
              _this.mytableData.unshift(data);
              if (_this.mytableData.length == 1 && _this.roommsg.has(roomid)) {
                // 拿到聊天紀錄
                _this.msglist = [];
                _this.srcList = [];
                _this.roommsg.get(roomid).forEach((value) => {
                  if (_this.checkImg(value.msg) == true) {
                    _this.srcList.push(value.msg);
                  }
                  _this.msglist.push(value);
                  _this.scrollToBottom();
                });
              }
            }
          });
          if (_this.roomdetial.has(roomid)) {
            // 會員的資訊
            let str = _this.roomdetial.get(roomid).values();
            _this.detiallist = str.next().value;
          }
          _this.newtableData[index].servicestatus = _this.$t(
            "views.main.inService"
          );
          _this.activeName = "second"; // 移至我的線上客戶
        }
      });
    });
    // 若會員有已接線的cs，設定有服務中
    this.socket.on("getuserservice", function (roomid, color) {
      console.log("getuserservice");
      _this.getindex(_this.newtableData, roomid).then(function (index) {
        if (index != -1) {
          if (color == true) {
            _this.newtableData[index].servicestatus = _this.$t(
              "views.main.inService"
            );
          } else if (color == false) {
            _this.newtableData[index].servicestatus = "";
          }
        }
      });
    });
    // 設定暱稱跟帳號
    this.socket.on("getNickname", function (nickname, accountcode) {
      console.log("getNickname");
      _this.nickname = nickname;
      _this.accountcode = accountcode;
    });
    // room中的客服(現在沒有用)
    this.socket.on("whichcsinroom", function (csname, roomid) {
      console.log("whichcsinroom");
      _this.getindex(_this.newtableData, roomid).then(function (index) {
        if (index != -1) {
          _this.newtableData[index].csinroom.push(csname);
          _this.newtableData[index].servicestatus = _this.$t(
            "views.main.inService"
          );
        }
      });
    });
    // 通知某個cs離開room(現在沒用了)
    this.socket.on("delcsinroom", function (csname, roomid, socketid) {
      console.log("delcsinroom");
      if (socketid != _this.socket.id) {
        _this.getindex(_this.newtableData, roomid).then(function (index) {
          if (index != -1) {
            // 把csinroom的cs拿掉
            let indexcs = _this.newtableData[index].csinroom.indexOf(csname);
            _this.newtableData[index].csinroom.splice(indexcs, 1);
            if (_this.newtableData[index].csinroom.length == 0) {
              _this.newtableData[index].servicestatus = "";
            }
          }
        });
      }
    });
    // 對應的chat_socket
    // this.socket.emit("correspond", chat_socket);
    // 斷線設置
    this.socket.on("disconnect", function () {
      console.log(double);
      console.log("disconnect");
      if (double == "yes") {
        _this.tableData = [];
        _this.CsTable = [];
        _this.useronline = 0;
        _this.online = 0;
      }
      _this.busyornot = "disc";
    });
    // 進入socket設置的房間
    this.socket.on("join", function (roomid) {
      console.log("join");
      _this.socket.emit("joinRoom", roomid);
    });
    // cs在線人數
    this.socket.on("csonline", function (amount) {
      console.log("csonline");
      _this.online = amount;
    });
    // 設定cs狀態
    this.socket.emit("getbusy", _this.busyornot, cookie);
    // 取得聊天紀錄
    this.socket.on("getRecord", function (record, roomid) {
      if (record) {
        if (_this.currentroom == roomid) {
          _this.msglist = [];
        }
        _this.pretime = "1990-01-01";
        if (!_this.roommsg.has(roomid)) {
          _this.roommsg.set(roomid, new Set());
        } else {
          _this.roommsg.delete(roomid);
          _this.roommsg.set(roomid, new Set());
        }
        if (_this.currentroom == roomid && _this.myroom.length == 1) {
          _this.msglist = [];
        }
        for (let key of record) {
          _this.addRecord(key, roomid);
        }
      }
    });
    // cstable的狀態改變
    this.socket.on("cschangestatus", function (socketid, bu, name) {
      console.log("cschangestatus");
      if (socketid != _this.socket.id) {
        _this.getindexforcstable(socketid).then(function (index) {
          if (index != -1 && bu == 2) {
            // 客服離線，刪除在在線客服中的客服
            _this.CsTable.splice(index, 1);
          } else if (index == -1 && bu != 2) {
            // 客服手動或自動接線
            _this.CsTable.push({
              cs: name,
              socketid: socketid,
            });
          }
        });
      }
    });
    // 設定等待時間 (客服有回應客戶，就會設置waittime為00:00)
    this.socket.on("setwaittime", function (roomid) {
      console.log("setwaittime");
      _this.getindex(_this.newtableData, roomid).then(function (index) {
        if (index != -1) {
          _this.newtableData[index].status = 1;
          _this.newtableData[index].waittime = "00:00";
          _this.newtableData[index].reloadtime = 0;
        }
      });
      _this.getindex(_this.mytableData, roomid).then(function (index) {
        if (index != -1) {
          _this.mytableData[index].status = 1;
          _this.mytableData[index].waittime = "00:00";
          _this.mytableData[index].reloadtime = 0;
        }
      });
    });
    // 用戶有傳訊息, 重新計算waittime
    this.socket.on("reloadtime", function (roomid) {
      console.log("reloadtime");
      _this.getindex(_this.newtableData, roomid).then(function (index) {
        if (
          index != -1 &&
          _this.newtableData[index].status == 1 &&
          _this.newtableData[index].reloadtime == 0
        ) {
          _this.newtableData[index].reloadtime = Date.parse(new Date());
        }
      });
      _this.getindex(_this.mytableData, roomid).then(function (index) {
        if (
          index != -1 &&
          _this.mytableData[index].status == 1 &&
          _this.mytableData[index].reloadtime == 0
        ) {
          _this.mytableData[index].reloadtime = Date.parse(new Date());
        }
      });
    });
    // 計算等待跟連線時間用
    setInterval(this.getallsubtime(), 1000);
  },
  beforeDestroy() {
    console.log("disconnect1");
    this.beforeunloadFn();
    // this.socket.disconnect();
  },
  methods: {
    handleRemove() {
      console.log("handleRemove");
      this.upfile = "";
    },
    // 自動下滾到訊息最底
    scrollToBottom() {
      console.log("scrollToBottom");
      this.$nextTick(() => {
        this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight;
      });
    },
    // 點擊已接線會員切換聊天室 (若有未讀訊息，則在滾動或客服回訊息時會消失)
    handleCurrentChange(val) {
      console.log("handleCurrentChange");
      this.scrollcnt = 0;
      var _this = this;
      if (val === null || val.room === this.currentroom) {
        // 當前的聊天室
        return;
      }
      this.msglist = [];
      this.srcList = [];
      this.detiallist = {};
      if (this.roommsg.has(val.room)) {
        // 會員聊天紀錄
        this.roommsg.get(val.room).forEach((value) => {
          if (this.checkImg(value.msg) == true) {
            this.srcList.push(value.msg);
          }
          this.msglist.push(value);
        });
      }
      if (this.roomdetial.has(val.room)) {
        // 會員的資料
        let turn = this.roomdetial.get(val.room).values();
        turn = turn.next().value;
        this.detiallist = turn;
      }
      this.getindex(this.mytableData, val.room).then((index) => {
        if (index != -1) {
          _this.mytableData[index].no = 0;
        }
      });
      this.currentroom = val.room;
      this.scrollToBottom();
    },
    // 新進線會員閃光提醒
    tableNotice({ row }) {
      // console.log("tableNotice");
      if (row.notice != 0 && row.inroom == false && row.servicestatus == "") {
        return "warning-row";
      }
      return "";
    },
    // cs的cookie分割
    getcookie() {
      console.log("getcookie");
      let array = document.cookie.split("; "); // 分割cookie
      var res = {};
      array.forEach((id) => {
        let change = id.split("=");
        res[change[0]] = change[1];
      });
      return res;
    },
    // 轉換cs的status
    statuschange(val) {
      console.log("statuschange");
      if (this.myroom.length > 0 && val == "disc") {
        // 接線中點選離線
        this.busyornot = this.last;
        this.$message({
          type: "info",
          message: this.$t("views.main.canNotOfflineDuringWiring"),
        });
        return;
      }
      let nowstatus = this.last;
      this.socket.emit("getbusyvalue", val, nowstatus, this.nickname);
      this.last = val;
    },
    // 剔除會員
    kicked() {
      console.log("kicked");
      this.socket.emit("kickeduser", this.currentroom);
    },
    // cs進入room
    getinroom(data) {
      console.log("getinroom");
      var _this = this;
      if (this.busyornot === "disc") {
        this.$message({
          type: "info",
          message: this.$t("views.main.canNotConnectDuringOffline"),
        });
        return;
      } else {
        if (this.myroom.indexOf(data.room) == -1) {
          this.myroom.push(data.room);
        }
        this.getindex(this.newtableData, data.room).then(function (index) {
          if (index != -1) {
            _this.newtableData[index].inroom = true;
            _this.newtableData[index].servicestatus = _this.$t(
              "views.main.inService"
            );
          }
        });
        data["no"] = 0;
        data["inroom"] = true;
        if (this.roomdetial.has(data.room) && this.myroom.length == 1) {
          let turn = this.roomdetial.get(data.room).values();
          this.detiallist = turn.next().value;
        }
        if (this.myroom.length == 1 && this.roommsg.has(data.room)) {
          this.msglist = [];
          this.srcList = [];
          this.roommsg.get(data.room).forEach((value) => {
            if (this.checkImg(value.msg) == true) {
              this.srcList.push(value.msg);
            }
            this.msglist.push(value);
            this.scrollToBottom();
          });
        }
        this.getindex(this.mytableData, data.room).then(function (index) {
          if (index == -1) {
            _this.mytableData.unshift(data);
          }
        });
        if (this.myroom.length == 1) {
          this.currentroom = data.room;
        }
        this.socket.emit("getInRoom", data.room, this.nickname, this.busyornot);
        this.activeName = "second";
      }
    },
    // 發送訊息
    publish() {
      console.log("publish");
      if (this.currentroom == "") {
        this.form.msg = "";
        return;
      }
      var currenttime = this.getDate("");
      var nowtime = currenttime.split(" ");
      var _this = this;
      if (this.accountid.length == 0) {
        this.accountid = null;
      }
      if (this.upfile != "") {
        this.socket.emit(
          "publish",
          this.currentroom,
          this.upfile,
          this.photo,
          nowtime[1]
        );
        this.socket.emit(
          "insertcontent",
          this.currentroom,
          this.upfile,
          currenttime
        );
      }
      if (this.form.msg != "") {
        this.socket.emit(
          "publish",
          this.currentroom,
          this.form.msg,
          this.photo,
          nowtime[1]
        ); //傳送資料給server
        this.form.msg = this.getformmsgemoji();
        this.socket.emit(
          "insertcontent",
          this.currentroom,
          this.form.msg,
          currenttime
        );
      }
      if (this.form.msg != "" && this.upfile != "") {
        this.getindex(this.mytableData, this.currentroom).then(function (
          index
        ) {
          if (index != -1) {
            _this.mytableData[index].status = 1;
            _this.mytableData[index].waittime = "00:00";
          }
        });
      }
      if (this.noread.has(this.currentroom)) {
        let cnt = this.noread.get(this.currentroom).values().next().value;
        let nodata = this.msglist[cnt];
        this.msglist.splice(cnt, 1);
        this.roommsg.get(this.currentroom).delete(nodata);
        this.noread.delete(this.currentroom);
      }
      this.form.msg = "";
      this.upfile = "";
      this.$refs.upload.clearFiles();
    },
    // 判斷圖有沒有超過300kb，並把圖轉成base64輸出
    getFile(file) {
      console.log("getfile");
      let maxsize = 1024 * 300; // 300KB
      if (file.size > maxsize) {
        this.$message({
          message: this.$t("views.main.pic_should_not_bigger_than") + "300KB",
          type: "warning",
        });
        this.$refs.upload.clearFiles();
      } else {
        this.getBase64(file.raw).then((res) => {
          this.upfile = res;
          this.form.msg + "\n" + res;
          // this.form.msg
        });
      }
    },
    // 把圖轉乘base64
    getBase64(file) {
      console.log("getbase64");
      return new Promise(function (resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function () {
          imgResult = reader.result;
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.onloadend = function () {
          resolve(imgResult);
        };
      });
    },
    // 設定會員紀錄
    addRecord(index, roomid) {
      console.log("addrecord");
      let currenttime = this.getDate(index.created_at);
      let nowtime = currenttime.split(" ");
      if (nowtime[0] != this.pretime) {
        let timeda = {
          msg: nowtime[0],
          style: "divider",
        };
        this.pretime = nowtime[0];
        this.roommsg.get(roomid).add(timeda);
        if (this.currentroom == roomid && this.myroom.length == 1) {
          this.msglist.push(timeda);
        }
      }
      var chat_name = "";
      var msgstyle = "";
      if (typeof index.mid == "string" && index.mid !== "") {
        chat_name = index.mid;
        msgstyle = "right";
      } else if (typeof index.uid == "string" && index.uid !== "") {
        console.log(index.ui);
        chat_name = index.uid;
        msgstyle = "left";
      } else {
        chat_name = "User";
        msgstyle = "left";
      }
      if (
        index.content.indexOf("0x1") != -1 &&
        this.checkImg(index.content) == false
      ) {
        index.content = this.getemoji(index.content);
      }
      let da = {
        curtime: currenttime,
        name: chat_name,
        msg: index.content,
        style: msgstyle,
        fontstyle: "font" + msgstyle,
      };
      da["image"] = this.checkImg(index.content);
      this.roommsg.get(roomid).add(da);
      if (this.currentroom == roomid && this.myroom.length == 1) {
        if (this.checkImg(da.msg) == true) {
          this.srcList.push(da.msg);
        }
        this.msglist.push(da);
      }
      this.scrollToBottom();
    },
    // 訊息時間
    getDate(indate) {
      console.log("getdate");
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
      // var date = hour + ':' + min;
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
    // 搜尋new/mytable裡對應roomid的index
    getindex(table, roomid) {
      console.log("getindex");
      return new Promise((resolve) => {
        var count = 0;
        table.forEach((value, index) => {
          if (value.room == roomid) {
            resolve(index);
          } else {
            count++;
          }
        });
        if (count == table.length) {
          resolve(-1);
        }
      });
    },
    // 搜尋cstable裡對應cs的index
    getindexforcstable(socketid) {
      console.log("getindexforcstable");
      var _this = this;
      var skid = socketid;
      return new Promise((resolve) => {
        var count = 0;
        _this.CsTable.forEach((value, index) => {
          if (value.socketid == skid) {
            resolve(index);
          } else {
            count++;
          }
        });
        if (count == _this.CsTable.length) {
          resolve(-1);
        }
      });
    },
    // 轉換時間
    gettimesub(faultDate) {
      // console.log("gettimesub");
      var stime = faultDate;
      var etime = Date.parse(new Date());
      var usedTime = etime - stime;
      var min = Math.floor(usedTime / (60 * 1000));
      var leave1 = usedTime % (60 * 1000);
      var sec = Math.floor(leave1 / 1000);
      if (min / 10 < 1) {
        min = "0" + min;
      }
      if (sec / 10 < 1) {
        sec = "0" + sec;
      }
      var time = min + ":" + sec;
      return time;
    },
    // 計算等待時間跟連線時間
    getallsubtime() {
      // console.log("getallsubtime")
      if (this.newtableData.length != 0) {
        this.newtableData.forEach((value, index) => {
          if (typeof value != "undefined") {
            let subtime = this.gettimesub(value.truetime);
            this.newtableData[index].linktime = subtime;
            if (value.status == 0) {
              this.newtableData[index].waittime = subtime;
            }
            if (value.reloadtime != 0) {
              let reload = this.gettimesub(value.reloadtime);
              this.newtableData[index].waittime = reload;
            }
          }
        });
      }
      if (this.mytableData.length != 0) {
        this.mytableData.forEach((value, index) => {
          if (typeof value !== "undefined") {
            let subtime = this.gettimesub(value.truetime);
            this.mytableData[index].linktime = subtime;
            if (value.status == 0) {
              this.mytableData[index].waittime = subtime;
            }
            if (value.reloadtime != 0) {
              let reload = this.gettimesub(value.reloadtime);
              this.mytableData[index].waittime = reload;
            }
          }
        });
      }
    },
    timer() {
      let my = this;
      this.time = setInterval(() => {
        my.getallsubtime();
      }, 1000);
    },
    setTime() {
      this.timer();
    },
    stopTime() {
      if (this.time) {
        clearInterval(this.time);
      }
    },
    // 拉cs進線
    pullcs(rowdata) {
      if (this.currentroom != "") {
        this.socket.emit(
          "cspull",
          rowdata.value,
          this.currentroom,
          rowdata.label
        );
      }
      this.csvalue = "";
    },
    // ctrl + enter換行
    lineFeed() {
      this.form.msg = this.form.msg + "\n";
    },
    // 判斷是否是圖片
    checkImg(data) {
      let array = data.split(",", 2);
      var string = "";
      if (array[0].indexOf("data:image/") == -1) {
        return false;
      }
      try {
        string = btoa(atob(array[1]));
      } catch (e) {
        return false;
      }
      if (string == array[1]) {
        return true;
      }
      return false;
    },
    // 點擊罐頭訊息並放到輸入內容中
    handleChange(value) {
      if (this.currentroom != "") {
        this.form.msg += value[1];
      }
      this.value = [];
    },
    // 訊息進來的提示音
    play() {
      this.$refs.audio.currentTime = 0; //从头开始播放提示音
      this.$refs.audio.play(); //播放
      setTimeout(() => {
        this.stop();
      }, 1000);
    },
    // 關閉提示音
    stop() {
      this.$refs.audio.pause();
      this.$refs.audio.get = 0;
    },
    // 拿取今天有紀錄的所有roomid
    handleClick() {
      console.log("handleClick");
      let _this = this;
      if (this.activeName == "third") {
        let date2 = new Date();
        let date = [
          `${date2.getFullYear()}-${date2.getMonth() + 1}-${date2.getDate()}`,
          `${date2.getFullYear()}-${date2.getMonth() + 1}-${date2.getDate()}`,
        ];
        let tmp = {
          stime: date[0],
          etime: date[1],
        };
        getroom(tmp).then((res) => {
          if (res !== "error") {
            res.forEach((x) => {
              this.getindex(this.tableData, x.room).then(function (index) {
                _this
                  .getindex(_this.newtableData, x.room)
                  .then(function (index2) {
                    let truetime = 0;
                    if (index2 != -1) {
                      truetime = 1;
                    }
                    let lt = "";
                    if (x.lasttime != false) {
                      lt = _this.getDate(parseInt(x.lasttime));
                    }
                    if (index == -1) {
                      _this.tableData.push({
                        name: x.uid,
                        room: x.room,
                        linktime: lt,
                        truetime: truetime,
                      });
                    }
                  });
              });
            });
          }
        });
      } else {
        if (this.currentroom != "" && this.roommsg.has(this.currentroom)) {
          this.msglist = [];
          this.srcList = [];
          this.roommsg.get(this.currentroom).forEach((value) => {
            if (this.checkImg(value.msg) == true) {
              this.srcList.push(value.msg);
            }
            this.msglist.push(value);
            this.scrollToBottom();
          });
        }
      }
    },
    // 拿取今天有客戶紀錄
    handleRecord(data) {
      console.log("handleRecord");
      this.msglist = [];
      this.srcList = [];
      let date2 = new Date();
      let date = [
        `${date2.getFullYear()}-${date2.getMonth() + 1}-${date2.getDate()}`,
        `${date2.getFullYear()}-${date2.getMonth() + 1}-${date2.getDate()}`,
      ];
      if (data.truetime != 0 || !this.recordmsg.has(data.room)) {
        if (!this.recordmsg.has(data.room)) {
          this.recordmsg.set(data.room, new Set());
        }
        let tmp = {
          room: data.room,
          stime: date[0],
          etime: date[1],
        };
        getMemberMsg(tmp).then((res) => {
          if (res !== "error") {
            for (let x in res) {
              let da = "";
              let time = res[x].created_at.split(" ");
              if (time[0] != this.msgtime) {
                da = {
                  style: "divider",
                  msg: time[0],
                };
                this.recordmsg.get(data.room).add(da);
                this.msglist.push(da);
                this.msgtime = time[0];
              }
              if (typeof res[x].mid == "string" && res[x].mid !== "") {
                if (
                  res[x].content.indexOf("0x1") != -1 &&
                  this.checkImg(res[x].content) == false
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
                if (this.checkImg(res[x].content) == true) {
                  this.srcList.push(res[x].content);
                }
                da["image"] = this.checkImg(res[x].content);
                this.recordmsg.get(data.room).add(da);
                this.msglist.push(da);
              } else if (typeof res[x].uid == "string" && res[x].uid !== "") {
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
                da["image"] = this.checkImg(res[x].content);
                if (this.checkImg(res[x].content) == true) {
                  this.srcList.push(res[x].content);
                }
                this.recordmsg.get(data.room).add(da);
                this.msglist.push(da);
              }
            }
            this.scrollToBottom();
          }
        });
      } else {
        this.recordmsg.get(data.room).forEach((value) => {
          if (this.checkImg(value.msg) == true) {
            this.srcList.push(value.msg);
          }
          this.msglist.push(value);
          this.scrollToBottom();
        });
      }
      this.getroomdetial(data);
    },
    // 判斷字串中是否有16進制emoji字串，並將他轉成emoji
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
          if (!isNaN(test)) {
            final += first + String.fromCodePoint(test); //+ third;
          }
          str = third;
          index = str.indexOf("0x1");
        } while (index != -1);
        final += third;
      } else {
        final = str;
      }
      return final;
    },
    // 拿取資料庫中的emoji
    setemojis() {
      getemoji().then((res) => {
        if (res !== "error") {
          for (let x in res) {
            let str = String.fromCodePoint(res[x]);
            this.emojis.push(str);
          }
        } else {
          Cookies.remove("chattoken");
          this.$router.push("/");
          this.socket.disconnect();
        }
      });
    },
    // 判斷輸入的文字有無emoji，並將emoji轉成16進制字串
    getformmsgemoji() {
      var index = this.form.msg.search(
        /\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g
      );
      var str = this.form.msg;
      var final = "";
      var third = "";
      if (index != -1) {
        do {
          let first = "";
          let test = "";
          first = str.substr(0, index);
          test = str.substr(index, 2);
          third = str.substr(index + 2);
          final += first + "0x" + this.emojiUnicode(test); //+ third;
          str = third;
          index = str.search(
            /\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g
          );
        } while (index != -1);
        final += third;
      } else {
        final = this.form.msg;
      }
      return final;
    },
    // 點擊emoji加到輸入內容中
    emojiclick(data) {
      this.form.msg += data;
    },
    // 把emoji轉成16進制字串
    emojiUnicode(emoji) {
      var comp;
      if (emoji.length === 1) {
        comp = emoji.charCodeAt(0);
      }
      comp =
        (emoji.charCodeAt(0) - 0xd800) * 0x400 +
        (emoji.charCodeAt(1) - 0xdc00) +
        0x10000;
      if (comp < 0) {
        comp = emoji.charCodeAt(0);
      }
      return comp.toString("16");
    },
    beforeunloadFn() {
      console.log("beforeunloadFn");
      if (this.socket !== "") {
        this.socket.disconnect();
      }
    },
    // 拿取會員的資訊
    getroomdetial(data) {
      console.log("getroomdetial");
      this.detiallist = {};
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
          if (res !== "error") {
            var obj = JSON.parse(res[0].area);
            var area = this.getlocalvalue(obj);
            res[0]["place"] = area;
            res[0]["accountcode"] = res[0].name;
            this.roomdetial.get(data.room).add(res[0]);
            this.detiallist = res[0];
          }
        });
      }
    },
    // 會員資訊的位置
    getlocalvalue(obj) {
      console.log("getlocalvalue");
      let ary = [];
      obj.forEach((value) => {
        if (value != "") {
          ary.push(value);
        }
      });
      var area = "";
      if (ary.length == 3) {
        if (ary[1] == "台湾") {
          area = ary[2] + " , " + ary[1];
        } else {
          area = ary[2] + " , " + ary[1] + " , " + ary[0];
        }
      } else if (ary.length == 2) {
        area = ary[1] + " , " + ary[0];
      } else if (ary.length == 1) {
        area = ary[0];
      } else if (ary.length == 4) {
        area = ary[3] + " , " + ary[2] + " , " + ary[1] + " , " + ary[0];
      }
      return area;
    },
    // 滾動事件，用來讓未讀訊息消失的
    scrollEvent() {
      if (
        this.scrollcnt == 50 &&
        this.noread.has(this.currentroom) &&
        this.activeName != "third"
      ) {
        let cnt = this.noread.get(this.currentroom).values().next().value;
        let nodata = this.msglist[cnt];
        this.msglist.splice(cnt, 1);
        this.roommsg.get(this.currentroom).delete(nodata);
        this.noread.delete(this.currentroom);
      }
      this.scrollcnt++;
    },
  },
  destroyed() {
    console.log("destroyed");
    window.removeEventListener("beforeunload", (e) => this.beforeunloadFn(e));
  },
};
</script>
<style>
.el-table .warning-row {
  animation-name: blink;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}
@keyframes blink {
  0% {
    background: #ffeedd;
  }
  50% {
    background: #ffbb77;
  }
  100% {
    background: #ffeedd;
  }
}
ul {
  list-style: none;
  padding: 0;
  margin: 0 auto;
}
.container {
  margin-top: 15px;
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 10px;
  height: 570px;
  overflow-y: scroll;
  overflow-x: hide;
  border: 2px solid gainsboro;
  border-radius: 5px;
  white-space: pre-line;
}
.container li.left .time,
.container li.right .time {
  font-size: 14px;
  display: inline-block;
}
.container li.right .time {
  color: #5985b2;
  margin-right: 3px;
}
.container li.left .time {
  color: #898989;
}
.container li.left b,
.container li.right b {
  font-weight: bold;
  margin-bottom: 5px;
  display: inline-block;
  font-size: 14px;
}
.container li.right b {
  color: #5985b2;
}
.container li.left b {
  color: #898989;
}
.userdetial {
  margin-top: 5px;
  height: 300px;
}
.userdetial div {
  margin-top: 2px;
}
.inputtext {
  margin-top: 5px;
  margin-bottom: 5px;
  width: 90%;
  font-size: 14px;
}
.container li {
  margin-top: 25px;
  margin-left: 25px;
  margin-right: 25px;
  overflow: hidden;
}
.container .right {
  text-align: right;
}
.container .left {
  text-align: left;
}
.container .center {
  text-align: center;
}
.imagestyle {
  width: 150px;
  height: 150px;
}
.container i {
  display: block;
  margin-bottom: 10px;
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
.img_bor {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  margin-top: 8px;
}
.emoji-container {
  height: 140px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}
.emoji-container li {
  float: left;
  width: 40px;
  line-height: 36px;
  font-size: 30px;
  padding: 5px;
}
img .msg_img {
  width: 86%;
}
</style>
