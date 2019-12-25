
const data = {
	user: [
		{
			username: 'admin',
			password: '123456',
			isOnline: 0,
		}
	]
};

// Fake database
const db = {

	async insert(tableName, userInfo) {
		const index = data[tableName].findIndex(item => item.username === userInfo.username);
		userInfo.isOnline = 0;
		data[tableName].push(userInfo);

		return data[tableName].length;
	},

	async update(tableName, username, fieldName, value) {
		const userInfo = data[tableName].find(item => item.username === username);
		userInfo[fieldName] = value;

		return 1;
	},

	async delete(tableName, username) {
		const result = data[tableName].find((item, index) => {
			if (item.username === username) {
				data[tableName].splice(index, 1);
				return true;
			}
		});

		return !!result;
	},

	async select(tableName, username) {
		if (!username) {
			return data[tableName];
		}
		else {
			return data[tableName].find(item => item.username === username);
		}
	}
};

module.exports = db;
