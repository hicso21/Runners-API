import config from '../../../config/polarData.js';
import LogsServices from '../../../services/v1/Logs/logs.services.js';
import PolarServices from '../../../services/v1/Polar/polar.services.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';
import mainUrl from '../../../utils/constants/mainUrl.js';
import { Buffer } from 'buffer';
import fetchPolar from '../../../utils/fetches/fetchPolarAPI.js';

class PolarController {
	static async authUser(req, res) {
		try {
			const db_id = req.params?.db_id;
			const baseUrl = req.hostname.includes('localhost')
				? 'http://localhost:8000'
				: mainUrl;
			const redirect_uri = `${baseUrl}/api/v1/polar/exchange_token`;
			const uri =
				`${config.oauth_endpoint}/oauth2/authorization?` +
				`response_type=code&` +
				`client_id=${config.client_id}&` +
				`redirect_uri=${redirect_uri}&` +
				`state=${db_id}`;
			res.redirect(uri);
		} catch (error) {
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getExchangeToken(req, res) {
		const { code, state } = req.params;
		const body = {
			grant_type: 'authorization_code',
			code,
			redirect_uri: config.redirect_uri,
		};
		const headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		headers.append('Accept', 'application/json;charset=UTF-8');
		headers.append(
			'Authorization',
			`Basic ${Buffer.from(
				`${config.client_id}:${config.client_secret}`
			).toString('base64')}`
		);
		try {
			const response = await PolarServices.token(body, {
				headers,
			});
			if (response?.access_token != undefined) {
				RunnersServices.update(state, {
					access_token: response.access_token,
					token_type: response.token_type,
					brand_id: response.x_user_id,
				});
				res.send('<h2>Vuelve a la app</h2>');
			} else {
				await LogsServices.create(
					'token error polar',
					JSON.stringify(response)
				);
				res.send('<h2>Ocurrió un error. Intenta nuevamente</h2>');
			}
		} catch (error) {
			await LogsServices.create(
				'token error polar',
				JSON.stringify(error),
				error
			);
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getRunnerData(req, res) {
		try {
			const { db_id } = req.params;
			const response = await PolarServices.getUser(db_id);
			res.send(response);
		} catch (error) {
			await LogsServices.create(
				'getRunnerData error polar',
				JSON.stringify(error),
				error
			);
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getDailyActivity(req, res) {
		const { db_id } = req.params;
		const headers = new Headers();
		try {
			const { 'available-user-data': data } =
				await PolarServices.pullNotifications();
			const haveUserDailyActivity = data?.some(
				(item) => item['user-id'] == db_id
			);
			if (!haveUserDailyActivity) return res.send(false);
			const userData = await RunnersServices.getById(db_id);
			if (!userData?.access_token) {
				await LogsServices.create(
					'getDailyActivity error polar',
					"Data collection by the runners' service did not work as it should have"
				);
				return res.send({
					error: true,
					data: "Data collection by the runners' service did not work as it should have",
				});
			}
			headers.append('Accept', 'application/json');
			headers.append('Authorization', `Bearer ${userData?.access_token}`);
			const { data: transaction } = await fetchPolar({
				url: `/v3/users/${db_id}/activity-transactions`,
				method: 'POST',
				headers,
			}); // { transaction-id, resource-uri }
			if (transaction['transaction-id'] === undefined)
				return res.send({
					error: true,
					data: 'The transaction request could not be executed correctly',
				});
			await fetchPolar({
				url: `/v3/users/${db_id}/activity-transactions/${transaction['transaction-id']}`,
				method: 'PUT',
				headers,
			});
			const { data: summary } = await fetchPolar({
				url: `/v3/users/${db_id}/activity-transactions/${transaction['transaction-id']}`,
				method: 'GET',
				headers,
			});
			if (summary['activity-log'] === undefined)
				return res.send({
					error: true,
					data: 'The summary of the list of activities could not be obtained correctly.',
				});
			const listOfActivity = await Promise.all(
				summary['activity-log'].map(async (activityUrl) => {
					const { data } = await fetchPolar.get(activityUrl);
					return data;
				})
			);
			res.send(listOfActivity);
		} catch (error) {
			await LogsServices.create(
				'getDailyActivity error polar',
				JSON.stringify(error),
				error
			);
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getTrainingData(req, res) {
		const { db_id } = req.params;
		const headers = new Headers();
		try {
			const { 'available-user-data': data } =
				await PolarServices.pullNotifications();
			const haveUserDailyActivity = data?.some(
				(item) => item['user-id'] == db_id
			);
			if (!haveUserDailyActivity) return res.send(false);
			const userData = await RunnersServices.getById(db_id);
			if (!userData?.access_token) {
				await LogsServices.create(
					'getTrainingData error polar',
					"Data collection by the runners' service did not work as it should have"
				);
				return res.send({
					error: true,
					data: "Data collection by the runners' service did not work as it should have",
				});
			}
			headers.append('Accept', 'application/json');
			headers.append('Authorization', `Bearer ${userData?.access_token}`);
			const { data: transaction } = await fetchPolar({
				url: `/v3/users/${db_id}/exercise-transactions`,
				method: 'POST',
				headers,
			}); // { transaction-id, resource-uri }
			if (transaction['transaction-id'] === undefined)
				return res.send({
					error: true,
					data: 'The transaction request could not be executed correctly',
				});
			await fetchPolar({
				url: `/v3/users/${db_id}/exercise-transactions/${transaction['transaction-id']}`,
				method: 'PUT',
				headers,
			});
			const { data: summary } = await fetchPolar({
				url: `/v3/users/${db_id}/exercise-transactions/${transaction['transaction-id']}`,
				method: 'GET',
				headers,
			});
			if (summary['exercises'] === undefined)
				return res.send({
					error: true,
					data: 'The summary of the list of activities could not be obtained correctly.',
				});
			const listOfActivity = await Promise.all(
				summary['exercises'].map(async (activityUrl) => {
					const { data } = await fetchPolar.get(activityUrl);
					return data;
				})
			);
			res.send(listOfActivity);
		} catch (error) {
			await LogsServices.create(
				'getTrainingData error polar',
				JSON.stringify(error),
				error
			);
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getPhysicalData(req, res) {
		const { db_id } = req.params;
		const headers = new Headers();
		try {
			const { 'available-user-data': data } =
				await PolarServices.pullNotifications();
			const haveUserDailyActivity = data?.some(
				(item) => item['user-id'] == db_id
			);
			if (!haveUserDailyActivity) return res.send(false);
			const userData = await RunnersServices.getById(db_id);
			if (!userData?.access_token) {
				await LogsServices.create(
					'getPhysicalData error polar',
					"Data collection by the runners' service did not work as it should have"
				);
				return res.send({
					error: true,
					data: "Data collection by the runners' service did not work as it should have",
				});
			}
			headers.append('Accept', 'application/json');
			headers.append('Authorization', `Bearer ${userData?.access_token}`);
			const { data: transaction } = await fetchPolar({
				url: `/v3/users/${db_id}/physical-information-transactions`,
				method: 'POST',
				headers,
			}); // { transaction-id, resource-uri }
			if (transaction['transaction-id'] === undefined)
				return res.send({
					error: true,
					data: 'The transaction request could not be executed correctly',
				});
			await fetchPolar({
				url: `/v3/users/${db_id}/physical-information-transactions/${transaction['transaction-id']}`,
				method: 'PUT',
				headers,
			});
			const { data: summary } = await fetchPolar({
				url: `/v3/users/${db_id}/physical-information-transactions/${transaction['transaction-id']}`,
				method: 'GET',
				headers,
			});
			if (summary['physical-informations'] === undefined)
				return res.send({
					error: true,
					data: 'The summary of the list of activities could not be obtained correctly.',
				});
			const listOfActivity = await Promise.all(
				summary['physical-informations'].map(async (activityUrl) => {
					const { data } = await fetchPolar.get(activityUrl);
					return data;
				})
			);
			res.send(listOfActivity);
		} catch (error) {
			await LogsServices.create(
				'getPhysicalData error polar',
				JSON.stringify(error),
				error
			);
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getStats(req, res) {
		const { db_id } = req.query;
		const headers = new Headers();
		headers.append('Accept', 'application/json');
		try {
			const { 'available-user-data': data } =
				await PolarServices.pullNotifications();
			const haveUserDailyActivity = data?.some(
				(item) => item['user-id'] == db_id
			);
			if (!haveUserDailyActivity) return res.send(false);
			const userData = await RunnersServices.getById(db_id);
			if (!userData?.access_token) {
				await LogsServices.create(
					'getStats error polar',
					"Data collection by the runners' service did not work as it should have"
				);
				return res.send({
					error: true,
					data: "Data collection by the runners' service did not work as it should have",
				});
			}
			headers.append('Authorization', `Bearer ${userData?.access_token}`);
			const transaction = await PolarServices.postActivityTransactions(
				db_id,
				headers
			); // { transaction-id, resource-uri }
			if (transaction['transaction-id'] === undefined)
				return res.send({
					error: true,
					data: 'The transaction request could not be executed correctly',
				});
			await PolarServices.putActivityTransactions(
				db_id,
				transaction,
				headers
			);
			const summary = await PolarServices.listActivities(
				db_id,
				transaction,
				headers
			);
			if (!summary['activity-log'])
				return res.send({
					error: true,
					data: 'The summary of the list of activities could not be obtained correctly.',
				});
			const listOfActivity = await Promise.all(
				summary['activity-log'].map(async (activityUrl) => {
					const activity = await PolarServices.listOfActivities(
						activityUrl
					);
					return activity;
				})
			);
			res.send(listOfActivity);
		} catch (error) {
			await LogsServices.create(
				'getStats error polar',
				JSON.stringify(error),
				error
			);
			res.send({
				error: true,
				data: error,
			});
		}
	}
}

export default PolarController;
