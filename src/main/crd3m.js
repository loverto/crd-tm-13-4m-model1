// 导入大漠插件版本
const path = require("path");

const dm = require('@loverto/dm.dll')
const sleep = require('./sleep');
const fs = require('fs')
const readline = require('readline');

const dmExt = require('./dm.dll.ext')
const coreldraw = require('./coreldraw')
const common = require('./common')
const _ = require('lodash')

const keycode = require('keycode')

const log4js = require('log4js');
log4js.configure({
    appenders: {
        out: { type: 'stdout' },
        stb13: { type: 'file', filename: process.env.storePath+path.sep+'stb-13.log' } },
    categories: { default: { appenders: ['out','stb13'], level: 'debug' } }
});

const logger = log4js.getLogger('stb');

const {DB} = require('./database')

let keepTable = new Map()
let value = [1, 2]
let value1 = [1, 3]
let value2 = [4]

keepTable.set("1", value)
keepTable.set("2", value1)
keepTable.set("3", value2)

// 保存尺寸与位置的映射关系
let keepPicTable = new Map();

keepPicTable.set("15",1);
keepPicTable.set("14",2);
keepPicTable.set("13",3);
keepPicTable.set("12",4);
keepPicTable.set("11",4);

// 获取大漠插件的版本
logger.debug(dm.dll.ver())

let db = null;

const windowTitle = "CorelDRAW X6 (64 位)";
let devWidth = 1440
let devHeight = 900
let screenSize = dm.getScreenSize();
logger.debug(screenSize)
let winW = screenSize.width/devWidth;
let winH = screenSize.height/devHeight;

// dpi 界面坐标
let dpiUIPosition = [1021,629]

let dpiSwitchCoordinate = [871,529]

let dpiSwitchFlagCoordinate =  [869,548]
let dpiSwitchFlagColor =  "000000"
let dpiSwitchFlagSim =  0.8

// 需要修改的dpi的值
let dpiValue = 96

let fileSuff = ".cdr";

let modelFilePath = ""
let textFilePath = ""
let imageFilePath = ""
let mouldFilePath = ""
let exportModelFilePath = ""
let pch = ""

// 贴膜模具位置，4个
let modelPosition = ["530,253","586,250","532,414","586,414"]
// let mouldPosition = ["  ","180,503","267,504","346,503","425,500"]
let mouldPosition = ["  ","176,492","265,496","354,494","438,491"]

// let mergePosition = ["526,312","599,313","523,472","601,475"]
let mergePosition = ["533,292","586,295","535,449","589,453"]

let topArea = ["472,210","695,406"]
let bottomArea = ["678,570","418,367"]


// 导出需要选择的坐标点
let exportCoordinate = ["408,272","583,435"]

// 手提包 13面的正常的坐标 4个
let modelNormal = ["530,314","530,340","530,369","530,395"]

// 旋转坐标点
let spinCoordinate = [366,96]

// 箭头坐标
let arrowCoordinate = [12,136]


// 导入图片坐标
let importImagePositionCoordinate = ["149,481","180,503","267,504","346,503","425,500"]


// 左上角点击坐标
let leftClickCoordinate = importImagePositionCoordinate[0].split(",")

// 空白位置坐标
let clickWhite = [207,328]


// 模板坐标坐标
let modelCoordinate = importImagePositionCoordinate


// 宽和高位置
let widthAndHeightPosition = ["180,88","180,108"]
// 宽高参数
let widthHeightParam = ["389,247","357,255","347,245","325,229.5"]
// 参考行坐标
let refRowCoordinate =["396,495","526,498","667,503","800,498"]
// 批量复制左上右下坐标
let batchCopyCoordinate = ["120,453", "407,519"]

// 替换坐标
// 替换文本查找坐标, 替换文本替换坐标, 全部替换坐标,替换完成，替换关闭
let replaceCoordinate = common.ratioConversion(["614,396","610,426","907,455","748,484","966,363"],winW,winH)
// 替换需要查找的文本
let findText = "编号位置";
// 批次号增量标记
let pchIncreateFlag = -1


