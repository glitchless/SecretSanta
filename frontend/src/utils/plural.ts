export const plural = (number: any, variants: any) => {
	// variants = ['листов', 'лист', 'листа']
	const one = variants[1];
	const two = variants[2];
	const five = variants[0];

	let n = Math.abs(number);

	n %= 100;
	if (n >= 5 && n <= 20) {
		return five;
	}
	n %= 10;
	if (n === 1) {
		return one;
	}
	if (n >= 2 && n <= 4) {
		return two;
	}

	return five;
};
