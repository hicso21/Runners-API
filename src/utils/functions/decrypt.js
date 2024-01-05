import crypto from 'crypto';

export default function decrypt(cipherText, key, iv) {
	const algorithm = 'aes-256-ctr';
	let decipher = crypto.createDecipheriv(
		algorithm,
		Buffer.from(key, 'hex'),
		Buffer.from(iv, 'hex')
	);
	let textoDescifrado = decipher.update(cipherText, 'hex', 'utf8');
	textoDescifrado += decipher.final('utf8');
	return textoDescifrado;
}
