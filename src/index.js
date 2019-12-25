
const fs = require('fs');
const path = require('path');

const spawn = require('child_process').spawn;
const caller = require('caller');
const fx = require('fs-extra');

const config = require('./config');
const nmpath = require('nmpath');

const parseAppConfig = (appConfig) => {
	const defConfig = config.server;

	appConfig.protocol = appConfig.protocol || defConfig.protocol;

	if (!appConfig.host) {
		appConfig.host = defConfig.host;

		if (!appConfig.port) {
			appConfig.port = defConfig.port;
		}
	}
	else {
		if (appConfig.host === 'localhost' || appConfig.host === '127.0.0.1') {
			if (!appConfig.port) {
				appConfig.port = defConfig.port;
			}
		}
		else {
			// myConfig.host = "www.abc.com"
			// Do not change myConfig.port
		}
	}

	return appConfig;
};

const createTempFolder = (tempPath) => {
	if (!fs.existsSync(tempPath)) {
		fs.mkdirSync(tempPath)
	}
};

const updateTemplateFiles = {
	indexJs(destFolderPath, appTestPath, serverPath, serverConfig, casesPath) {
		const destFile = destFolderPath + '/index.js';

		const serverFolderName = path.basename(serverPath);
		const title = serverFolderName.replace(/-/g, ' ');

		const content = fs.readFileSync(destFile, 'utf-8');
		const newContent = content
			.replace('{appTestPath}', appTestPath)
			.replace('{title}', title)
			.replace('{serverPath}', serverPath)
			.replace(`'{serverConfig}'`, JSON.stringify(serverConfig))
			.replace('{casesPath}', casesPath)
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

const fn = (appConfig = {}) => {
	appConfig = parseAppConfig(appConfig);

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
	updateTemplateFiles.indexJs(destFolderPath, appTestPath, appServerPath, appConfig);
	updateTemplateFiles.createTestsJs(destFolderPath, appTestPath, node_modules);
	updateTemplateFiles.testJs(destFolderPath, appTestPath, node_modules);

	const mochaFile = node_modules + "/mocha/bin/mocha";
	spawn('node', [mochaFile, destFolderPath], {stdio: "inherit"});
};

module.exports = fn;
