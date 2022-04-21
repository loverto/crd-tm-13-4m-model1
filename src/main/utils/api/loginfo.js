/**
 * 日志接口
 */

import request from '../request'

/**
 * 获取日志列表
 */
export function getList(query) {
    return request({
        url: '/api/loginfos',
        method: 'get',
        params: query
    })
}

/**
 * 新增或更新日志
 */

export function saveOrUpdate(data, method = 'post') {
    return request({
        url: '/api/loginfos',
        method,
        data
    })
}

/**
 * 获取审核列表
 */
export function getSearchList(query) {
    return request({
        url: '/api/_search/loginfos',
        method: 'get',
        params: query
    })
}

/**
 * 通过过滤器的方式获取数据
 */
export function getLoginfoListByFilter(query){
    return request({
        url: '/api/loginfos',
        method: 'get',
        params: query
    })
}
