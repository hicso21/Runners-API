const mainUrl = 'https://delaf.click';

export function environment(href) {
	console.log(href && href.includes('localhost'));
	if (href && href.includes('localhost')) return href;
	else return mainUrl;
}

export default mainUrl;
