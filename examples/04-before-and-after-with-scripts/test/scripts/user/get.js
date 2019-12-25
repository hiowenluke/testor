
const request = require('../__lib/request');

const fn = async ({username}) => {
	const result = await request(`/user/get?username=${username}`);
	return result;
};

module.exports = fn;
