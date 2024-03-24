//apig管理

import request from "../utils/request"
export default {
    login(params) {
        return request({
            url: '/users/login',
            data: params,
            method: 'POST'
        })
    },
    noticeCount() {
        return request({
            url: '/leaves/count',
            data: {},
            method: 'GET',
        })
    },
    muneList(params) {
        return request({
            url: '/menu/list',
            data: params,
            method: 'GET',
        })
    },
    getuserList(params) {
        return request({
            url: '/users/list',
            data: params,
            method: 'GET',
        })
    },
    getuserAllList() {
        return request({
            url: '/users/all/list',
            data: {},
            method: 'GET',
        })
    },
    userDelete(params) {
        return request({
            url: '/users/delete',
            data: params,
            method: 'POST',
        })
    },
    getRoleList(params) {
        return request({
            url: '/roles/list',
            data: params,
            method: 'GET',
        })
    },
    getRoleAllList() {
        return request({
            url: '/roles/allList',
            data: {},
            method: 'GET',
        })
    },
    getDeptList(params) {
        return request({
            url: '/dept/list',
            data: params,
            method: 'GET',
        })
    },
    deptOperate(params) {
        return request({
            url: '/dept/operate',
            data: params,
            method: 'POST',
        })
    },
    userSubmit(params) {
        return request({
            url: '/users/operate',
            data: params,
            method: 'POST',
        })
    },
    menuSubmit(params) {
        return request({
            url: '/menu/operate',
            data: params,
            method: 'POST',
        })
    },
    roleOperate(params) {
        return request({
            url: '/roles/operate',
            data: params,
            method: 'POST',
        })
    },
    updatePermission(params) {
        return request({
            url: '/roles/update/permission',
            data: params,
            method: 'POST',
        })
    },
    getPermissionList() {
        return request({
            url: '/users/getPermissionList',
            data: {},
            method: 'GET',
        })
    },
    getApplyList(params) {
        return request({
            url: '/leaves/list',
            data: params,
            method: 'GET',
        })
    },
    leaveOperate(params) {
        return request({
            url: '/leaves/operate',
            data: params,
            method: 'POST',
        })
    },
    leaveApprove(params) {
        return request({
            url: '/leaves/approve',
            data: params,
            method: 'POST',
        })
    },
    signIn(params) {
        return request({
            url: '/registrated/sign/start',
            data: params,
            method: 'POST',
        })
    },
    signOut(params) {
        return request({
            url: '/registrated/sign/end',
            data: params,
            method: 'POST',
        })
    },
    querySign(params) {
        return request({
            url: '/registrated/sign/query',
            data: params,
            method: 'POST',
        })
    },
    queryAllUserSalary(params) {
        return request({
            url: '/salarys/all/user/query',
            data: params,
            method: 'POST',
        })
    },
    updateUserSalary(params) {
        return request({
            url: '/salarys/all/user/update',
            data: params,
            method: 'POST',
        })
    },
    getUserInfo(params) {
        return request({
            url: '/users/userInfo/get',
            data: params,
            method: 'POST',
        })
    },
    getSignByTime(params) {
        return request({
            url: '/registrated/sign/all/query',
            data: params,
            method: 'POST',
        })
    },
    getSignListByTime(params) {
        return request({
            url: '/salarys/payroll/update/query',
            data: params,
            method: 'POST',
        })
    },
    getAllUserPayRoll(params) {
        return request({
            url: '/salarys/payroll/all/query',
            data: params,
            method: 'POST',
        })
    },
    updateUserPayRoll(params) {
        return request({
            url: '/salarys//payroll/update',
            data: params,
            method: 'POST',
        })
    },
}