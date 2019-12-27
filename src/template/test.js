
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const request = require('request');
const qs = require('qs');
const cp = require('child_process');

const appTestPath = '{appTestPath}';
let hostDefinition = {};
let testCases = [];

const detectMethod = (api, method) => {
	if (!method) {
		if (api === '/' || /\.htm[l]$/.test(api)) {
			method = 'get';
		}
		else {
			method = 'post';
		}
	}

	return method;
};

const compareResult = (result, def) => {
	const verify = def.verify;
	const expect = def.result;

	let isOK;
	try {
		isOK = verify ? verify(result) : _.isEqual(result, expect);
	}
	catch(e) {
		console.log(e);
		return false;
	}

	if (!isOK) {
		console.log('result', JSON.stringify(result, null, 4));

		!verify &&
		console.log('expect', JSON.stringify(expect, null, 4));
	}

	return isOK;
};

const parseResult = (str) => {
	let result = str;

	if (!/[[{]/.test(result)) {
		return result;
	}

	try {
		result = JSON.parse(str);
	}
	catch(e) {}

	return result;
};

const parseTestCase = (testCase) => {
	let {protocol, host, method, api, query, params} = testCase;

	method = detectMethod(api, method);
	method = method.toLowerCase();

	let url, data;

	if (method === 'get') {
		if (params) { // Use params first
			query = qs.stringify(params);
		}

		url = `${protocol}//${host}` + api + '?' + query;
		data = {url};
	}
	else {
		if (!params) { // Parse params from query
			params = query ? qs.parse(query) : {};
		}

		url = `${protocol}//${host}` + api;
		data = {url, form: params};
	}

	return [method, data];
};

const performUrls = async (urls) => {
	if (typeof urls === 'string') {
		urls = [urls];
	}

	for (let i = 0; i < urls.length; i ++) {
		const url = urls[i];
		await getResultFromUrl(url);
	}
};

const getResultFromUrl = (url) => {
	const forUrl = () => {

		if (/^http(s)/.test(url)) {
			// do nothing
		}
		else

		// title "About" => url "/about"
		if (url.substr(0, 1) !== '/') {
			const title = url;
			const index = testCases.findIndex(item => item.title === title);
			if (index === -1) {
				throw new Error(`Title ${title} is not exists`);
			}

			const originalUrl = testCases[index].originalUrl;
			const params = testCases[index].params;
			if (!params) {
				url = originalUrl;
			}
			else {
				// params = {name: "json", age: 30}
				url = originalUrl.split('?')[0]; // /say/hi?name=owen => /say/hi
				url += '?' + qs.stringify(params); // /say/hi?name=jason&age=30
			}
		}

		// "/about" => "http://localhost:3000/about"
		if (url.substr(0, 1) === '/') {
			const {protocol, host} = hostDefinition;
			url = `${protocol}//${host}` + url;
		}

		// For unicode
		url = encodeURI(url);

		return new Promise(resolve => {
			request.get({url}, (error, response, body) => {
				if (error) {
					throw new Error(error);
				}

				const result = parseResult(body);
				resolve(result);
			})
		})
	};

	const forScript = async () => {
		url = url
			.replace(/^\.\/scripts\//i, '')
			.replace(/^\.\//, '')
		;

		const [scriptFile, queryStr] = url.split('?');
		const extName = /\.js$/.test(scriptFile) ? '' : '.js';
		const query = queryStr ? qs.parse(queryStr) : {};

		const scriptPath = appTestPath + '/scripts/' + scriptFile + extName;
		const fileContent = fs.readFileSync(scriptPath, 'utf-8');

		const isExports = /((^|\n)module\.exports\s*?=)|((^|\n)exports\s*?=)/.test(fileContent);
		if (isExports) {
			const fn = require(scriptPath);
			return await fn(query);
		}
		else {
			const queryJson = JSON.stringify(query);
			cp.spawnSync('node',[scriptPath, queryJson], {stdio: 'inherit'});
		}
	};

	if (url.substr(0, 1) === '.') {
		return forScript();
	}
	else {
		return forUrl();
	}
};

const fn = async (testCase, _testCases) => {
	const [method, data] = parseTestCase(testCase);
	const {before, after, resultUrl} = testCase;

	const {protocol, host} = testCase;
	hostDefinition = {protocol, host};
	testCases = _testCases;

	before && await performUrls(before);

	return new Promise(resolve => {
		request[method](data, async (error, response, body) => {
			if (error) {
				console.log(error);
				return resolve(false);
			}

			if (!body) {
				return resolve(false);
			}

			const result = resultUrl ?
				await getResultFromUrl(resultUrl) :
				parseResult(body)
			;

			after && await performUrls(after);

			const isOK = compareResult(result, testCase);
			resolve(isOK);
		});
	})
};

module.exports = fn;
