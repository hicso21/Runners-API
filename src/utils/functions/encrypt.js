import crypto from 'crypto';

export default function encrypt(texto) {
	const algoritmo = 'aes-256-ctr';
	const key = crypto.randomBytes(32);
	const iv = crypto.randomBytes(16);

	console.log({ algoritmo, key, iv });

	let cipher = crypto.createCipheriv(algoritmo, key, iv);
	let cipherText = cipher.update(texto, 'utf8', 'hex');
	cipherText += cipher.final('hex');

	return {
		iv: iv.toString('hex'),
		key: key.toString('hex'),
		cipherText: cipherText,
	};
}
