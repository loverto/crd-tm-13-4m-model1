import user from '../utils/user.js'
import {getToken} from "../utils/auth";

// 获取本机信息
import {machineIdSync} from 'node-machine-id';
import os from 'os';
import fs from 'fs-extra'
import {app} from 'electron'
import packageInfo from '../../../package.json'
import {softwareSaveOrUpdate} from "../utils/api/software";

import {DB} from '../../universal/database'

const storePath = app.getPath('userData')
// 如果数据目录不存在，则重新创建
if (!fs.pathExistsSync(storePath)) {
    fs.mkdirpSync(storePath)
}

let db = new DB(storePath);


// 机器码
const machineCode = machineIdSync();
// 主机名称
let hostname=os.hostname()

let arch = os.arch();
let cpuInfos = os.cpus();
let totalmem = os.totalmem();
let networkInterfaces = os.networkInterfaces();

if (!db.get("hostname")){
    hostname = hostname;
    db.set("hostname",hostname)
}else {
    hostname = db.get("hostname");
}

let configObject = {};
if (db.has("configObject")){
    configObject = db.get("configObject");
}

// 应用id
const appCode = packageInfo.build.appId;
// 应用名称
const appName = packageInfo.description;
// 应用版本
const appVersion = packageInfo.version;

// 查询是否已经有该机子注册过
import {getCompterListByFilter,saveOrUpdate} from '../utils/api/compter';
import {getSoftwareListByFilter} from "../utils/api/software";

let computerObject = {};
let softwareObject = {};

// 登录
let loginByUsername = user.actions.LoginByUsername({"username":"user","password":"user"});

function findIndexByKeyValue(arr, key, valuetosearch) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] == valuetosearch) {
            return i;
        }
    }
    return -1;
}

loginByUsername.then(()=>{
    console.log("登陆成功:测试一下token:"+getToken());
    return getCompterListByFilter({"machineCode.equals":machineCode})
}).then(response=>{
    console.log("检测计算机是否存在:"+JSON.stringify(response.data));
    if(response.data.length==0){
        return  saveOrUpdate({machineCode:machineCode,name:hostname,code:'备注名称:'+hostname});
    }else {
        return new Promise((resolve, reject) => {
            resolve({data:response.data[0]})
        })
    }
}).then(response => {
    console.log("计算机信息:"+JSON.stringify(response.data))
    computerObject = response.data;
    return getSoftwareListByFilter({"code.equals":appCode})
}).then(response=>{
    console.log("检测软件是否存在:"+JSON.stringify(response.data))
    if (response.data.length ==0){
        return softwareSaveOrUpdate({name:appName,version:appVersion,code:appCode})
    }else{
        return new Promise((resolve,reject)=>{
            resolve({data:response.data[0]})
        })
    }
}).then(response=>{
    softwareObject = response.data;
    console.log("软件信息:"+JSON.stringify(response.data));
    if(!computerObject.software){
        computerObject.software = []
    }
    if (findIndexByKeyValue(computerObject.software,"id",softwareObject.id) === -1){
        computerObject.software.push(softwareObject);
        return saveOrUpdate(computerObject,'put')
    }else {
        return new Promise((resolve,reject)=>{
            resolve({data:computerObject})
        })
    }
}).then(response =>{
    computerObject = response.data;
    console.log("计算机与软件的关系设置完毕:"+JSON.stringify(response.data));
    configObject.computerObject = computerObject;
    configObject.softwareObject = softwareObject;
    db.set("configObject",configObject);
})





