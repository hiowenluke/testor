
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
	user: {
		async insert(userInfo) {
			userInfo.isOnline = 0;
			data.user.push(userInfo);

			const id = data.user.length;
			return id;
		},

		async update(username, fieldName, value) {
			const userInfo = data.user.find(item => item.username === username);
			userInfo[fieldName] = value;

			return 1;
		},

		async delete(username) {
			const result = data.user.find((item, index) => {
				if (item.username === username) {
					data.user.splice(index, 1);
					return true;
				}
			});

			return !!result;
		},

		async select(username) {
			if (!username) {
				return data.user;
			}
			else {
				return data.user.find(item => item.username === username);
			}
		}
	}
};

module.exports = db;
