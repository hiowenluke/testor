
const spawn = require('child_process').spawn;
const createTests = require('./createTests');

const appTestPath = '{appTestPath}';
const testCasesDefs = require(appTestPath + '/cases');

const title = '{title}';
const serverPath = '{serverPath}';
const serverConfig = '{serverConfig}';

const wait = (ms = 1000) => {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	})
};

describe(title, () => {
	let cp;

	before(async () => {
		cp = spawn('node', [serverPath]);
		await wait();
	});

	after(async () => {
		process.kill(cp.pid, 'SIGTERM');
	});

	createTests(serverConfig, testCasesDefs);
});
