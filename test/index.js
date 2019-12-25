
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const main = () => {
	const examplesPath = path.resolve(__dirname, '../examples');
	const exampleNames = fs.readdirSync(examplesPath);

	exampleNames.forEach(exampleName => {
		if (exampleName.substr(0, 1) === '.') return;

		const examplePath = examplesPath + '/' + exampleName;
		if (!fs.statSync(examplePath).isDirectory()) return;

		const testPath = examplePath + '/test';
		cp.spawnSync('node', [testPath], {stdio: "inherit"});
	});
};

main();
