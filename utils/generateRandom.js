const randomGenerator = (limit) => {
	let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let uniqueStr = '';

	for (let i = 0; i < limit; i++) {
		uniqueStr += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	return uniqueStr;
};

module.exports = {
	randomGenerator
}