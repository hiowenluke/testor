
const spawn = require('child_process').spawn;
const createTests = require('./createTests');

const appTestPath = '{appTestPath}';
const testCasesDefs = require(appTestPath + '/cases');

const title = '{title}';
const serverPath = '{serverPath}';
const serverConfig = '{serverConfig}';
const cliArgs = '{cliArgs}';

const wait = (ms = 1000) => {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	})
};

describe(title, () => {
	let cp;

	before(async () => {
		const options = cliArgs.logs ? {stdio: 'inherit'} : {};
		cp = spawn('node', [serverPath], options);
		await wait();
	});

	after(async () => {
		process.kill(cp.pid, 'SIGTERM');
	});

	createTests(serverConfig, testCasesDefs);
});
