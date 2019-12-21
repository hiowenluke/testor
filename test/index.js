
const spawn = require('child_process').spawn;
spawn('node', [__dirname + '/../examples/01-test-web-app/test'], {stdio: "inherit"});
