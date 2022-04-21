import {validation} from "./utils/api/validation";

const {app, dialog, BrowserWindow, Menu, shell, ipcMain, globalShortcut} = require('electron')
const path = require('path')
const fs = require('fs-extra')
const common = require('./common')

const log = require('electron-log');

import login from './init/init-login'
import {saveOrUpdate} from "./utils/api/loginfo";
import {getUserinfoListByFilter} from "./utils/api/userinfos";
import {fork} from 'child_process'

var dateFormat = require("dateformat");


const autoUpdater = require('electron-updater').autoUpdater
// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
  mainWindow.webContents.send('message', text)
}


let currentVersion = autoUpdater.currentVersion;


// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle() {
    log.info("开始进入 updateHandler 方法")
    //minimize
    ipcMain.on('hide-window', () => {
        mainWindow.minimize();
    });
    //maximize
    ipcMain.on('show-window', () => {
        mainWindow.maximize();
    });
    //unmaximize
    ipcMain.on('orignal-window', () => {
        mainWindow.unmaximize();
    });
    //打开默认浏览器
    ipcMain.on('open-office-website', function (event, arg) {
        shell.openExternal(arg)
    })

  ipcMain.on('check-for-update', function(event, arg) {
    let message={
      appName:'CRD 贴膜 4面排版系统',
      error:'检查更新出错, 请联系开发人员',
      errorTips:'检查更新出错, 请联系开发人员',
      checking:'正在检查更新……',
      updateAva:'检测到新版本，正在下载……',
      updateNotAva:'现在使用的就是最新版本，不用更新',
      downloaded: '最新版本已下载，将在重启程序后更新'
    };


        autoUpdater.on('error', function (error) {
            return dialog.showMessageBox(mainWindow, {
                type: 'info',
                buttons: ['OK'],
                title: message.appName,
                message: message.errorTips,
                detail: '\r' + message.error
            });

            sendUpdateMessage(message.error)
        });

    //当开始检查更新的时候触发
    autoUpdater.on('checking-for-update', function() {
      sendUpdateMessage(message.checking)
      return dialog.showMessageBox(mainWindow, {
        type: 'info',
        buttons: ['OK'],
        title: message.appName,
        message: message.checking
      });
    });

    //当发现一个可用更新的时候触发，更新包下载会自动开始
    autoUpdater.on('update-available', function(info) {
      sendUpdateMessage(message.updateAva)
      var downloadConfirmation = dialog.showMessageBox(mainWindow, {
        type: 'info',
        buttons: ['OK'],
        title: message.appName,
        message: message.updateAva
      });
      if (downloadConfirmation === 0) {
        return;
      }
    });

    //当没有可用更新的时候触发
    autoUpdater.on('update-not-available', function(info) {
      return dialog.showMessageBox(mainWindow, {
        type: 'info',
        buttons: ['OK'],
        title: message.appName,
        message: message.updateNotAva
      });
      sendUpdateMessage(message.updateNotAva)
    });

    // 更新下载进度事件
    autoUpdater.on('download-progress', function(progressObj) {
      mainWindow.webContents.send('downloadProgress', progressObj)
    })
    /**
     *  event Event
     *  releaseNotes String - 新版本更新公告
     *  releaseName String - 新的版本号
     *  releaseDate Date - 新版本发布的日期
     *  updateURL String - 更新地址
     * */
    autoUpdater.on('update-downloaded',  function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
      var index = dialog.showMessageBox(mainWindow, {
        type: 'info',
        buttons: ['现在重启', '稍后重启'],
        title: message.appName,
        message: message.downloaded,
        //detail: releaseName + "\n\n" + releaseNotes
      });
      log.info(index);
      if (index === 1) return;
      //在下载完成后，重启当前的应用并且安装更新
      autoUpdater.quitAndInstall();
      //通过main进程发送事件给renderer进程，提示更新信息
      //mainWindow.webContents.send('isUpdateNow')
    });

        //执行自动更新检查
        log.info("更新用的环境变量检测:")
        //执行自动更新检查
        autoUpdater.checkForUpdates()
    });
    log.info("更新用的环境变量检测:")
    //执行自动更新检查
    autoUpdater.checkForUpdates()
}





const storePath = app.getPath('userData')
// 如果数据目录不存在，则重新创建
if (!fs.pathExistsSync(storePath)) {
    fs.mkdirpSync(storePath)
}

const {DB} = require('../universal/database')

let db = new DB(storePath);

db.set("currentVersion",currentVersion)


