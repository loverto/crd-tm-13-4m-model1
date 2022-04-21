// 导入大漠插件版本
const sleep = require('./sleep');

const dm = require('@loverto/dm.dll')
const keycode = require('keycode')
const dmExt = require('./dm.dll.ext')
// 获取大漠插件的版本
console.log(dm.dll.ver())

const path = require("path");
const fs = require("fs");

/**
 * 屏幕尺寸坐标点转换
 *
 * @param arr 待转换坐标
 * @param winW 当前电脑的屏幕宽跟采集的宽的  比例 例如 1366（运行脚本电脑的宽）/ 1440（开发脚本的电脑宽）
 * @param winH 当前电脑的屏幕高跟采集的高的  比例 例如 1366（运行脚本电脑的高）/ 1440（开发脚本的电脑高）
 *
 */
function ratioConversion(arr,winW,winH) {
    // if (arr.length == 1){
    //
    // }
    // 原始比例，无需转换
    if (winW === 1 && winH ===1){
        return arr;
    }

    let ratio = [winW,winH]

    for (let i = 0;i<arr.length;i++){
        // 判断是不是数字
        let element = arr[i];
        if (typeof element === 'number'){
            arr[i] = element * ratio[i%2]
        }else if (element.includes('|')){
            let splitArr = element.split(',');
            let str = ""
            for (let j = 0;j<splitArr.length;j++){
                let splitArr2 = splitArr[j].split('|');
                str += splitArr2[0]*winW + '|' + splitArr2[1]*winH + '|' + splitArr2[2] + ','
            }
            arr[i] = str.substring(0,str.length-1)
        } else if (element.includes(',')){
            let splitArr = element.split(',');
            let str = ""
            str += (splitArr[0]* winW).toFixed(0) + ',' + (splitArr[1] * winH).toFixed(0)
            arr[i] = str
        }
    }

    return arr;



}


// 通用快捷键

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

// 通用快捷键








/**
 * 通过数组选中两点间的区域
 * @param arr
 */
function selectAreaByArray(arr) {
    var lut = arr[0].split(",")
    var rdt = arr[1].split(",")
    selectAreaByPointArray(lut,rdt)
}
/**
 *
 * 1. 通过点选中两点间的区域
 * 或者
 * 2. 把 点1 255的对象移动到 点2
 */
function  selectAreaByPointArray(point1,point2) {
    const lut = point1;
    const rdt = point2;
    dm.moveTo(lut[0],lut[1])
    sleep.msleep(500);
    dm.leftDown();
    sleep.msleep(500)
    dm.moveTo(rdt[0],rdt[1])
    sleep.msleep(500)
    dm.leftUp();
    sleep.msleep(500)
}

/**
 * 自动获取批次号
 * @param pch 批次号
 * @param pchIncreateFlag 批次增量标记
 */
function getSequenceNumber(pch,pchIncreateFlag) {
    let result = null;
    const pchArr = pch.split("-");
    //增量批次号
    let length = pchArr.length - 1 ;
    // 获取最后一个数字，方便进行累加
    let pchIncreate = pchArr[length];
    let pchIncreateStr = pchIncreate + "";
    // 扩展支持以特殊符号结尾的操作
    let endString = "+"
    if (pchIncreateStr.endsWith(endString)){
        pchIncreate = pchIncreateStr.substring(0,pchIncreateStr.length -1)
    }else {
        endString = "";
    }
    // pchIncreateFlag = -1 说明是第一次，第一次，直接返回原值
    if (pchIncreateFlag == -1){
        result = pch
        pchIncreateFlag = pchIncreate
        console.log(" pch increate flag pch: "+ result + "pchIncreateFlag:" + pchIncreateFlag)
        return  {pch:result,pchIncreateFlag:pchIncreateFlag};
    }
    if (pchIncreate*1 == pchIncreateFlag*1){
        pchIncreate = ((pchIncreateFlag*1)+1)+"";
        pchArr[length]=pchIncreate;
        pchIncreateFlag = pchIncreate;
    }

    let pchIncreateLength = pchIncreate.length;
    let pchLastLength = 3;
    let number = pchLastLength-pchIncreateLength;
    // 补零操作
    for (let i=0;i<number;i++){
        pchIncreate = "0" + pchIncreate
    }
    // 重新赋值
    pchArr[length]=pchIncreate + endString;

    result = pchArr.join("-");

    return {pch:result,pchIncreateFlag:pchIncreateFlag};
}

/**
 * 根据文件名查找文件全路径
 * @param dirPath
 * @param fileName
 */
function getFilePathByFileName(dirPath,fileName) {
    return getFilePathByFileNameForCaseFilename(dirPath,fileName,true);
}


