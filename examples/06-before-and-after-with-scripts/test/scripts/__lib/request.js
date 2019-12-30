
const request = require('request');

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

const fn = (url) => {
	if (url.substr(0, 1) === '/') {
		url = 'http://localhost:3000' + url;
	}

	return new Promise(resolve => {
		request.get({url}, (error, response, body) => {
			const result = parseResult(body);
			resolve(result);
		})
	})
};

module.exports = fn;
