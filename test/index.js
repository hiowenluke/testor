
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const main = () => {

	// Responds to package.json
	// {
	// 		"scripts": {
	// 			"test-debug": "node test --inspect-brk"
	// 		}
	// 	}
	const argv = process.argv.slice(1); // ['--inspect-brk']
	const debug = argv.find(arg => arg.indexOf('--inspect-brk') >= 0) ? '--inspect-brk' : '';

	const testorPath = path.resolve(__dirname, '../bin/testor');
	const examplesPath = path.resolve(__dirname, '../examples');
	const exampleNames = fs.readdirSync(examplesPath);

	exampleNames.forEach(exampleName => {
		if (exampleName.substr(0, 1) === '.') return;

		const examplePath = examplesPath + '/' + exampleName;
		if (!fs.statSync(examplePath).isDirectory()) return;

		const args = [testorPath, examplePath];
		if (debug) args.unshift(debug);

		const userConfigFile = fs.existsSync(examplePath + '/config.js') ? '--config' : '';
		if (userConfigFile) args.push(userConfigFile);

		cp.spawnSync('node', args, {stdio: "inherit"});
	});
};

main();
