/**
 * api管理
 */
import request from "./../utils/request"
export default {
  login(params) {
    return request({
      url: "/users/login",
      method: "post",
      data: params,
      mock: true,
    })
  },
  noticeCount() {
    return request({
      url: "/leave/count",
      method: "get",
      data: {},
      mock: false,
    })
  },
  menuList(data) {
    return request({
      url: "/menu/list",
      method: "get",
      data,
      // mock: true
    })
  },
  permissionList() {
    return request({
      url: "/users/getPremissionList",
      method: "get",
      data: {},
      // mock: true,
    })
  },
  userList(params) {
    return request({
      url: "/users/list",
      method: "get",
      data: params,
      // mock: false
    })
  },
  userAllList() {
    return request({
      url: "/users/all/list",
      method: "get",
      mock: false,
    })
  },
  userDelete(params) {
    return request({
      url: "/users/delete",
      method: "post",
      data: params,
      mock: false,
    })
  },
  getRoleList() {
    return request({
      url: "/roles/allList",
      method: "get",
      mock: false,
    })
  },
  getDeptList(params) {
    return request({
      url: "/dept/list",
      method: "get",
      data: params,
      mock: false,
    })
  },
  userSubmit(params) {
    return request({
      url: "/users/operate",
      method: "post",
      // mock: true,
      data: params,
    })
  },
  menuSubmit(params) {
    return request({
      url: "/menu/operate",
      method: "post",
      data: params,
    })
  },
  roleList(params) {
    return request({
      url: "/roles/list",
      method: "get",
      data: params,
      mock: false,
    })
  },
  roleOperate(params) {
    return request({
      url: "/roles/operate",
      method: "post",
      data: params,
      mock: false,
    })
  },
  updatePermission(params) {
    return request({
      url: "/roles/update/permission",
      method: "post",
      data: params,
      mock: false,
    })
  },
  deptOperate(params) {
    return request({
      url: "/dept/operate",
      method: "post",
      data: params,
      mock: false,
    })
  },
  // 审批列表
  getApplyList(params) {
    return request({
      url: "/leave/list",
      method: "get",
      data: params,
      mock: false,
    })
  },
  leaveOperate(params) {
    return request({
      url: "/leave/operate",
      method: "post",
      data: params,
      mock: false,
    })
  },
  leaveApprove(params) {
    return request({
      url: "/leave/approve",
      method: "post",
      data: params,
      mock: false,
    })
  },
}
