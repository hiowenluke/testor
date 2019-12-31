
const expect = require('chai').expect;
const parse = require('url').parse;
const test = require('./test');
const _ = require('lodash');

const parseTestCasesDefs = (testCasesDefs, filename) => {
	let titles = [];
	let urls = [];
	let defs = [];

	let i = 0;
	testCasesDefs.forEach(item => {
		if (typeof item === 'string') {
			if (item.substr(0, 1) === '/' || /^http(s):\/\//.test(item)) {
				urls[i] = item;
			}
			else {
				if (item.indexOf('.') >= 0) {
					throw new Error(`The title ${item} in ${filename}.js should not contain "."`);
				}
				titles[i] = item;
			}
		}
		else {
			if (!titles[i]) titles[i] = urls[i];
			defs[i] = item;
			i ++;
		}
	});

	return [titles, urls, defs];
};

const getTestCases = (testCasesDefs) => {
	const [titles, urls, defs] = testCasesDefs;
	const testCases = [];

	for (let i = 0; i < urls.length; i ++) {
		const title = titles[i];
		const url = urls[i];
		const def = defs[i];

		let testCase = {};

		// {
		//		...
		// 		result: {
		// 			success: true,
		// 			data: {
		// 				msg: "Hi, I am owen, 100 years old."
		// 			}
		// 		}
		// }

		// {
		//		...
		// 		verify(result) {
		// 			return result.data.msg === 'Hi, I am owen, 100 years old.';
		// 		}
		// },

		if (typeof def.verify === 'function' || _.isPlainObject(def.result)) {
			testCase = def;
		}
		else {
			if (typeof def === 'function') {
				testCase.verify = def;
			}
			else {
				testCase.result = def;
			}
		}

		testCase.title = title;
		testCase.originalUrl = url;

		testCases.push(testCase);
	}

	return testCases;
};

const parseUrls = (serverConfig, testCases) => {
	let {protocol, host, port} = serverConfig;

	if (!/:$/.test(protocol)) {
		protocol = protocol + ':';
	}

	if (port) { // localhost:3000
		host = host + ":" + port;
	}

	testCases.forEach(testCase => {
		let url = testCase.originalUrl;

		// /say/hi?name=owen&age=100 =>
		// http://localhost:3000/say/hi?name=owen&age=100
		if (url.substr(0, 1) === '/') {
			url = protocol + '//' + host + url;
		}

		const myUrl = parse(url);

		testCase.protocol = myUrl.protocol; // http:
		testCase.host = myUrl.host; // localhost:3000
		testCase.api = myUrl.pathname; // /say/hi
		testCase.query = myUrl.query; // name=owen&age=100
	});
};

const fn = (serverConfig, appTestPath, casesFiles) => {
	const allDefs = {};

	casesFiles.forEach(filename => {
		const filepath = appTestPath + '/' + filename;
		const defs = require(filepath);

		const testCasesDefs = parseTestCasesDefs(defs, filename);
		const testCases = getTestCases(testCasesDefs);
		parseUrls(serverConfig, testCases);

		const catName = filename.replace(/\.js$/, ''); // "others.js" => "others"
		allDefs[catName] = testCases;
	});

	Object.keys(allDefs).forEach(catName => {
		const thisDefs = allDefs[catName];

		for (let i = 0; i < thisDefs.length; i ++) {
			const testCase = thisDefs[i];
			const prefix = casesFiles.length === 1 ? '' : '[' + catName + '] ';

			it(prefix + testCase.title, async () => {
				const result = await test(testCase, catName, allDefs);
				expect(result).to.be.true;
			});
		}
	});
};

module.exports = fn;
