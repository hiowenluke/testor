
const spawn = require('child_process').spawn;
const createTests = require('./createTests');

const title = '{title}';
const appServerPath = '{appServerPath}';
const appServerConfig = '{appServerConfig}';
const cliOptions = '{cliOptions}';

const testCasesDefs = require(appServerPath + '/test/cases');

const wait = (ms = 1000) => {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	})
};

describe(title, () => {
	let cp;

	before(async () => {
		const options = cliOptions.logs ? {stdio: 'inherit'} : {};
		cp = spawn('node', [appServerPath], options);
		await wait();
	});

	after(async () => {
		process.kill(cp.pid, 'SIGTERM');
	});

	createTests(appServerConfig, testCasesDefs);
});
