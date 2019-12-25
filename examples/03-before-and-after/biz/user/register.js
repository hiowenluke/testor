
// Test url
// http://localhost:3000/user/register?username=owen&password=123

const db = require('../../db');

const fn = async (username, password) => {
	return await db.insert('user', {username, password});
};

module.exports = fn;
