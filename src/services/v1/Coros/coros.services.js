import fetchCoros from '../../../utils/fetches/fetchCorosAPI.js';
import config from '../../../config/corosData.json' assert { type: 'json' };

class CorosServices {
	static async oauth(id) {
		try {
			const redirectUri = `${config.redirect_uri}/api/v1/coros/exchange_token`;
			const uri =
				`${config.base_url}/oauth2/authorize?` +
				`client_id=${config.client_id}` +
				`&redirect_uri=${redirectUri}` +
				`&state=${id ? id : '2110'}` +
				`&response_type=code`;
			return uri;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async accessToken(code) {
		try {
			const uri = `${config.base_url}/oauth2/accesstoken`;
			const redirectUri = `${config.redirect_uri}/api/v1/coros/exchange_token`;
			const body = {
				client_id: config.client_id,
				redirect_uri: redirectUri,
				code,
				client_secret: config.client_secret,
				grant_type: config.grant_type,
			};
			return await fetchCoros.post(uri, encodeURIComponent(JSON.stringify(body)));
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}
}

export default CorosServices;
