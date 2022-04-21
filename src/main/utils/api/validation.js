/**
 * 计算机接口
 */

import request from '../request'

/**
 * 校验权限
 * @param data
 */
export function validation(data) {
    return request({
        url: '/api/validation',
        method: 'post',
        data
    })
}