let mainWindow =null;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        titleBarStyle: 'hidden',
        frame: false,
        webPreferences: {
            // preload: path.join(__dirname, '../renderer/renderer.js')
            nodeIntegration: true
        }
    })

    if (process.env.NODE_ENV === 'production') {
        mainWindow.loadFile(path.resolve(__dirname, `index.html`)).catch(console.error);
    }else {
        mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
    }
    // and load the index.html of the app.
    // mainWindow.loadFile('../renderer/index.html')
    log.info("开始调用检测自动更新前")
    updateHandle();
    log.info("开始调用检测自动更新后")
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.whenReady().then(createWindow)

let execChildProcess = null;


let configObject = null;


app.on('ready', function () {

    createWindow()

    // 注册一个 'F10' 的全局快捷键
    const ret = globalShortcut.register('F10', () => {
        startUp();
    })

  // 注册一个 'F11' 的全局快捷键
  const ret1 = globalShortcut.register('F11', () => {
    //child.send({'shutdown': true})
    log.info('F11 is pressed')
    //app.quit();
    if (isStart){
      mainWindow.restore();
      isStart = false;
      if (db.has('crd')){
        let crd = db.get('crd');

        // 判断到处目录中已经有文件才加一，否则不加一
        //if (configObject.exportModelFilePath)

        // configObject = db.get('configObject');
        // let re = common.getSequenceNumber(crd.pch,crd.pchIncreateFlag);
        // crd.pch = re.pch;
        // crd.pchIncreateFlag = re.pchIncreateFlag;
        // db.set('crd',crd)
        // configObject.pch = re.pch;
        // db.set('configObject',configObject);
        mainWindow.webContents.send('refresh','refresh');
      }
      execChildProcess.kill()
    }
    // process.exit(22)
  })

  if (!ret) {
    log.info('F10 registration failed')
  }
  if (!ret1) {
    log.info('F11 registration failed')
  }

  // 检查快捷键是否注册成功
  log.info(globalShortcut.isRegistered('F10'))
  log.info(globalShortcut.isRegistered('F11'))

})

app.on('will-quit', () => {
  // 注销快捷键
  globalShortcut.unregister('F10')
  globalShortcut.unregister('F11')

  // 注销所有快捷键
  globalShortcut.unregisterAll()
})


app.on('browser-window-created', function () {
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})


let isStart = false;

let startDateTime = null;

/**
 * 开始执行
 */
function startUp() {

    if (!db.has('configObject')){
        dialog.showMessageBox(mainWindow, {
            type: 'warning',
            buttons: ['OK'],
            title: "授权失败",
            message: "联系管理员"
        });
        return
    }

    configObject = db.get('configObject');
    let code = configObject.code;
    let computerObject = configObject.computerObject;
    let softwareObject = configObject.softwareObject;

    // 查询用户编号,
    validation({"code":code,"machineCode":computerObject.machineCode,"softwareId":softwareObject.id}).then(response=>{
        log.info("检测用户是否有权限存在:"+JSON.stringify(response.data))
        if (response.data){
            if (!isStart) {
                let date = new Date();
                let sssz = "UTC:yyyy-mm-dd'T'HH:MM:ss.l'Z'";
                startDateTime = dateFormat(date, sssz);
                mainWindow.minimize();
                log.info("开始最小化窗口"+code)
                getUserinfoListByFilter({"code.equals":code}).then(response=>{
                    let userinfoObject = response.data
                    log.info("获取用户信息"+JSON.stringify(userinfoObject))
                    log.info("__dirname 目录"+__dirname)
                    let modulePath = __dirname + "/exec.js";
                    log.info("modulePath 目录"+modulePath)
                    execChildProcess = fork(modulePath, {env: {storePath: storePath}})
                    log.info("execChildProcess"+execChildProcess)
                    execChildProcess.on('message', function (m) {
                        let date1 = new Date();
                        let endDateTime = dateFormat(date1, sssz);
                        let message = "执行完毕,本次共执行 " + m.totalSize + " 条";
                        let title = "MT 鼠标垫 80";
                        saveOrUpdate({endDate:endDateTime,message:title + message,startDate:startDateTime,computer:computerObject,software:softwareObject,userinfo:userinfoObject[0]})
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            buttons: ['OK'],
                            title: title,
                            message: message
                        });
                    })
                    // 启动后设置为已经启动状态
                    isStart = true;
                });

            }
        }
    }).catch(error=>{
        dialog.showMessageBox(mainWindow, {
            type: 'warning',
            buttons: ['OK'],
            title: "授权失败",
            message: "联系管理员"
        });
    })
}

ipcMain.on('start', (sys, msg) => {
    log.info(msg) //接收窗口传来的消息
    startUp();
})

ipcMain.on('stop', (sys, msg) => {
  // if (isStart){
  //   isStart = false;
  //   execChildProcess.kill()
  // }
  app.quit();
})


