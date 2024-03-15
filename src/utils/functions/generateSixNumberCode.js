export default function generateCode() {
	let code = '';
	for (let i = 0; i < 6; i++) {
		const randomDigit = Math.floor(Math.random() * 10);
		code += randomDigit.toString();
	}

	return code;
}
