/**
 * api管理
 */
import request from "./../utils/request"
export default {
  login(params) {
    return request({
      url: "/user/login",
      method: "post",
      data: params,
      mock: false,
    })
  },
  noticeCount() {
    return request({
      url: "/leave/count",
      method: "get",
      data: {},
      mock: true,
    })
  },
  menuList(data) {
    return request({
      url: "/menu/list",
      method: "get",
      data,
      mock: false,
    })
  },
  permissionList() {
    return request({
      url: "/user/getPremissionList",
      method: "get",
      data: {},
      mock: false,
    })
  },
  userList(params) {
    return request({
      url: "/user/list",
      method: "get",
      data: params,
      mock: false,
    })
  },
  userAllList() {
    return request({
      url: "/user/all/list",
      method: "get",
      mock: false,
    })
  },
  userDelete(params) {
    return request({
      url: "/user/delete",
      method: "post",
      data: params,
      mock: false,
    })
  },
  getRoleList(params) {
    return request({
      url: "/role/allList",
      method: "get",
      data: params,
      mock: false,
    })
  },
  getDeptList(params) {
    return request({
      url: "/dept/list",
      method: "get",
      data: params,
      mock: true,
    })
  },
  userSubmit(params) {
    return request({
      url: "/user/operate",
      method: "post",
      data: params,
      mock: false,
    })
  },
  menuSubmit(params) {
    return request({
      url: "/menu/operate",
      method: "post",
      data: params,
      mock: false,
    })
  },
  roleList(params) {
    return request({
      url: "/role/list",
      method: "get",
      data: params,
      mock: false,
    })
  },
  roleOperate(params) {
    return request({
      url: "/role/operate",
      method: "post",
      data: params,
      mock: false,
    })
  },
  updatePermission(params) {
    return request({
      url: "/role/update/permission",
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
