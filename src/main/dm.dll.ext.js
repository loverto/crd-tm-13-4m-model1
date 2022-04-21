// 导入大漠插件版本
const dm = require('@loverto/dm.dll')

/**
 * 设置粘贴板
 */
function setClipboard(value) {
    return dm.dll.SetClipboard(value);
}


/**
 * 从粘贴板取值
 */
function getClipboard() {
    return dm.dll.GetClipboard();
}

/**
 * 获取指定窗口的一些属性
 * @param hwnd 整形数: 指定的窗口句柄
 * @param flag 整形数: 取值定义如下
 * 0 : 判断窗口是否存在

 1 : 判断窗口是否处于激活

 2 : 判断窗口是否可见

 3 : 判断窗口是否最小化

 4 : 判断窗口是否最大化

 5 : 判断窗口是否置顶

 6 : 判断窗口是否无响应


 * @returns 整形数: 0: 不满足条件 1: 满足条件
 */
function getWindowState(hwnd,flag){
    return dm.dll.GetWindowState(hwnd,flag);
}

/**
 * 比较指定坐标点(x,y)的颜色
 * @param x 坐标点x
 * @param y 坐标点y
 * @param color 指定的颜色
 * @param sim 相似度
 * @returns {*}
 */
function cmpColor(x,y,color,sim){
    return dm.dll.CmpColor(x,y,color,sim);
}

/**
 * 激活指定窗口所在进程的输入法.
 * @param hwnd
 * @param input_method
 */
function activeInputMethod(hwnd,input_method){
    return dm.dll.ActiveInputMethod(hwnd,input_method);
}

/**
 * 检测指定窗口所在线程输入法是否开启.
 * @param hwnd 窗口句柄
 * @param input_method 输入法名字。具体输入法名字对应表查看注册表中以下位置:

 HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layouts

 下面的每一项下的Layout Text的值就是输入法名字


 */
function checkInputMethod(hwnd,input_method){
    return dm.dll.CheckInputMethod(hwnd,input_method);
}


exports.setClipboard=setClipboard
exports.getWindowState=getWindowState
exports.getClipboard=getClipboard
exports.cmpColor=cmpColor
exports.checkInputMethod=checkInputMethod
exports.activeInputMethod=activeInputMethod


//
// export {
//     setClipboard (value: string): number|undefined {
//         return dm.dll.SetClipboard(value);
//     }
// }
