
const request = require('../__lib/request');

const fn = async ({username, password}) => {
	const result = await request(`/user/login?username=${username}&password=${password}`);
	return result;
};

module.exports = fn;
