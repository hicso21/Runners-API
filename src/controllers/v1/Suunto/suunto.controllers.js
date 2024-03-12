import ActivitiesServices from '../../../services/v1/Activities/activities.services.js';
import LogsServices from '../../../services/v1/Logs/logs.services.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';
import SuuntoServices from '../../../services/v1/Suunto/suunto.services.js';

class SuuntoController {
	static async getUser(req, res) {
		try {
		} catch (error) {
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async auth(req, res) {
		try {
			const id = req.params?.db_id;
			const uri = SuuntoServices.getAuthorizeUrl(id);
			res.redirect(uri);
		} catch (error) {
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getToken(req, res) {
		const id = req.params.db_id;
		const redirect_uri = req.href.split('?')[0];
		const { code } = req.query;
		try {
			const tokens = await SuuntoServices.token(redirect_uri, code);
			const { access_token, token_type, refresh_token } = tokens;
			const response = await RunnersServices.update(id, {
				access_token,
				token_type,
				refresh_token,
			});
			if (response.error)
				res.send(
					'<h2>Ocurrió un error en la autorización, intenta nuevamente.</h2>'
				);
			else {
				await LogsServices.create(
					`auth suunto`,
					`authorization completed by the id user: ${id}`
				);
				res.send('<h2>Vuelve a la app</h2>');
			}
		} catch (error) {
			await LogsServices.create(
				'getToken suunto',
				JSON.stringify(error),
				error
			);
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getActivitySamples(req, res) {
		try {
			const { from, to } = req.query;
			const { db_id } = req.params;
			if (!from || !to || !db_id) {
				res.send({
					error: true,
					data: 'Queries and parameter are required',
				});
			} else {
				const userData = await RunnersServices.getById(db_id);
				if (userData.error)
					res.send({
						error: true,
						data: 'An error occurred while trying to obtain user data.',
					});
				else {
					const response = await SuuntoServices.dailyActivity(
						from,
						to,
						userData.access_token
					);
					res.send({ error: false, data: response });
				}
			}
		} catch (error) {
			await LogsServices.create(
				'getActivitySamples suunto error',
				JSON.stringify(error),
				error
			);
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getActivityStatistics(req, res) {
		try {
			const { startdate, enddate } = req.query;
			const { db_id } = req.params;
			if (!from || !to || !db_id) {
				res.send({
					error: true,
					data: 'Queries and parameter are required',
				});
			} else {
				const userData = await RunnersServices.getById(db_id);
				if (userData.error)
					res.send({
						error: true,
						data: 'An error occurred while trying to obtain user data.',
					});
				else {
					const response = await SuuntoServices.activityStatistics(
						startdate,
						enddate,
						userData.access_token
					);
					res.send({ error: false, data: response });
				}
			}
		} catch (error) {
			await LogsServices.create(
				'getActivityStatistics suunto error',
				JSON.stringify(error),
				error
			);
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getSleepData(req, res) {
		try {
			const { from, to } = req.query;
			const { db_id } = req.params;
			if (!from || !to || !db_id) {
				res.send({
					error: true,
					data: 'Queries and parameter are required',
				});
			} else {
				const userData = await RunnersServices.getById(db_id);
				if (userData.error)
					res.send({
						error: true,
						data: 'An error occurred while trying to obtain user data.',
					});
				else {
					const response = await SuuntoServices.sleepData(
						from,
						to,
						userData.access_token
					);
					res.send({ error: false, data: response });
				}
			}
		} catch (error) {
			await LogsServices.create(
				'getSleepData suunto error',
				JSON.stringify(error),
				error
			);
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async setStats(req, res) {
		const { id, start_time, end_time } = req.body;
		try {
			if (!start_time || !end_time || !id)
				return res.send({
					error: true,
					data: 'Queries and parameter are required',
				});
			const userData = await RunnersServices.getById(db_id);
			if (userData.error)
				return res.send({
					error: true,
					data: 'An error occurred while trying to obtain user data.',
				});
			const response = await SuuntoServices.getWorkoutsList(
				start_time,
				end_time,
				userData.access_token
			);
			if (response.error) throw new Error('Error on requesting data');
			const timestampOnSeconds = response?.payload[0]?.startTime;
			const dataToSend = {
				user_id: id,
				title: '',
				date: new Date(timestampOnSeconds).toLocaleString(),
				timestamp: timestampOnSeconds,
				distance: response?.payload[0]?.totalDistance,
				total_time: response?.payload[0]?.totalTime,
				average_heart_rate: response?.payload[0]?.hrdata?.workoutAvgHR,
				max_heart_rate: response?.payload[0]?.hrdata?.workoutMaxHR,
				resting_heart_rate: '',
				average_pace: response?.payload[0]?.avgPace,
				calories: response?.payload[0]?.energyConsumption,
				positive_slope: '',
				negative_slope: '',
				average_speed: response?.payload[0]?.avgSpeed,
				average_cadence: response?.payload[0]?.extensions?.avgCadence,
				training_load: '',
				max_cadence: response?.payload[0]?.cadence?.max,
				min_height: response?.payload[0]?.minAltitude,
				max_height: response?.payload[0]?.maxAltitude,
				estimated_liquid_loss: '',
				average_temperature:
					response?.payload[0]?.extensions?.avgTemperature,
				paces: '',
				triathlonData: [],
				description: '',
			};
			const activity = await ActivitiesServices.createActivity(
				dataToSend
			);
			res.send({
				data: activity,
				error: false,
			});
		} catch (error) {
			await LogsServices.create(
				'setStats suunto error',
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

export default SuuntoController;
