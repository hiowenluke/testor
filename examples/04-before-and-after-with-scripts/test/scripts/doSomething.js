
const wait = (ms = 1000) => {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	})
};

const fn = async () => {
	const queryJson = process.argv[2];
	const query = JSON.parse(queryJson);
	console.log(query);

	await wait();
};

fn();