/**
 * 根据文件名查找文件全路径
 * @param dirPath 文件目录
 * @param fileName 文件名称
 * @param isIgnoreCaseFilename 是否忽略大小写
 */
function getFilePathByFileNameForCaseFilename(dirPath,fileName,isIgnoreCaseFilename) {
    let dirPathResolve = path.resolve(dirPath);
    let files = fs.readdirSync(dirPathResolve);
    let result = "";
    for (let i =0; i<files.length; i++){
        let filename = files[i];
        // 判断是否忽略大小写
        if (isIgnoreCaseFilename){
            if (filename.split(".")[0].toLocaleLowerCase() == fileName.toLocaleLowerCase()){
                result = dirPath + path.sep + filename;
                break;
            }
        }else{
            if (filename.split(".")[0] == fileName){
                result = dirPath + path.sep + filename;
                break;
            }
        }

    }
    return result;
}

/**
 * 删除对象
 */
function deleteObj() {
    dm.keyPress(46)
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
 * 调整对象在在界面上的某个值，通常操作如下
 * 1. 移动到指定坐标
 * 2. 点击
 * 3.
 * @param objectCoordinate corel 界面上的可操作元素的坐标位置
 * @param menuCoordinate corelDraw 菜单栏中的坐标位置，比如某个元素的宽的坐标位置，或者搞得坐标位置
 * @param adjustValue 需要调整的值
 */
function adjustObjectInInterfaceValue(objectCoordinate, menuCoordinate, adjustValue) {
    dm.moveTo(objectCoordinate[0], objectCoordinate[1]);
    sleep.msleep(200)
    dm.leftClick();
    sleep.msleep(200)
    adjustInterfaceValue(menuCoordinate,adjustValue)
}

/**
 * 调整界面上的某个值，通常操作如下
 * 1. 点击 界面的输入框
 * 2. 删除输入框中的内容，填入指定的值
 * @param menuCoordinate corelDraw 菜单栏中的坐标位置，比如某个元素的宽的坐标位置，或者搞得坐标位置
 * @param adjustValue 需要调整的值
 */
function adjustInterfaceValue(menuCoordinate, adjustValue) {
    dm.moveTo(menuCoordinate[0], menuCoordinate[1])
    sleep.msleep(500)
    dm.leftClick();
    sleep.msleep(500)
    ctrlAndA();
    sleep.msleep(500)
    deleteObj();
    sleep.msleep(1000)
    dmExt.setClipboard(adjustValue)
    sleep.msleep(500)
    ctrlAndV();
    sleep.msleep(500)
    enter();
    sleep.msleep(500)
}

/**
 * 左箭头
 */
function left() {
    dm.keyPress(37)
}

/**
 * 调整界面上的某个值，通常操作如下
 * 1. 点击 界面的输入框
 * 2. 删除输入框中的内容，填入指定的值
 * @param menuCoordinate corelDraw 菜单栏中的坐标位置，比如某个元素的宽的坐标位置，或者搞得坐标位置
 * @param adjustValue 需要调整的值
 */
function adjustInterfaceValueNotCtrlAndA(menuCoordinate, adjustValue) {
    dm.moveTo(menuCoordinate[0], menuCoordinate[1])
    sleep.msleep(1000)
    dm.leftClick();
    sleep.msleep(1000)
    for (let i =0;i<6;i++){
        left();
        sleep.msleep(200)
    }
    for (let i =0;i<6;i++) {
        deleteObj()
        sleep.msleep(200);
    }

    let adjustValueArray = adjustValue+"".split('');
    for (let i =0;i<adjustValueArray.length;i++){
        let adjustValueArrayElement = adjustValueArray[i];
        let keyCode = keycode(adjustValueArrayElement);
        console.log(adjustValueArrayElement,keyCode);
        dm.keyPress(keyCode)
        sleep.msleep(100);
    }
    enter();
    sleep.msleep(1000)
}

// /**
//  * 获取图案路径
//  * @param filename
//  */
// function getPicFileName(filename) {
//     return getFilePathByFileName(,filename)
// }

exports.getFilePathByFileName = getFilePathByFileName
exports.selectAreaByPointArray = selectAreaByPointArray
exports.selectAreaByArray = selectAreaByArray
exports.adjustObjectInInterfaceValue = adjustObjectInInterfaceValue
exports.adjustInterfaceValue = adjustInterfaceValue
exports.adjustInterfaceValueNotCtrlAndA = adjustInterfaceValueNotCtrlAndA
exports.ratioConversion = ratioConversion
exports.getSequenceNumber = getSequenceNumber
