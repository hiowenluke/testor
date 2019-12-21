
const me = [
	'/about',
	{
		success: true,
		data: {
			"version": "1.0.0"
		}
	},

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

	'/helloWorld',
	(result) => {
		return result.data.msg.indexOf('Hello') >= 0;
	},
];

module.exports = me;
