

// 导入大漠插件版本

const dm = require('@loverto/dm.dll')
const keycode = require('keycode')
const common = require('./common')

const dmExt = require('./dm.dll.ext')


const sleep = require("./sleep");
// 获取大漠插件的版本
console.log(dm.dll.ver())

/**
 * 新建文件
 */
function ctrlAndN(){
    dm.keyDown(17)
    dm.keyPress(78)
    dm.keyUp(17)
}

/**
 * 打开新文件
 */
function ctrlAndO(){
    dm.keyDown(17)
    dm.keyPress(79)
    dm.keyUp(17)
}

/**
 * 粘贴
 */
function ctrlAndV(){
    dm.keyDown(17)
    dm.keyPress(86)
    dm.keyUp(17)
}

/**
 * 回车键
 */
function enter(){
    dm.keyPress(13)
}

/**
 * Shift 换挡键
 */
function shift(){
    dm.keyPress(16)
}

/**
 * 导入快捷键
 */
function ctrlAndI(){
    dm.keyDown(17)
    dm.keyPress(73)
    dm.keyUp(17)
}

/**
 * 导出快捷键
 */
function ctrlAndE() {
    dm.keyDown(17)
    dm.keyPress(69)
    dm.keyUp(17)
}

/**
 * 解锁组合
 */
function ctrlAndU(){
    dm.keyDown(17)
    dm.keyPress(85)
    dm.keyUp(17)
}

/**
 * 合并正反面
 * @constructor
 */
function cAndE(){
    dm.keyPress(67)
    dm.keyPress(69)
}

/**
 * 组合键
 */
function ctrlAndG(){
    dm.keyDown(17)
    dm.keyPress(71)
    dm.keyUp(17)
}

/**
 * 复制内容
 */
function ctrlAndC(){
    dm.keyDown(17)
    dm.keyPress(67)
    dm.keyUp(17)
}

/**
 * 全选内容
 */
function ctrlAndA() {
    dm.keyDown(17)
    dm.keyPress(65)
    dm.keyUp(17)
}

/**
 * 打开替换对话框
 */
function altAndEAndFAndA() {
    dm.keyDown(18)
    dm.keyPress(69)
    dm.keyUp(18)
    sleep.msleep(1000)
    dm.keyPress(70);
    sleep.msleep(1000)
    dm.keyPress(65)
}

/**
 * 复制对象
 * @param num
 */
function ctrlAndNumPlugin(num) {
    if (num<0){
        num = 1
    }
    for (let i =0; i<num; i++){
        dm.keyDown(17)
        dm.keyPress(107)
        dm.keyUp(17)
        sleep.msleep(200)
    }
}

/**
 * 选中并复制
 * @param selectedCoordinate 选中元素的坐标点
 * @param copyNumber 复制次数
 */
function selectdAndCopy(selectedCoordinate,copyNumber) {
    // 选中元素
    dm.moveTo(selectedCoordinate[0], selectedCoordinate[1]);
    sleep.msleep(200)
    dm.leftClick();
    sleep.msleep(500)

    // 复制 copyNumber 张图片
    ctrlAndNumPlugin(copyNumber)
}


/**
 * 删除对象
 */
function deleteObj() {
    dm.keyPress(46)
}

/**
 * 退出，中断键
 */
function esc() {
    dm.keyPress(27)
}

/**
 * 打开模板通用封装步骤
 * @param path 模板路径，绝对值
 */
function commonOpenModel(path) {
    ctrlAndO();
    console.log("开始休眠好不好")
    sleep.msleep(1000)
    console.log("结束休眠好不好")
    dmExt.setClipboard(path);
    sleep.msleep(500)
    ctrlAndV()
    sleep.msleep(500)

}

/**
 * 根据上面的信息打开十二面六套排版
 * @param modelPath 模板路径
 */
function openUModel(modelPath) {
    commonOpenModel(modelPath)
    sleep.msleep(500)
    enter();
    sleep.msleep(500)
}

/**
 * 导入路径
 * @param path 路径
 */
function importUModel(path) {
    ctrlAndI();
    sleep.msleep(500)
    dmExt.setClipboard(path);
    sleep.msleep(500)
    ctrlAndV();
    sleep.msleep(500)
    enter();
    sleep.msleep(1500)
}


/**
 * 打开另存为窗口
 */
function ctrlAndShiftAndS() {
    dm.keyDown(17)
    dm.keyDown(16)
    dm.keyPress(83)
    dm.keyUp(16)
    dm.keyUp(17)
}

/**
 * corelDraw 置底
 */
function shiftAndPageDown(rightModelCoor) {
    dm.moveTo(rightModelCoor[0],rightModelCoor[1])
    dm.rightClick();
    sleep.msleep(200)
    enter();
    sleep.msleep(200)
    dm.keyPress(65)
    sleep.msleep(200)

}

/**
 * 打开另存为窗口，并另存为
 * @param path
 */
