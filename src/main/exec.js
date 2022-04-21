const child_process_1 = require("child_process");





function main() {
    let storePath = process.env.storePath;
    let childProcess = child_process_1.fork(__dirname+"/crd3m.js",{env: {storePath:storePath}});
    childProcess.on('message',function (m) {
        process.send(m);
    })
}

main();
