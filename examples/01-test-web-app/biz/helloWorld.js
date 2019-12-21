
// Test
// http://localhost:3000/helloWorld

// Result
// 		{
// 			"success": true,
// 			"data": {
// 				"msg": "Hello world"
// 			}
// 		}

const fn = async () => {
	return {msg: "Hello world"};
};

module.exports = fn;
