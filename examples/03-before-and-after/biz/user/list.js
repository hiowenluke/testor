
// Test url
// http://localhost:3000/user/list

const db = require('../../db');

const fn = async () => {
	return await db.select();
};

module.exports = fn;
