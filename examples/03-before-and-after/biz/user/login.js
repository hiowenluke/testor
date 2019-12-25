
// Test url
// http://localhost:3000/user/login?username=owen

const db = require('../../db');

const fn = async (username) => {
	const result = await db.user.update(username, 'isOnline', 1);
	return !!result;
};

module.exports = fn;
