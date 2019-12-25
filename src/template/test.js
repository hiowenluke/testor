
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const request = require('request');
const qs = require('qs');
const cp = require('child_process');

const appTestPath = '{appTestPath}';
let hostDefinition;
let titleUrls;

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

	const isOK = verify ? verify(result) : _.isEqual(result, expect);

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
	const fromUrl = () => {

		if (/^http(s)/.test(url)) {
			// do nothing
		}
		else if (url.substr(0, 1) !== '/') {
			// title "About" => url "/about"
			const title = url;
			url = titleUrls[title];
			if (!url) {
				throw new Error(`Title ${title} is not exists`);
			}
		}

		// "/about" => "http://localhost:3000/about"
		if (url.substr(0, 1) === '/') {
			const {protocol, host} = hostDefinition;
			url = `${protocol}//${host}` + url;
		}

		return new Promise(resolve => {
			request.get({url}, (error, response, body) => {
				const result = parseResult(body);
				resolve(result);
			})
		})
	};

	const fromScript = async () => {
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
		return fromScript();
	}
	else {
		return fromUrl();
	}
};

const fn = async (testCase, _titleUrls) => {
	const [method, data] = parseTestCase(testCase);
	const {before, after, resultUrl} = testCase;

	const {protocol, host} = testCase;
	hostDefinition = {protocol, host};

	titleUrls = _titleUrls;

	before && await performUrls(before);

	return new Promise(resolve => {
		request[method](data, async (error, response, body) => {

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
