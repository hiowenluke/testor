
const me = [
	'/about',
	{
		success: true,
		data: {
			"version": "1.0.0"
		}
	},

	'hello',
	'/helloWorld',
	(result) => {
		return result.data.msg.indexOf('Hello') >= 0;
	},
];

module.exports = me;
