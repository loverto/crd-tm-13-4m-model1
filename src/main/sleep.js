// const  s = require('sleep');
function msleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}
function sleep(n) {
    msleep(n*1000);
}

exports.sleep = sleep
exports.msleep = msleep