let refYValueOne = 103 * (winH)
let refYValueTwo = 76 * (winH)
let refYValueThree = 133 * (winH)
let refYValueFour = 64 * (winH)

let diffOne = 0;
let diffTwo = 0;

/*
* 按行读取文件内容
* 返回：字符串数组
* 参数：fReadName:文件名路径
*      callback:回调函数
* */
function readFileToArr(fReadName,callback){
    const fRead = fs.createReadStream(fReadName);
    const objReadline = readline.createInterface({
        input: fRead
    });
    const arr = new Array();
    objReadline.on('line',function (line) {
        arr.push(line);
        //console.log('line:'+ line);
    });
    objReadline.on('close',function () {
        // console.log(arr);
        callback(arr);
    });
}


/**
 * 主方法
 */
function main(configObject) {
    logger.debug("tm 3m is starting up ")
    if (!configObject){
        let storePath = process.env.storePath;
        db = new DB(storePath);
        logger.debug("from db config")
        configObject  = db.get("configObject");
        logger.debug("config value " + JSON.stringify(configObject))
    }


    initConfig(configObject);
    // 如果没有找到窗口，则退出
    if (!coreldraw.findCorelDrawAndFullScreen(windowTitle)){
        logger.debug("corel draw window is not find")
        return;
    };

    //activeInput(windowTitle,"US")
    // return;
    logger.debug("corel draw eas")
    coreldraw.eas();
    logger.debug("corel draw start open model")
    coreldraw.openUModel(modelFilePath)
    sleep.msleep(1000)
    logger.debug("corel draw mouse is move arrow")
    // 设置为可移动
    coreldraw.moveAndClick(arrowCoordinate)
    if (fs.existsSync(textFilePath)){
        logger.debug("file is exists")
        //let readFileSync = fs.readFileSync(textFilePath);
        // 按行读取数据
        readFileToArr(textFilePath,function (dataa) {
            logger.debug("data length"+dataa.length)

            let i =0;
            let j = 0
            // 先屏蔽该逻辑
            if (db.has('crd') && false){
                let crd = db.get('crd');
                logger.debug("crd from db config"+JSON.stringify(crd));
                // 当前执行的批次数
                i = crd.currentBatch;
                // 当前执行的条数
                j = crd.currentRow;
                // 获取缓存的批次号
                pch = crd.pch;
                // 获取缓存的批次号量
                pchIncreateFlag = crd.pchIncreateFlag;
            }
            let dataArr = _.chunk(dataa,4);
            logger.debug("dataArr ：" + dataArr.length);
            // 遍历按行读取的数据
            for (i; i<dataArr.length; i++){
                //db.set('crd',{currentBatch: i,pch:pch,pchIncreateFlag:pchIncreateFlag})
                let data = dataArr[i]
                logger.debug("data raw:"+JSON.stringify(data));
                for (let j = 0;j<data.length;j++){
                    // 图案编号，尺寸，型号代码，产品类型信息
                    let datum = data[j]
                    let currentData = datum.split(",");
                    let picfilename = currentData[0];
                    let mouldfilename = currentData[2];
                    let modelNumber = currentData[1];
                    let keep = currentData[3];
                    let picPath = common.getFilePathByFileName(imageFilePath,picfilename);
                    // 模具路径
                    let mouldPath = common.getFilePathByFileName(mouldFilePath,mouldfilename);
                    logger.debug("图片路径:"+picPath+"模具路径:"+mouldPath+"模具文件路径:"+mouldFilePath);
                    // 图片路径和模板路径都存在
                    if (fs.existsSync(picPath) && fs.existsSync(modelFilePath) && fs.existsSync(mouldPath)){
                        handler(picPath,mouldPath,false,modelCoordinate,picfilename,j,modelNumber,keep)
                    }
                    logger.debug("开始点击空白位置")
                    sleep.msleep(500)
                    coreldraw.moveAndClick(clickWhite)
                    sleep.msleep(500)

                    // 执行完数组中的值，就保存够13张则保存图片
                    if (j==data.length-1){


                        dm.keyDown(keycode("shift"));

                        for (let i = 0 ;i<mergePosition.length;i++){
                            let split = mergePosition[i].split(",")
                            coreldraw.moveAndClick(split);
                            sleep.msleep(400);
                        }
                        dm.keyUp(keycode("shift"));

                        coreldraw.ctrlAndG();


                        // 置底
                        sleep.msleep(300);
                        dm.keyDown(keycode("shift"))
                        dm.keyPress(keycode("page down"))
                        dm.keyUp(keycode("shift"))

                        logger.debug("开始点击空白位置")
                        sleep.msleep(500)
                        coreldraw.moveAndClick(clickWhite)
                        sleep.msleep(500)


                        // 按区域选中组合
                        dm.keyDown(keycode("shift"))

                        common.selectAreaByArray(topArea);

                        common.selectAreaByArray(bottomArea);

                        dm.keyUp(keycode("shift"))

                        coreldraw.ctrlAndG();

                        logger.debug("开始点击空白位置")
                        sleep.msleep(500)
                        coreldraw.moveAndClick(clickWhite)
                        sleep.msleep(500)




                        logger.debug("张数够了，开始保存")
                        logger.debug("开始获取序列号"+pch+pchIncreateFlag)
                        // 获取序列号
                        let result = common.getSequenceNumber(pch,pchIncreateFlag);
                        logger.debug("获取序列号后的结果"+JSON.stringify(result))
                        pch = result.pch;
                        pchIncreateFlag = result.pchIncreateFlag
                        let crd = {currentBatch:i,currentRow: j,pch:pch,pchIncreateFlag:pchIncreateFlag};
                        logger.debug("开始存储序列号到数据库中"+JSON.stringify(crd))
                        db.set('crd',crd)
                        logger.debug("开始替换编号")
                        // 替换编号
                        coreldraw.findAndReplaceText(replaceCoordinate,findText,pch);

                        sleep.msleep(200);
                        logger.debug("开始保存文件")
                        let exportPathAbsout = exportModelFilePath + path.sep + pch + fileSuff;
                        logger.debug("开始另存为"+exportPathAbsout)
                        coreldraw.saveAsPath(exportPathAbsout);
                        sleep.msleep(3000)
                        logger.debug("保存完毕，开始关闭当前标签页")
                        coreldraw.closeModel();
                        coreldraw.closeModel();
                        coreldraw.closeModel();
                        sleep.msleep(500)
                        logger.debug("关闭完毕")
                        coreldraw.eas();
                        // 保存当前的序列号
                        if(db.has("configObject")){
                            configObject.pch = pch;
                            db.set("configObject",configObject)
                            logger.debug("把pch保存到数据库中"+JSON.stringify(configObject))
                        }

                    }

                }


                // // 执行完重置该行数据
                // j = 0;
                logger.debug("保存之后，判断是否需要打开新的模板")
                if (i<=dataArr.length-1){
                    logger.debug("执行完毕，开始保存，共执行"+i+"版");
                    sleep.msleep(500)
                    coreldraw.openUModel(modelFilePath);
                    sleep.msleep(200)
                    // 可移动坐标
                    coreldraw.moveAndClick(arrowCoordinate)
                }

            }

            // 最后执行完当前所有的图片后，编号自动更新一位，避免下次重命名
            // 获取序列号
            let result = common.getSequenceNumber(pch,pchIncreateFlag);
            pch = result.pch;
            pchIncreateFlag = result.pchIncreateFlag

            // 保存当前的序列号
            if(db.has("configObject")){
                configObject.pch = pch;
                db.set("configObject",configObject)
            }

            process.send({totalSize:dataa.length})

        })
    }

}

