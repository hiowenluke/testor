
const me = [

	// Step 2
	'/user/list',
	{
		// Step 1
		before: [
			'./scripts/doSomething?username=owen',
			'./scripts/user/register?username=owen&password=123',
			'./scripts/user/login?username=owen',
		],

		// Step 3
		after: [
			'./scripts/user/kill?username=owen',
		],

		// Step 4: use the result returned from step 2
		verify(result) {
			const rst = result.data.find(item => item.username === 'owen');
			return !!rst;
		}
	},

	// Step 2
	'/user/logout?username=owen',
	{
		// Step 1
		before: [
			'./scripts/user/register?username=owen&password=123',
			'./scripts/user/login?username=owen',
		],

		// Step 3: use this url to get the result
		resultUrl: './scripts/user/get?username=owen',

		// Step 4
		after: [
			'./scripts/user/kill?username=owen',
		],

		// Step 5: use the result returned from step 3 instead of step 2
		verify(result) {
			return result.data.isOnline === 0;
		}
	},
];

module.exports = me;
