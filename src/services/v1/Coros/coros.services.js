import fetchCoros from '../../../utils/fetches/fetchCorosAPI.js';
import config from '../../../config/corosData.js';

class CorosServices {
	static async oauth(id) {
		try {
			const redirectUri = `${config.redirect_uri}/api/v1/coros/exchange_token`;
			const uri =
				`${config.base_url}/oauth2/authorize?` +
				`client_id=${config.client_id}` +
				`&redirect_uri=${redirectUri}` +
				`&state=${id}` +
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
			const data = {
				client_id: config.client_id,
				redirect_uri: redirectUri,
				code,
				client_secret: config.client_secret,
				grant_type: config.grant_type,
			};
			const encodedData = Object.keys(data)
				.map((key) => {
					return `${encodeURIComponent(key)}=${encodeURIComponent(
						data[key]
					)}`;
				})
				.join('&');
			const { data: response } = await fetchCoros.post(uri, encodedData);
			return response;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getRunnerData(access_token, brand_id) {
		try {
			const { data } = await fetchCoros.get(
				`/userinfosim?token=${access_token}&openId=${brand_id}`
			);
			return data;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async workoutByDate(access_token, brand_id, start_date, end_date) {
		try {
			// modes: 8(run), 9(bike), 15(trailrun), 31(walk) 18(cardio)
			const { data } = await fetchCoros.get(
				'/v2/coros/sport/list?' +
					`token=${access_token}` +
					'&' +
					`openId=${brand_id}` +
					'&' +
					`startDate=${start_date}` +
					'&' +
					`endDate=${end_date}`
			);
			return data;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async restDailyData(access_token, brand_id, start_date, end_date) {
		try {
			const { data } = await fetchCoros.get(
				'/coros/daily/query?' +
					`token=${access_token}` +
					'&' +
					`openId=${brand_id}` +
					'&' +
					`startDate=${start_date}` +
					'&' +
					`endDate=${end_date}`
			);
			return data.data;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}
}

export default CorosServices;
