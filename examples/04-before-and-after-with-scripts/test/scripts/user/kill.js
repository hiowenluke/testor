
const request = require('../__lib/request');

const fn = async ({username}) => {
	const result = await request(`/user/kill?username=${username}`);
	return result;
};

module.exports = fn;
