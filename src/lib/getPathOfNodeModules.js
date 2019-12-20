
const fs = require('fs');
const path = require('path');

const fn = (destFolder) => {
	let p = destFolder;

	while (p !== '/') {
		const dest = p + '/node_modules';
		if (fs.existsSync(dest)) {
			return dest;
		}
		p = path.resolve(p, '..');
	}
};

module.exports = fn;
