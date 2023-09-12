import axios from 'axios';
import fetchStrava from '../../../utils/fetches/fetchStravaAPI.js';
import config from '../../../config/stravaData.json' assert { type: 'json' };
import mainUrl from '../../../utils/constants/mainUrl.js';

class StravaServices {
	static async getUserById(authHeader, user_id) {
		try {
			const { data: user } = await fetchStrava.get('/athlete', {
				headers: {
					Authorization: authHeader,
				},
				withCredentials: true,
			});
			const { data: zones } = await fetchStrava.get('/zones', {
				headers: {
					Authorization: authHeader,
				},
				withCredentials: true,
			});
			const { data: stats } = await fetchStrava.get(
				`/athlete/${user_id}/stats`,
				{
					headers: {
						Authorization: authHeader,
					},
					withCredentials: true,
				}
			);
			return {
				user_data: user,
				stats,
				zones,
			};
		} catch (error) {
			return {
				error: true,
				content: error,
			};
		}
	}

	static async getUserData(authHeader) {
		try {
			const { data } = await fetchStrava.get('/athlete', {
				headers: {
					Authorization: authHeader,
				},
				withCredentials: true,
			});
			return data;
		} catch (error) {
			return {
				error: true,
				content: error,
			};
		}
	}

	static async getUserStats(authHeader, user_id) {
		try {
			const { data } = await fetchStrava.get(
				`/athlete/${user_id}/stats`,
				{
					headers: {
						Authorization: authHeader,
					},
					withCredentials: true,
				}
			);
			return data;
		} catch (error) {
			return {
				error: true,
				content: error,
			};
		}
	}

	static async getUserZones(authHeader) {
		try {
			const { data } = await fetchStrava.get(`/athlete/zones`, {
				headers: {
					Authorization: authHeader,
				},
				withCredentials: true,
			});
			return data;
		} catch (error) {
			return {
				error: true,
				content: error,
			};
		}
	}

	static async getUserActivities(authHeader, page_number) {
		try {
			const { data } = await fetchStrava.get(
				`/athlete/activities?per_page=10${
					page_number ? `&page=${page_number}` : ''
				}`,
				{
					headers: {
						Authorization: authHeader,
					},
					withCredentials: true,
				}
			);
			return data;
		} catch (error) {
			return {
				error: true,
				content: error,
			};
		}
	}

	static async authorize(id) {
		const redirect_uri = `${mainUrl}/api/v1/strava/exchange_token/${id}`;
		const scope =
			'read_all,profile:read_all,profile:write,activity:read_all,activity:write';
		try {
			const url =
				'https://www.strava.com/oauth/mobile/authorize?' +
				`redirect_uri=${redirect_uri}` +
				'&' +
				'response_type=code' +
				'&' +
				'approval_prompt=auto' +
				'&' +
				`scope=${scope}` +
				'&' +
				`client_id=${config.client_id}`;
			return url;
		} catch (error) {
			return {
				error: true,
				content: error,
			};
		}
	}

	static async token(code) {
		try {
			const { data } = await fetchStrava.post('/oauth/token', {
				client_id: config.client_id,
				client_secret: config.client_secret,
				grant_type: config.grant_type,
				code,
			});
			return data;
		} catch (error) {
			return {
				error: true,
				content: error,
			};
		}
	}
	static async refreshAuthorization(refresh_token) {
		try {
			const { data } = await fetchStrava.post('/oauth/token', {
				client_id: config.client_id,
				client_secret: config.client_secret,
				grant_type: 'refresh_token',
				refresh_token,
			});
			return data;
		} catch (error) {
			return {
				error: true,
				content: error,
			};
		}
	}
}

export default StravaServices;
