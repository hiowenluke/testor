
const me = [

	'register',
	'/user/register?username=owen&password=123',
	{
		before: 'kill',

		verify(result) {
			return result.data > 0;
		}
	},

	'get',
	'/user/get?username=owen',
	{
		verify(result) {
			return result.data.username === 'owen';
		}
	},

	'login',
	'/user/login?username=owen&password=123',
	{
		before: 'register',
		after: 'kill',

		verify(result) {
			return result.data === true;
		}
	},

	'logout',
	'/user/logout?username=owen',
	{
		before: [
			'register',
			'login',
		],

		resultUrl: 'get',

		verify(result) {
			return result.data.isOnline === 0;
		}
	},

	'kill',
	'/user/kill',
	{
		params: {
			username: 'owen',
		},

		verify(result) {
			return result.data === 1;
		}
	},
];

module.exports = me;