/**
 * 激活输入法
 * 该发放暂时不可用
 * @param windowTitle
 * @param input
 */
function activeInput(windowTitle,input) {
    const hwnd = dm.findWindow("", windowTitle);
    if (dmExt.checkInputMethod(hwnd, input) == 0) {
        dmExt.activeInputMethod(hwnd, input)
    }
}

/**
 * 导入模型并解锁
 * @param coreldrawHandlerFilePath
 */
function importModelAndUnLock (coreldrawHandlerFilePath) {
    coreldraw.importUModel(coreldrawHandlerFilePath)
    sleep.msleep(500)
    logger.debug('start position' + JSON.stringify(leftClickCoordinate))
    dm.moveTo(leftClickCoordinate[0], leftClickCoordinate[1])
    sleep.msleep(200)
    dm.leftClick()
    sleep.msleep(2000)
    logger.debug('开始解除组合')
    // 解锁
    coreldraw.ctrlAndU()

    logger.debug('点击空白坐标')
    // 点击空白坐标
    sleep.msleep(500)
    coreldraw.moveAndClick(clickWhite)
    sleep.msleep(500)

    logger.debug('开始删除无关的图')
}

/**
 * 核心处理业务方法
 * @param coreldrawHandlerFilePath 文件路径
 * @param model 模型
 * @param flag 标志位
 * @param coordinateArray 坐标点数组
 * @param filename 文件名称
 * @param number 当前张数
 * @param modelNumber 型号代码
 * @param keep 模具类型
 */
