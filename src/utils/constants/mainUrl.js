const mainUrl = 'https://delaf.click';

export function environment(href) {
	if (href && href.includes('localhost')) return href;
	else return mainUrl;
}

export default mainUrl;
