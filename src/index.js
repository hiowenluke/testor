
const fs = require('fs');
const path = require('path');
const kdo = require('kdo');

const cp = require('child_process');
const fx = require('fs-extra');

const config = require('./config');
const nmpath = require('nmpath');

const tempPath = path.resolve(__dirname, '../.temp');
const sourceFolderPath = path.resolve(__dirname, './template');

const testorCliOptions = [];
const mochaCliOptions = [];
let appServerPath = '';

const init = {
	parseCliOptions() {
		const options = process.argv.slice(2);
		options.forEach(opt => {
			if (opt.indexOf('--logs') >= 0 || opt.indexOf('--config') >= 0) {
				testorCliOptions.push(opt);
			}
			else if (/^[./]/.test(opt)) {
				appServerPath = opt;
			}
			else {
				mochaCliOptions.push(opt);
			}
		})
	},

	setAppServerPath() {
		const getPathOfWorkDir = () => {
			const child = cp.execSync('pwd');
			const stdout = child.toString();
			const result = stdout.split('\n')[0];
			return result;
		};

		const pwd = getPathOfWorkDir();

		if (!appServerPath || appServerPath === '.') {
			appServerPath = pwd;
		}
		else {
			switch(appServerPath.substr(0, 1)) {
				case '.':
					appServerPath = path.resolve(pwd, appServerPath);
					break;
				case '/':
					// do nothing
					break;
			}
		}
	},

	setConfig() {
		testorCliOptions.forEach(opt => {
			if (opt.indexOf('--logs') >= 0) {
				config.cliOptions.logs = true;
			}
			else if (opt.indexOf('--config') >= 0) {
				config.cliOptions.userConfigFile = opt.split('=')[1] || './config.js';
			}
		})
	},

	applyUserConfig() {
		const userConfigFile = config.cliOptions.userConfigFile;
		if (userConfigFile) {
			const filePath = path.resolve(appServerPath, userConfigFile);
			const userConfig = require(filePath);
			Object.assign(config.server, userConfig);
		}
	},

	createTempFolder() {
		if (!fs.existsSync(tempPath)) {
			fs.mkdirSync(tempPath)
		}
	}
};

const updateTemplateFiles = {
	indexJs({destFolderPath, appTestPath}) {
		const destFile = destFolderPath + '/index.js';

		const serverFolderName = path.basename(appServerPath);
		const title = serverFolderName.replace(/-/g, ' ');

		const content = fs.readFileSync(destFile, 'utf-8');
		const newContent = content
			.replace('{title}', title)
			.replace('{appServerPath}', appServerPath)
			.replace(`'{appServerConfig}'`, JSON.stringify(config.server))
			.replace(`'{cliOptions}'`, JSON.stringify(config.cliOptions))
		;

		fs.writeFileSync(destFile, newContent, 'utf-8');
	},

	createTestsJs({destFolderPath, node_modules}) {
		const destFile = destFolderPath + '/createTests.js';

		const content = fs.readFileSync(destFile, 'utf-8');
		const newContent = content
			.replace(`'lodash'`, `'${node_modules}/lodash'`)
			.replace(`'chai'`, `'${node_modules}/chai'`)
		;

		fs.writeFileSync(destFile, newContent, 'utf-8');
	},

	testJs({destFolderPath, node_modules}) {
		const destFile = destFolderPath + '/test.js';

		const content = fs.readFileSync(destFile, 'utf-8');
		const newContent = content
			.replace('{appTestPath}', appServerPath + '/test')
			.replace(`'lodash'`, `'${node_modules}/lodash'`)
			.replace(`'request'`, `'${node_modules}/request'`)
			.replace(`'qs'`, `'${node_modules}/qs'`)
		;

		fs.writeFileSync(destFile, newContent, 'utf-8');
	}
};

const fn = () => {
	kdo.doSync(init);

	const appName = path.basename(appServerPath);
	const destFolderPath = tempPath + '/' + appName;
	fx.copySync(sourceFolderPath, destFolderPath);

	const node_modules = nmpath(appServerPath);
	kdo.doSync(updateTemplateFiles, {destFolderPath, node_modules});

	const mochaFile = node_modules + "/mocha/bin/mocha";
	cp.spawn('node', [mochaFile, destFolderPath, ...mochaCliOptions], {stdio: "inherit"});
};

module.exports = fn;
