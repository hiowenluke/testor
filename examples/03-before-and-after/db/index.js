
// Fake database
const db = {
	data: [
		{
			username: 'admin',
			password: '123456',
			isOnline: 0,
		}
	],

	async insert(userInfo) {
		const index = this.data.findIndex(item => item.username === userInfo.username);
		if (index >= 0) {
			return {error: `Username ${userInfo.username} has already exists`};
		}

		userInfo.isOnline = 0;
		this.data.push(userInfo);

		return this.data.length;
	},

	async update(username, fieldName, value) {
		const userInfo = this.data.find(item => item.username === username);
		if (!userInfo) {
			return {error: `Username ${username} can not be found`};
		}

		userInfo[fieldName] = value;
		return 1;
	},

	async delete(username) {
		const result = this.data.find((item, index) => {
			if (item.username === username) {
				this.data.splice(index, 1);
				return true;
			}
		});

		return !!result;
	},

	async select(username) {
		if (!username) {
			return this.data;
		}
		else {
			return this.data.find(item => item.username === username);
		}
	}
};

module.exports = db;
