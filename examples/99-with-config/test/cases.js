
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
		method: 'GET',

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
];

module.exports = me;
