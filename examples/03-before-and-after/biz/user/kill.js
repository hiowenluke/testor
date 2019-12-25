
// Test url
// http://localhost:3000/user/kill?username=owen

const db = require('../../db');

const fn = async (username) => {
	return await db.delete('user', username);
};

module.exports = fn;
