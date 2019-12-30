
// Test
// http://127.0.0.1:3001/about

// Result
//		{
// 			"success": true,
// 			"data": {
//				"version": "1.0.0"
// 			}
// 		}

const fn = async () => {
	return {version: '1.0.0'};
};

module.exports = fn;
