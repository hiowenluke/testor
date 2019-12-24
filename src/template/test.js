
const _ = require('lodash');
const request = require('request');
const qs = require('qs');

let hostDefinition;

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

const fn = async (testCase) => {
	const [method, data] = parseTestCase(testCase);
	const {before, after, resultUrl} = testCase;

	const {protocol, host} = testCase;
	hostDefinition = {protocol, host};

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
