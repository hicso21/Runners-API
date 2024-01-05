import crypto from 'crypto';

export default function encrypt(texto) {
	const algorithm = 'aes-256-ctr';
	const key = crypto.randomBytes(32);
	const iv = crypto.randomBytes(16);


	let cipher = crypto.createCipheriv(algorithm, key, iv);
	let cipherText = cipher.update(texto, 'utf8', 'hex');
	cipherText += cipher.final('hex');

	return {
		iv: iv.toString('hex'),
		key: key.toString('hex'),
		cipherText: cipherText,
	};
}
