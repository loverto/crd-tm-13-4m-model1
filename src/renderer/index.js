// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    /**
     * id
     * @type {Map<any, any>}
     */
    let idsMap = new Map();
    // 属性配置
    let dialogPropertiesMap = new Map();
    // 过滤器配置
    let dialogFiltersMap = new Map();
    // 按钮与配置键配置
    let configKeysMap = new Map();
    // 文本框与配置键配置
    let textConfigMap = new Map();


    idsMap.set('exportModelFilePathBtn','exportModelFilePathText')
    idsMap.set('imageFilePathBtn','imageFilePathText')
    idsMap.set('mouldFilePathBtn','mouldFilePathText')
    idsMap.set('textFilePathBtn','textFilePathText')
    idsMap.set('modelFilePathBtn','modelFilePathText')


    dialogFiltersMap.set('exportModelFilePathBtn',[])
    dialogFiltersMap.set('imageFilePathBtn',[])
    dialogFiltersMap.set('mouldFilePathBtn',[])
    dialogFiltersMap.set('textFilePathBtn',[])
    dialogFiltersMap.set('modelFilePathBtn',[{name:"Corel Draw",extensions: ['cdr']}])


    dialogPropertiesMap.set('exportModelFilePathBtn',['openDirectory'])
    dialogPropertiesMap.set('imageFilePathBtn',['openDirectory'])
    dialogPropertiesMap.set('mouldFilePathBtn',['openDirectory'])
    dialogPropertiesMap.set('textFilePathBtn',['openFile'])
    dialogPropertiesMap.set('modelFilePathBtn',['openFile'])

    configKeysMap.set('exportModelFilePathBtn','exportModelFilePath');
    configKeysMap.set('imageFilePathBtn','imageFilePath');
    configKeysMap.set('mouldFilePathBtn','mouldFilePath');
    configKeysMap.set('textFilePathBtn','textFilePath');
    configKeysMap.set('modelFilePathBtn','modelFilePath');

    textConfigMap.set('exportModelFilePathText','exportModelFilePath');
    textConfigMap.set('imageFilePathText','imageFilePath');
    textConfigMap.set('mouldFilePathText','mouldFilePath');
    textConfigMap.set('textFilePathText','textFilePath');
    textConfigMap.set('modelFilePathText','modelFilePath');
    textConfigMap.set('pchText','pch');
    textConfigMap.set('codeText','code');

    function $(id){
        return document.getElementById(id);
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])

    }
    // 数据库
    const {DB} = require('../universal/database');

    let remote = require('electron').remote;
    let dialog = remote.dialog;
    let app = remote.app;

    let path = app.getPath('userData');
    let db = new DB(path)

    const ipc = require('electron').ipcRenderer;

    let currentVersion = db.get("currentVersion");

    ipc.on('refresh',()=>{
        // 从 数据库中读取配置文件
        if (db.has('configObject')) {
            console.log("the input value from to db")
            configObject = db.get('configObject');
            imageFilePathText.value = configObject.imageFilePath;
            textFilePathText.value = configObject.textFilePath;
            modelFilePathText.value = configObject.modelFilePath;
            mouldFilePathText.value = configObject.mouldFilePath;
            exportModelFilePathText.value = configObject.exportModelFilePath;
            pchText.value = configObject.pch;
        }
    })

    /**
     * 配置对象
     * @type {{mouldFilePath: null, pch: null, modelFilePath: null, textFilePath: null, exportModelFilePath: null, imageFilePath: null}}
     */
    let configObjectChange = {
        imageFilePath:null,
        mouldFilePath:null,
        exportModelFilePath:null,
        modelFilePath:null,
        textFilePath:null,
        pch:null,
        code:null
    };

    let imageFilePathBtn = $('imageFilePathBtn');
    let mouldFilePathBtn = $('mouldFilePathBtn');
    let textFilePathBtn = $('textFilePathBtn');
    let modelFilePathBtn = $('modelFilePathBtn');
    let exportModelFilePathBtn = $('exportModelFilePathBtn');
    let autoupdateBtn = $('autoupdate');

    let btnArray = [imageFilePathBtn,mouldFilePathBtn,textFilePathBtn,modelFilePathBtn,exportModelFilePathBtn];

    autoupdateBtn.addEventListener("click",function (e) {
        ipc.send('check-for-update', 'event-update');
    })

    $('appVersion').innerText = currentVersion.version


    /**
     *  改进，使用系统对话框替代浏览器对话框。
     *  通过electron调用系统的对话框
     * @param event
     */
    function dialogFile(event){
        // 已经有配置存在了，只修改变更的地址
        if (db.has('configObject')){
            configObjectChange = db.get('configObject')
        }

        let eleId = event.currentTarget.id

        let properties = dialogPropertiesMap.get(eleId);

        let configKey = configKeysMap.get(eleId);

        let textId = idsMap.get(eleId);

        let filters = dialogFiltersMap.get(eleId);

        dialog.showOpenDialog({
            filters:filters,
            properties: properties
        }).then(result => {
            // 不处理取消状态的按钮
            if (!result.canceled){
                let filePath = result.filePaths[0];
                console.log(filePath);
                configObjectChange[configKey] = filePath;
                $(textId).value = filePath;
                db.set('configObject',configObjectChange);

            }
            console.log(result.canceled)
            console.log(result.filePaths)
        }).catch(err => {
            console.log(err)
        });
    }

    // 通过遍历优化代码
    for (let i =0 ;i<btnArray.length;i++){
        let btnElement = btnArray[i];
        btnElement.addEventListener('click',dialogFile);
    }


    const imageFilePathText = $('imageFilePathText');
    const mouldFilePathText = $('mouldFilePathText');
    const textFilePathText = $('textFilePathText');
    const modelFilePathText = $('modelFilePathText');
    const exportModelFilePathText = $('exportModelFilePathText');
    const pchText = $('pchText');
    const codeText = $('codeText');

    let textArray = [imageFilePathText,mouldFilePathText,textFilePathText,modelFilePathText,exportModelFilePathText,pchText,codeText];


    /**
     *
     * @param event
     */
    function configChangeEvent(event) {
        // 已经有配置存在了，只修改变更的地址
        if (db.has('configObject')){
            configObjectChange = db.get('configObject')
        }
        let value = event.currentTarget.value;
        let eleId = event.currentTarget.id;
        let configKey = textConfigMap.get(eleId)
        configObjectChange[configKey] = value;
        db.set('configObject',configObjectChange);
    }


    for (let i = 0;i<textArray.length;i++){
        let textElement = textArray[i];
        textElement.addEventListener('change',configChangeEvent)

    }


    let configObject = null;

    // 从 数据库中读取配置文件
    if (db.has('configObject')) {
        console.log("the input value from to db")
        configObject = db.get('configObject');
        imageFilePathText.value = configObject.imageFilePath;
        mouldFilePathText.value = configObject.mouldFilePath;
        textFilePathText.value = configObject.textFilePath;
        modelFilePathText.value = configObject.modelFilePath;
        exportModelFilePathText.value = configObject.exportModelFilePath;
        pchText.value = configObject.pch;
    }

    const start = $('start');
    const pause = $('pause');
    const end = $('end');
    const updateKey = $('updateKey');

    start.addEventListener("click", connectMain)
    end.addEventListener("click", stop)

    function stop() {
        ipc.send('stop', "stop")
    }

    function connectMain() {
        if (!db.has('configObject')) {
            configObject = {
                imageFilePath: imageFilePathText.value,
                mouldFilePath: mouldFilePathText.value,
                textFilePath: textFilePathText.value,
                modelFilePath: modelFilePathText.value,
                exportModelFilePath: exportModelFilePathText.value,
                pch:pchText.value,
                code:codeText.value
            }
            db.set('configObject', configObject)
        }
        configObject = db.get("configObject");
        console.log(configObject)
        let configObjectString = JSON.stringify(configObject);
        console.log('configObjectString:', configObjectString);
        ipc.send('start', configObjectString)
    }
})
