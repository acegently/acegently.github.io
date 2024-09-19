// Common functions - cdh - 20240919

function Round(xVal, xDecimals) {
	let x10 = Math.pow(10, xDecimals);
	return Math.floor(xVal * x10) / x10;
}