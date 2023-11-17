import mainUrl from '../../../utils/constants/mainUrl.js';
import fetchSuunto from '../../../utils/fetches/fetchSuuntoAPI.js';
import config from '../../../config/suuntoData.json' assert { type: 'json' };

class SuuntoServices {
	static async authorize(id) {
		try {
			const redirect_uri = `${mainUrl}/api/v1/suunto/exchange_token/${id}`;
			const uri =
				'https://cloudapi-oauth.suunto.com/oauth/authorize?' +
				`response_type=${config.response_type}` +
				'&' +
				`client_id=${config.client_id}` +
				'&' +
				`redirect_uri=${redirect_uri}`;
			return uri;
		} catch (error) {
			console.log(error.message);
			return { error: true, data: error };
		}
	}

	static async token(redirect_uri, code) {
		try {
			const authHeader = btoa(
				`${config.client_id}:${config.client_secret}`
			);
			const res = await fetchSuunto.post(
				'/oauth/token',
				{
					grant_type: 'authorization_code',
					redirect_uri,
					code,
				},
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: `Basic ${authHeader}`,
					},
				}
			);
			return res.data;
		} catch (error) {
			console.log(error.message);
			return { error: true, data: error };
		}
	}
}

export default SuuntoServices;
