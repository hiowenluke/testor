
const fs = require('fs');
const path = require('path');

const spawn = require('child_process').spawn;
const caller = require('caller');
const fx = require('fs-extra');

const config = require('./config');
const getPathOfNodeModules = require('./lib/getPathOfNodeModules');

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

const fn = (serverConfig = {}) => {
	const pathToCaller = caller();
	serverConfig = Object.assign({}, config, serverConfig);

	const tempPath = path.resolve(__dirname, '../.temp');
	createTempFolder(tempPath);

	const appTestPath = path.resolve(pathToCaller, '..');
	const appServerPath = path.resolve(appTestPath, '..');
	const appCasesFilePath = path.resolve(appTestPath, './cases.js');

	const appName = path.basename(appServerPath);
	const sourceFolderPath = path.resolve(__dirname, './template');
	const destFolderPath = tempPath + '/' + appName;
	fx.copySync(sourceFolderPath, destFolderPath);

	const node_modules = getPathOfNodeModules(appServerPath);
	updateTemplateFiles.indexJs(destFolderPath, appServerPath, serverConfig, appCasesFilePath);
	updateTemplateFiles.createTestsJs(destFolderPath, node_modules);
	updateTemplateFiles.testJs(destFolderPath, node_modules);

	const mochaFile = node_modules + "/mocha/bin/mocha";
	spawn('node', [mochaFile, destFolderPath], {stdio: "inherit"});
};

module.exports = fn;
