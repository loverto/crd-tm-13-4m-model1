const dm = require('@loverto/dm.dll')
const dmExt = require('../src/main/dm.dll.ext')

const windowTitle = "CorelDRAW X6 (64 位)";

function activeInput(windowTitle,input) {
    console.log(windowTitle)
    const hwnd = dm.findWindow("", windowTitle);
    if (dmExt.checkInputMethod(hwnd, input) == 0) {
        dmExt.activeInputMethod(hwnd, input)
    }
}
let input = "US"

activeInput(windowTitle,input);
