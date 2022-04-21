import {app} from 'electron'
import fs from 'fs-extra'
import {DB} from '../../universal/database'
const log = require('electron-log');

const TokenKey = 'Admin-Token'
const storePath = app.getPath('userData')
// 如果数据目录不存在，则重新创建
if (!fs.pathExistsSync(storePath)) {
    fs.mkdirpSync(storePath)
}



let db = new DB(storePath);



/**
 *  获取Token
 * @returns {*}
 */
export function getToken() {
    log.info("开始取值了"+TokenKey)
    return db.get(TokenKey)
}

/**
 *  设置Token
 * @param token
 * @returns {*}
 */
export function setToken(token) {
    log.info("设置值了"+token+TokenKey)
    return db.set(TokenKey, token)
}

/**
 * 删除Token
 * @returns {*}
 */
export function removeToken() {
    return db.remove(TokenKey)
}