function saveAsPath(path) {
    ctrlAndShiftAndS();
    sleep.msleep(500)
    dmExt.setClipboard(path);
    sleep.msleep(500)
    ctrlAndV();
    sleep.msleep(500)
    enter();
    sleep.msleep(500)
}

/**
 * 移动到指定位置，并点击
 * 设置为可移动
 * @param coor 操作坐标
 */
function moveAndClick(coor) {
    console.info(coor);
    dm.moveTo(coor[0],coor[1]);
    sleep.msleep(100);
    dm.leftClick()
}

/**
 *  关闭模板 Ctrl + F4
 */
function  closeModel() {
    sleep.msleep(3000)
    dm.keyDown(keycode("ctrl"))
    dm.keyPress(keycode("f4"))
    dm.keyUp(keycode("ctrl"))
    sleep.msleep(3000)
}

/**
 * Tab 键
 */
function tab() {
    dm.keyPress(9)
}

/**
 * j键
 */
function j(){
    dm.keyPress(74)
}

/**
 * 导出指定格式
 * @param exportCoordinate 导出的需要选择的坐标
 * @param exportFileName 导出的文件名称
 */
function exportFormate(exportCoordinate,exportFileName) {
    // 选中所有排好的版。
    common.selectAreaByArray(exportCoordinate);
    // 开始导出。
    ctrlAndE()
    sleep.msleep(1000)
    dmExt.setClipboard(exportFileName);
    sleep.msleep(1000)
    ctrlAndV();
    sleep.msleep(1000)
    tab();
    sleep.msleep(1000)
    j();
    sleep.msleep(1000)
    enter();
    sleep.msleep(1000)
    enter();
    sleep.msleep(1000)
}

/**
 * 合并并翻页
 * @param commonModel 四面通用模板
 */
function combinePageTurning(commonModel) {
    dm.keyDown(16)

    for (let i =0 ; i< commonModel.length+1; i++){
        let cptpo = commonModel[i];
        let cptpot = cptpo.split(",")
        dm.moveTo(cptpot[0],cptpot[1])
        dm.leftClick();
        sleep.msleep(200)
    }
    dm.keyUp(16);
    sleep.msleep(200)
    shift();
    sleep.msleep(200)
    ctrlAndG();
    sleep.msleep(200)
    shiftAndPageDown()
    sleep.msleep(200)
}

/**
 * 查找CorelDRAW 16.1位置,打开CorelDRAW 16.1 ,并设置全屏
 */
function findCorelDrawAndFullScreen(windowTitle){
    var win = dm.findWindow("",windowTitle);
    // 判断窗口是否是激活状态
    let getWindowState = dmExt.getWindowState(win,0);
    if (getWindowState===1){
        console.log("find the windows ")
        // 激活窗口
        dm.setWindowState(win,1);
        // 最大化
        dm.setWindowState(win,4);
        return true
    }else {
        return false;
        console.log("Window not open")
    }
}



/**
 * 查找替换文本
 * @param replaceCoordinate 替换在界面上的坐标信息
 * @param findText 查找的文本信息
 * @param replaceText 替换的文本
 */
function findAndReplaceText(replaceCoordinate,findText,replaceText) {
    // 设置编号 1. 选中所有文本，2. 替换所有文本编号
    altAndEAndFAndA();
    sleep.msleep(1000)
    // 把 编号位置 替换为 文件名



    dmExt.setClipboard(findText);
    sleep.msleep(500)
    ctrlAndV();
    sleep.msleep(500)

    tab();
    sleep.msleep(200)
    tab();
    sleep.msleep(200)
    dmExt.setClipboard(replaceText)
    sleep.msleep(500)
    ctrlAndV();
    sleep.msleep(500)
    tab();
    sleep.msleep(200)
    dm.keyPress(keycode('p'))
    sleep.msleep(500)
    enter();
    sleep.msleep(300)

    dm.keyDown(keycode('alt'))
    dm.keyPress(keycode('F4'))
    dm.keyUp(keycode('alt'))

    sleep.msleep(500)
}

/**
 * 移动到某位置，并输入相应参数
 * @param spinCoordinate 旋转的坐标
 * @param spinNumber旋转度数
 */
function moveSpinNumber(spinCoordinate,spinNumber) {
    dm.moveTo(spinCoordinate[0], spinCoordinate[1]);
    sleep.msleep(500);
    dm.leftClick();
    sleep.msleep(500);
    ctrlAndA();
    sleep.msleep(200);
    deleteObj();
    sleep.msleep(200);
    dmExt.setClipboard(spinNumber);
    sleep.msleep(200);
    ctrlAndV();
    sleep.msleep(200);
    enter();
    sleep.msleep(200);
}


/**
 * 复制对象，并移动到指定的坐标数组的位置上
 * @param copyObjectCoordinate 复制对象的坐标
 * @param moveCoordinateArray 移动坐标点的数组
 * @param clickWhite 空白位置的坐标点
 * @param copyNumber 复制的次数
 */
