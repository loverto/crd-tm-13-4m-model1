const Datastore = require('lowdb')
// @ts-ignore
const LodashId = require('lodash-id')
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')
// const fs = require('fs-extra')
// const { remote, app } = require('electron')
//
// const APP =  process.type === 'renderer' ? remote.app : app
// const STORE_PATH = APP.getPath('userData')
//
// if (process.type !== 'renderer') {
//     if (!fs.pathExistsSync(STORE_PATH)) {
//         fs.mkdirpSync(STORE_PATH)
//     }
// }

class DB {
    constructor (STORE_PATH) {
        console.log("database store path: "+STORE_PATH);
        const adapter = new FileSync(path.join(STORE_PATH, '/data.json'))

        this.db = Datastore(adapter)
        this.db._.mixin(LodashId)

    }
    read () {
        return this.db.read()
    }
    get (key = '') {
        return this.read().get(key).value()
    }
    set (key, value) {
        return this.read().set(key, value).write()
    }
    has (key) {
        return this.read().has(key).value()
    }
    insert (key, value) {
        // @ts-ignore
        return this.read().get(key).insert(value).write()
    }
    unset (key, value) {
        return this.read().get(key).unset(value).value()
    }
    getById (key, id) {
        // @ts-ignore
        return this.read().get(key).getById(id).value()
    }
    removeById (key, id) {
        // @ts-ignore
        return this.read().get(key).removeById(id).write()
    }
}

exports.DB = DB
