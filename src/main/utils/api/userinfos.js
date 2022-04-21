/**
 * 计算机接口
 */

import request from '../request'

/**
 * 获取计算机列表
 */
export function getList(query) {
    return request({
        url: '/api/userinfos',
        method: 'get',
        params: query
    })
}

/**
 * 新增或更新计算机
 */

export function userinfoSaveOrUpdate(data, method = 'post') {
    return request({
        url: '/api/userinfos',
        method,
        data
    })
}

/**
 * 获取审核列表
 */
export function getSearchList(query) {
    return request({
        url: '/api/_search/userinfos',
        method: 'get',
        params: query
    })
}


/**
 * 通过过滤器的方式获取数据
 */
export function getUserinfoListByFilter(query){
    return request({
        url: '/api/userinfos',
        method: 'get',
        params: query
    })
}
