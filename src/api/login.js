import request from "../plugins/axios";

export function login(data) {
  return request({
    url: "/login",
    method: "post",
    data,
  });
}
