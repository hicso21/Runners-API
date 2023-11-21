import axios from 'axios';
import fetchPolar from '../../../utils/fetches/fetchPolarAPI.js';

class PolarServices {
	static async token(body, config) {
		try {
			const { data } = await axios.post(
				'https://polarremote.com/v2/oauth2/token',
				body,
				config
			);
			return data;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getUser(userId) {
		try {
			const { data } = await fetchPolar.get(`/v3/users/${userId}`);
			return data;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async pullNotifications() {
		try {
			const { data } = await fetchPolar.get('/v3/notifications');
			return data;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}
}

export default PolarServices;
