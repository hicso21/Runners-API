const mainUrl = 'https://runners-api.onrender.com';

export function environment(href) {
	console.log(href && href.includes('localhost'));
	if (href && href.includes('localhost')) return href;
	else return mainUrl;
}

export default mainUrl;
