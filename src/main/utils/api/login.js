/**
 * 登录
 */
import request from '../request'

export function loginByUsername(data) {
    return request({
        url: '/api/authenticate',
        method: 'post',
        data
    })
}

export function logout() {
    return request({
        url: '/login/logout',
        method: 'post'
    })
}

export function getUserInfo() {
    return request({
        url: '/api/account',
        method: 'get'
    })
}

