import axios from 'axios';
import fetchStrava from '../../../utils/fetches/fetchStravaAPI.js';
import config from '../../../config/stravaData.js';
import mainUrl from '../../../utils/constants/mainUrl.js';

class StravaServices {
	static async authorize(id) {
		try {
			const redirect_uri = `${mainUrl}/api/v1/strava/exchange_token/${id}`;
			const scope =
				'read_all,profile:read_all,profile:write,activity:read_all,activity:write';
			const url =
				'https://www.strava.com/oauth/authorize?' +
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

	static async getUserById(authHeader, user_id) {
		try {
			const { data: user } = await fetchStrava.get('/athlete', {
				headers: {
					Authorization: authHeader,
				},
			});
			const { data: zones } = await fetchStrava.get('/zones', {
				headers: {
					Authorization: authHeader,
				},
			});
			const { data: stats } = await fetchStrava.get(
				`/athlete/${user_id}/stats`,
				{
					headers: {
						Authorization: authHeader,
					},
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

	static async listAthleteActivities(auth_header, after, before, page, per_page) {
		try {
			const { data } = await fetchStrava.get(
				`/athlete/activities?before=${before}&after=${after}${
					page ? `&page=${page}` : ''
				}${per_page ? `&per_page=${per_page}` : ''}`,
				{
					headers: {
						Authorization: auth_header,
					},
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
}

export default StravaServices;
