/**
 * 软件接口
 */

import request from '../request'

/**
 * 获取软件列表
 */
export function getList(query) {
    return request({
        url: '/api/softwares',
        method: 'get',
        params: query
    })
}

/**
 * 新增或更新软件
 */

export function softwareSaveOrUpdate(data, method = 'post') {
    return request({
        url: '/api/software',
        method,
        data
    })
}

/**
 * 获取审核列表
 */
export function getSearchList(query) {
    return request({
        url: '/api/_search/software',
        method: 'get',
        params: query
    })
}


/**
 * 通过过滤器的方式获取数据
 */
export function getSoftwareListByFilter(query){
    return request({
        url: '/api/software',
        method: 'get',
        params: query
    })
}
