
const me = [
	'/say/hi?name=owen&age=100',
	{
		before: [
			// Referer the test case via the url "/about" in "others"
			"others./about"
		],

		result: {
			success: true,
			data: {
				msg: "Hi, I am owen, 100 years old."
			}
		}
	},

	'/say/hi',
	{
		before: [
			// Referer the test case via the title "hello" in "others"
			'others.hello'
		],

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
