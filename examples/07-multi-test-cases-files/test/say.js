
const me = [
	'/say/hi',
	{
		method: 'GET', // default is POST

		params: {
			name: 'owen',
			age: 100
		},

		result: {
			success: true,
			data: {
				msg: "Hi, I am owen, 100 years old."
			}
		}
	},

	'/say/hi?name=owen&age=100',
	{
		result: {
			success: true,
			data: {
				msg: "Hi, I am owen, 100 years old."
			}
		}
	},

	'/say/hi?name=owen&age=100',
	{
		success: true,
		data: {
			msg: "Hi, I am owen, 100 years old."
		}
	},


	'/say/hi',
	{
		params: {
			name: 'owen',
			age: 100
		},

		verify(result) {
			return result.data.msg === 'Hi, I am owen, 100 years old.';
		}
	},
];

module.exports = me;