function copyObjectAndMoveCoordinate(copyObjectCoordinate,moveCoordinateArray,clickWhite, copyNumber) {
    selectdAndCopy(copyObjectCoordinate, copyNumber);
    // 开始复制到对应的位置
    for (let i = 0; i < moveCoordinateArray.length; i++) {
        let endCoordinate = moveCoordinateArray[i];
        let startArray = copyObjectCoordinate;
        let endArray = endCoordinate.split(",");

        // 点击空白坐标
        sleep.msleep(200)
        moveAndClick(clickWhite)
        sleep.msleep(200)

        // 选中文档中的模板
        common.selectAreaByPointArray(startArray, endArray)
    }
}


function deleteOtherObjectForKeepManyObject(coordinateArray, keepPic) {
    let moveCoordinate = null;
    dm.keyDown(keycode('shift'))
    for (let i = 1; i < coordinateArray.length; i++) {
        let coordinateArrayElement = coordinateArray[i].split(',');
        if (keepPic.includes(i)) {
            moveCoordinate = coordinateArrayElement
            continue
        }
        dm.moveTo(coordinateArrayElement[0], coordinateArrayElement[1]);
        sleep.msleep(200)
        dm.leftClick();
    }
    dm.keyUp(keycode('shift'))
    deleteObj();
    sleep.msleep(200)
    return moveCoordinate;
}




/**
 * 删除不相关的对象
 * @param coordinateArray 所有对象的坐标点
 * @param keepPic 需要保留的对象的下标
 * @returns {*} 保留对象的坐标点
 */
function deleteOtherObject(coordinateArray, keepPic) {
    let moveCoordinate = null;
    dm.keyDown(keycode('shift'))
    for (let i = 1; i < coordinateArray.length; i++) {
        let coordinateArrayElement = coordinateArray[i].split(',');
        if (i == keepPic) {
            moveCoordinate = coordinateArrayElement
            continue
        }
        dm.moveTo(coordinateArrayElement[0], coordinateArrayElement[1]);
        sleep.msleep(200)
        dm.leftClick();
    }
    dm.keyUp(keycode('shift'))
    deleteObj();
    sleep.msleep(200)
    return moveCoordinate;
}

/**
 * 获取指定位置对象的宽和高
 * @param start 开始位置
 * @param width 宽的位置
 * @param height 高的位置
 * @param widthTemp 对象的宽的值
 * @param heightTemp 对象的高的值
 * @param widthAndHeightPosition 宽和高的位置
 * @returns {{widthTemp: *, width: string[], heightTemp: *, height: string[]}}
 */
function getObjectWidthAndHeight(start, width, height, widthTemp, heightTemp,widthAndHeightPosition) {
    // 选中图片
    dm.moveTo(start[0], start[1])
    sleep.msleep(500)
    dm.leftClick();
    width = widthAndHeightPosition[0].split(",");
    height = widthAndHeightPosition[1].split(",");
    dm.moveTo(width[0], width[1])
    sleep.msleep(500)
    dm.leftClick();
    sleep.msleep(200)
    ctrlAndA();
    sleep.msleep(500)
    ctrlAndC();
    widthTemp = dmExt.getClipboard().replace("mm", "")
    sleep.msleep(1000)
    dm.moveTo(height[0], height[1]);
    sleep.msleep(500)
    dm.leftClick();
    sleep.msleep(500)
    ctrlAndA()
    sleep.msleep(500)
    ctrlAndC();
    sleep.msleep(500)
    heightTemp = dmExt.getClipboard().replace("mm", "")
    return {width, height, widthTemp, heightTemp};
}





exports.eas=esc
exports.findCorelDrawAndFullScreen=findCorelDrawAndFullScreen
exports.openUModel=openUModel
exports.moveAndClick=moveAndClick
exports.importUModel = importUModel
exports.saveAsPath = saveAsPath
exports.closeModel = closeModel
exports.ctrlAndNumPlugin = ctrlAndNumPlugin
exports.ctrlAndA = ctrlAndA
exports.ctrlAndC = ctrlAndC
exports.deleteObj = deleteObj
exports.ctrlAndV = ctrlAndV
exports.ctrlAndG = ctrlAndG
exports.enter = enter
exports.altAndEAndFAndA = altAndEAndFAndA
exports.findAndReplaceText = findAndReplaceText
exports.ctrlAndU = ctrlAndU
exports.ctrlAndE = ctrlAndE
exports.moveSpinNumber = moveSpinNumber
exports.selectdAndCopy = selectdAndCopy
exports.j = j
exports.tab = tab
exports.exportFormate = exportFormate
exports.copyObjectAndMoveCoordinate = copyObjectAndMoveCoordinate
exports.getObjectWidthAndHeight = getObjectWidthAndHeight
exports.deleteOtherObject = deleteOtherObject
exports.deleteOtherObjectForKeepManyObject = deleteOtherObjectForKeepManyObject


