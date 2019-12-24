
const fs = require('fs');
const path = require('path');

const spawn = require('child_process').spawn;
const caller = require('caller');
const fx = require('fs-extra');

const config = require('./config');
const nmpath = require('nmpath');

const parseUserConfig = (myConfig) => {
	myConfig.protocol = myConfig.protocol || config.protocol;

	if (!myConfig.host) {
		myConfig.host = config.host;

		if (!myConfig.port) {
			myConfig.port = config.port;
		}
	}
	else {
		if (myConfig.host === 'localhost' || myConfig.host === '127.0.0.1') {
			myConfig.port = config.port;
		}
		else {
			// myConfig.host = "www.abc.com"
			// Do not change myConfig.port
		}
	}

	return myConfig;
};

const createTempFolder = (tempPath) => {
	if (!fs.existsSync(tempPath)) {
		fs.mkdirSync(tempPath)
	}
};

const updateTemplateFiles = {
	indexJs(destFolderPath, serverPath, serverConfig, casesPath) {
		const destFile = destFolderPath + '/index.js';

		const serverFolderName = path.basename(serverPath);
		const title = serverFolderName.replace(/-/g, ' ');

		const content = fs.readFileSync(destFile, 'utf-8');
		const newContent = content
			.replace('{title}', title)
			.replace('{serverPath}', serverPath)
			.replace(`'{serverConfig}'`, JSON.stringify(serverConfig))
			.replace('{casesPath}', casesPath)
		;

		fs.writeFileSync(destFile, newContent, 'utf-8');
	},

	createTestsJs(destFolderPath, node_modules) {
		const destFile = destFolderPath + '/createTests.js';

		const content = fs.readFileSync(destFile, 'utf-8');
		const newContent = content
			.replace(`'lodash'`, `'${node_modules}/lodash'`)
			.replace(`'chai'`, `'${node_modules}/chai'`)
		;

		fs.writeFileSync(destFile, newContent, 'utf-8');
	},

	testJs(destFolderPath, node_modules) {
		const destFile = destFolderPath + '/test.js';

		const content = fs.readFileSync(destFile, 'utf-8');
		const newContent = content
			.replace(`'lodash'`, `'${node_modules}/lodash'`)
			.replace(`'request'`, `'${node_modules}/request'`)
			.replace(`'qs'`, `'${node_modules}/qs'`)
		;

		fs.writeFileSync(destFile, newContent, 'utf-8');
	}
};

const fn = (myConfig = {}) => {
	myConfig = parseUserConfig(myConfig);

	const tempPath = path.resolve(__dirname, '../.temp');
	createTempFolder(tempPath);

	const pathToCaller = caller();
	const appTestPath = path.resolve(pathToCaller, '..');
	const appServerPath = path.resolve(appTestPath, '..');
	const appCasesFilePath = path.resolve(appTestPath, './cases.js');

	const appName = path.basename(appServerPath);
	const sourceFolderPath = path.resolve(__dirname, './template');
	const destFolderPath = tempPath + '/' + appName;
	fx.copySync(sourceFolderPath, destFolderPath);

	const node_modules = nmpath(appServerPath);
	updateTemplateFiles.indexJs(destFolderPath, appServerPath, myConfig, appCasesFilePath);
	updateTemplateFiles.createTestsJs(destFolderPath, node_modules);
	updateTemplateFiles.testJs(destFolderPath, node_modules);

	const mochaFile = node_modules + "/mocha/bin/mocha";
	spawn('node', [mochaFile, destFolderPath], {stdio: "inherit"});
};

module.exports = fn;
