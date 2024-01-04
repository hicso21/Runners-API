import crypto from 'crypto';

export default function decrypt(cipherText, key, iv) {
	const algoritmo = 'aes-256-ctr';
	let decipher = crypto.createDecipheriv(
		algoritmo,
		Buffer.from(key, 'hex'),
		Buffer.from(iv, 'hex')
	);
	let textoDescifrado = decipher.update(cipherText, 'hex', 'utf8');
	textoDescifrado += decipher.final('utf8');
	return textoDescifrado;
}
