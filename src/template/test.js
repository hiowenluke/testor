
const _ = require('lodash');
const request = require('request');
const qs = require('qs');

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

const compare = (result, def) => {
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

const parse = (str) => {
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

const fn = async (testCase) => {
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

	return new Promise(resolve => {
		request[method](data, (error, response, body) => {
			const result = parse(body);
			const isOK = compare(result, testCase);
			resolve(isOK);
		});
	})
};

module.exports = fn;
