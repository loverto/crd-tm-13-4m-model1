const fs = require("fs");
const path = require('path');

//设置根目录
var root = 'C:\\Users\\ylf\\WebstormProjects\\electron-quick-start\\test';

var arr = [];

//获取此文件夹下所有的文件(数组)
var files = fs.readdirSync(root);

//遍历这些文件或者文件夹
for(var i=0;i<files.length;i++){
    //为文件创建一个描述对象
    var filePath = {};
    //添加name属性
    filePath.name = files[i];
    console.log(files[i])
    var fileStat = fs.statSync(path.join(root,files[i]));
    //判断是否是文件夹
    if(fileStat.isDirectory()){
        //文件夹类型则添加type属性为dir
        filePath.type = 'dir';
    }else{
        //文件类型则添加type属性为文件后缀名
        filePath.type = path.extname(files[i]).substring(1);
    }
    //将对象添加到数组中
    arr.push(filePath);
}
