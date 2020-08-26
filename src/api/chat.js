import request from "../plugins/axios";

export function getCanCategory(data) {
  return request({
    url: "/listchatcategory",
    method: "post",
    data,
  });
}

export function editCanCategory(data) {
  return request({
    url: "/editchatcategory",
    method: "post",
    data,
  });
}

export function addChatCategory(data) {
  return request({
    url: "/addchatcategory",
    method: "post",
    data,
  });
}

export function categoryChangeSort(data) {
  return request({
    url: "/categorychangesort",
    method: "post",
    data,
  });
}

export function getCanMsg(data) {
  return request({
    url: "/listcscanmsg",
    method: "post",
    data,
  });
}

export function editCanMsg(data) {
  return request({
    url: "/editcscanmsg",
    method: "post",
    data,
  });
}

export function canMsgChangeSort(data) {
  return request({
    url: "/canmsgchangesort",
    method: "post",
    data,
  });
}

export function addCanMsg(data) {
  return request({
    url: "/addcanmsg",
    method: "post",
    data,
  });
}

export function listSysMsg(data) {
  return request({
    url: "/listcanmsg",
    method: "post",
    data,
  });
}

export function editSysMsg(data) {
  return request({
    url: "/editcanmsg",
    method: "post",
    data,
  });
}

export function getMemberMsg(data) {
  return request({
    url: "/getchatmsg",
    method: "post",
    data,
  });
}

export function listremark(data) {
  return request({
    url: "/chataudit",
    method: "post",
    data,
  });
}

export function getroom(data) {
  return request({
    url: "/getroom",
    method: "post",
    data,
  });
}

export function getdetial(data) {
  return request({
    url: "/getdetial",
    method: "post",
    data,
  });
}