function handler(coreldrawHandlerFilePath,model,flag,coordinateArray,filename,number,modelNumber,keep) {
    logger.debug("corelDrawHandlerFilePath:"+coreldrawHandlerFilePath+",model:"+model
    + ",flag:" + flag+",coordinateArray:"+coordinateArray+",filename:"+filename+
        ",number:"+number+
      ",modelNumber:" + modelNumber+
      ",keep:" + keep
    )
    sleep.msleep(500)
    logger.debug("start import model")
    importModelAndUnLock(coreldrawHandlerFilePath)
    // 删除不相关的图
    let moveCoordinate = [];
    // 14 寸
    // let keepPic = 3;
    let keepPic = keepPicTable.get(modelNumber);
    moveCoordinate = coreldraw.deleteOtherObject(coordinateArray, keepPic);

    let endCoordinate = modelPosition[number].split(",");

    logger.debug("开始移动图片")
    // common.selectAreaByPointArray(moveCoordinate,endCoordinate);
    // 通过快捷键方式对齐，比通过坐标对其更精准
    dm.keyDown(keycode("shift"))
    coreldraw.moveAndClick(moveCoordinate);
    sleep.msleep(200);
    coreldraw.moveAndClick(endCoordinate);
    sleep.msleep(200);
    dm.keyUp(keycode("shift"));
    sleep.msleep(500);

    // dm.keyPress(keycode("shift"));
    sleep.msleep(500);
    dm.keyPress(keycode("c"));
    dm.keyPress(keycode("e"));



    // 开始移动模具

    sleep.msleep(500)
    logger.debug("start import mould")
    importModelAndUnLock(model);

    logger.debug("keep tables raw data is :"+JSON.stringify(keepTable))
    logger.debug("keep raw data is :"+JSON.stringify(keep) + (typeof keep))

    let keepPics = keepTable.get(keep);
    logger.debug("keep pics raw data:"+JSON.stringify(keepPics))
    coreldraw.deleteOtherObjectForKeepManyObject(mouldPosition, keepPics);

    endCoordinate = modelPosition[number].split(",");

    logger.debug("开始移动图片")

    dm.keyDown(keycode("shift"))
    for (let i =0;i<keepPics.length;i++){
        moveCoordinate = mouldPosition[keepPics[i]].split(",");
        coreldraw.moveAndClick(moveCoordinate)
        sleep.msleep(600);
        //common.selectAreaByPointArray(moveCoordinate,endCoordinate);
    }
    sleep.msleep(500);
    coreldraw.moveAndClick(endCoordinate);
    sleep.msleep(500);
    dm.keyUp(keycode("shift"));
    sleep.msleep(500);
    // dm.keyPress(keycode("shift"));
    sleep.msleep(200);
    dm.keyPress(keycode("c"));
    dm.keyPress(keycode("e"));


}

/**
 * 初始化配置文件
 * @param configObject 配置对象
 */
function initConfig(configObject) {
    modelFilePath = configObject.modelFilePath;
    imageFilePath = configObject.imageFilePath;
    mouldFilePath = configObject.mouldFilePath;
    exportModelFilePath = configObject.exportModelFilePath;
    textFilePath = configObject.textFilePath;
    pch = configObject.pch;
}

exports.main = main


main();
