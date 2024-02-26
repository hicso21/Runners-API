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

	/* Daily Activity (getStats) */

	static async postActivityTransactions(db_id, headers) {
		try {
			const { data } = await fetchPolar({
				url: `/v3/users/${db_id}/activity-transactions`,
				method: 'POST',
				headers,
			});
			return data;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async putActivityTransactions(db_id, transaction, headers) {
		try {
			await fetchPolar({
				url: `/v3/users/${db_id}/activity-transactions/${transaction['transaction-id']}`,
				method: 'PUT',
				headers,
			});
		} catch (error) {
			return {
				error: true,
				data: false,
			};
		}
	}

	static async listActivities(db_id, transaction, headers) {
		try {
			const { data } = await fetchPolar({
				url: `/v3/users/${db_id}/activity-transactions/${transaction['transaction-id']}`,
				method: 'GET',
				headers,
			});
			return data;
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async listOfActivities(activityUrl) {
		try {
			const { data: activitySummary } = await fetchPolar.get(activityUrl);
			const { data: stepSamples } = await fetchPolar.get(
				`${activityUrl}/step-samples`
			);
			return { ...activitySummary, ...stepSamples };
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}
}

export default PolarServices;
