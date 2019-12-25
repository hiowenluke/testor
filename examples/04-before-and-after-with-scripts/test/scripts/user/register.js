
const request = require('../__lib/request');

const fn = async ({username, password}) => {
	const result = await request(`/user/register?username=${username}&password=${password}`);
	return result;
};

module.exports = fn;
