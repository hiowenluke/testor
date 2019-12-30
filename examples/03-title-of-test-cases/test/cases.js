
const me = [

	'About this system',
	'/about',
	{
		success: true,
		data: {
			"version": "1.0.0"
		}
	},

	'Passing test data via params, and using GET method',
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

	'Passing test data via url',
	'/say/hi?name=owen&age=100',
	{
		result: {
			success: true,
			data: {
				msg: "Hi, I am owen, 100 years old."
			}
		}
	},

	'Defining a simplest result',
	'/say/hi?name=owen&age=100',
	{
		success: true,
		data: {
			msg: "Hi, I am owen, 100 years old."
		}
	},

	'Using verify() function to verify the result',
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

	// This test case has no title, it is ok
	'/helloWorld',
	(result) => {
		return result.data.msg.indexOf('Hello') >= 0;
	},

	'Using a function to verify the result',
	'/helloWorld',
	(result) => {
		return result.data.msg.indexOf('Hello') >= 0;
	},

];

module.exports = me;
