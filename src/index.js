
const fs = require('fs');
const path = require('path');

const spawn = require('child_process').spawn;
const caller = require('caller');
const fx = require('fs-extra');

const config = require('./config');
const nmpath = require('nmpath');

const mochaCliOptions = [];

const parseUserConfig = (userConfig) => {
	Object.assign(config.server, userConfig);
};

const parseCliOptions = () => {
	const args = process.argv.slice(2);
	args.forEach(arg => {
		if (arg.indexOf('logs') >= 0) {
			config.args.logs = true;
		}
		else {
			mochaCliOptions.push(arg);
		}
	})
};

const createTempFolder = (tempPath) => {
	if (!fs.existsSync(tempPath)) {
		fs.mkdirSync(tempPath)
	}
};

const updateTemplateFiles = {
	indexJs(destFolderPath, appTestPath, serverPath) {
		const destFile = destFolderPath + '/index.js';

		const serverFolderName = path.basename(serverPath);
		const title = serverFolderName.replace(/-/g, ' ');

		const content = fs.readFileSync(destFile, 'utf-8');
		const newContent = content
			.replace('{appTestPath}', appTestPath)
			.replace('{title}', title)
			.replace('{serverPath}', serverPath)
			.replace(`'{serverConfig}'`, JSON.stringify(config.server))
			.replace(`'{cliArgs}'`, JSON.stringify(config.args))
		;

		fs.writeFileSync(destFile, newContent, 'utf-8');
	},

	createTestsJs(destFolderPath, appTestPath, node_modules) {
		const destFile = destFolderPath + '/createTests.js';

		const content = fs.readFileSync(destFile, 'utf-8');
		const newContent = content
			.replace('{appTestPath}', appTestPath)
			.replace(`'lodash'`, `'${node_modules}/lodash'`)
			.replace(`'chai'`, `'${node_modules}/chai'`)
		;

		fs.writeFileSync(destFile, newContent, 'utf-8');
	},

	testJs(destFolderPath, appTestPath, node_modules) {
		const destFile = destFolderPath + '/test.js';

		const content = fs.readFileSync(destFile, 'utf-8');
		const newContent = content
			.replace('{appTestPath}', appTestPath)
			.replace(`'lodash'`, `'${node_modules}/lodash'`)
			.replace(`'request'`, `'${node_modules}/request'`)
			.replace(`'qs'`, `'${node_modules}/qs'`)
		;

		fs.writeFileSync(destFile, newContent, 'utf-8');
	}
};

const fn = (userConfig = {}) => {
	parseUserConfig(userConfig);
	parseCliOptions();

	const tempPath = path.resolve(__dirname, '../.temp');
	createTempFolder(tempPath);

	const pathToCaller = caller();
	const appTestPath = path.resolve(pathToCaller, '..');
	const appServerPath = path.resolve(appTestPath, '..');

	const appName = path.basename(appServerPath);
	const sourceFolderPath = path.resolve(__dirname, './template');
	const destFolderPath = tempPath + '/' + appName;
	fx.copySync(sourceFolderPath, destFolderPath);

	const node_modules = nmpath(appServerPath);
	updateTemplateFiles.indexJs(destFolderPath, appTestPath, appServerPath);
	updateTemplateFiles.createTestsJs(destFolderPath, appTestPath, node_modules);
	updateTemplateFiles.testJs(destFolderPath, appTestPath, node_modules);

	const mochaFile = node_modules + "/mocha/bin/mocha";
	spawn('node', [mochaFile, destFolderPath, ...mochaCliOptions], {stdio: "inherit"});
};

module.exports = fn;
