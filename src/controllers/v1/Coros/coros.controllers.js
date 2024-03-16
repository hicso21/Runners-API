import ActivitiesServices from '../../../services/v1/Activities/activities.services.js';
import CorosServices from '../../../services/v1/Coros/coros.services.js';
import LogsServices from '../../../services/v1/Logs/logs.services.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';

const outdoorRun = (workout) => workout.mode == 8 && workout.subMode == 1;
const indoorRun = (workout) => workout.mode == 8 && workout.subMode == 2;
const outdoorBike = (workout) => workout.mode == 9 && workout.subMode == 1;
const indoorBike = (workout) => workout.mode == 9 && workout.subMode == 2;
const openWater = (workout) => workout.mode == 10 && workout.subMode == 1;
const poolSwim = (workout) => workout.mode == 10 && workout.subMode == 2;
const triathlon = (workout) => workout.mode == 13 && workout.subMode == 1;
const multisport = (workout) => workout.mode == 13 && workout.subMode == 2;
const trailRun = (workout) => workout.mode == 15 && workout.subMode == 1;
const hike = (workout) => workout.mode == 16 && workout.subMode == 1;
const gpsCardio = (workout) => workout.mode == 18 && workout.subMode == 1;
const gymCardio = (workout) => workout.mode == 18 && workout.subMode == 2;
const strength = (workout) => workout.mode == 23 && workout.subMode == 2;
const walk = (workout) => workout.mode == 31 && workout.subMode == 1;

const getTitle = (workout) => {
	let title;
	const titles = [
		outdoorRun,
		indoorRun,
		outdoorBike,
		indoorBike,
		openWater,
		poolSwim,
		triathlon,
		multisport,
		trailRun,
		hike,
		gpsCardio,
		gymCardio,
		strength,
		walk,
	];
	titles.map((item) => {
		const result = item(workout);
		if (result != false) title = item.name;
	});
	return title;
};

class CorosController {
	static async authorize(req, res) {
		try {
			const id = req.params.db_id;
			const uri = await CorosServices.oauth(id);
			res.redirect(uri);
		} catch (error) {
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async manageUserCode(req, res) {
		try {
			const { code, state } = req.query;
			const response = await CorosServices.accessToken(code);
			const { access_token, refresh_token, openId } = response;
			const runnerUpdated = await RunnersServices.update(state, {
				refresh_token,
				access_token,
				brand_id: openId,
			});
			if (!runnerUpdated.error) {
				res.send(response);
			}
		} catch (error) {
			LogsServices.create(
				'manageUserCode error coros',
				JSON.stringify(error),
				error
			);
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getCompleteUser(req, res) {
		try {
			const { brand_id, access_token } = req.user;
			const runnerData = await CorosServices.getRunnerData(
				access_token,
				brand_id
			);
			res.send(runnerData);
		} catch (error) {
			LogsServices.create(
				'getCompleteUser error coros',
				JSON.stringify(error),
				error
			);
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getDataByDate(req, res) {
		const { start_date, end_date } = req.query;
		const { brand_id, access_token } = req.user;
		try {
			const workout = await CorosServices.workoutByDate(
				access_token,
				brand_id,
				start_date,
				end_date
			);
			if (workout.message == 'OK') res.send(workout.data);
		} catch (error) {
			LogsServices.create(
				'getDataByDate error coros',
				JSON.stringify(error),
				error
			);
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getRestDataByDate(req, res) {
		const { start_date, end_date } = req.query;
		const { brand_id, access_token } = req.user;
		try {
			const restData = await CorosServices.restDailyData(
				access_token,
				brand_id,
				start_date,
				end_date
			);
			res.send(restData);
		} catch (error) {
			LogsServices.create(
				'getRestDataByDate error coros',
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
		const { brand_id, access_token, _id } = req.user;
		const { start_time, end_time } = req.body;
		const modes = [8, 9, 10, 13, 15, 16, 18, 23, 31];
		try {
			const workout = await CorosServices.workoutByDate(
				access_token,
				brand_id,
				start_time,
				end_time
			);
			if (workout.message == 'OK') {
				const workoutData = workout.data.filter((item) =>
					modes.includes(item.mode)
				);
				if (!workoutData[1] || Object.keys(workoutData[1]).length == 0)
					return res.send({
						error: true,
						data: 'There was not found any data',
					});
				const timestampOnSeconds = parseInt(
					`${workoutData[1].endTime}000`
				);
				const dataToSend = {
					user_id: _id,
					title: getTitle(workoutData[1]),
					date: new Date(timestampOnSeconds).toLocaleString(),
					timestamp: timestampOnSeconds,
					distance: workoutData[1].distance,
					total_time: workoutData[1].duration,
					average_heart_rate: '',
					max_heart_rate: '',
					resting_heart_rate: '',
					average_pace: '',
					calories: workoutData[1].calorie,
					positive_slope: '',
					negative_slope: '',
					average_speed: workoutData[1].avgSpeed,
					average_cadence: '',
					training_load: '',
					max_cadence: '',
					min_height: '',
					max_height: '',
					estimated_liquid_loss: '',
					average_temperature: '',
					paces: '',
					triathlonData: workoutData[1].triathlonItemList,
					description: '',
				};
				const activity = await ActivitiesServices.createActivity(
					dataToSend
				);
				res.send({
					data: activity,
					error: false,
				});
			} else throw new Error('Error on requesting data');
		} catch (error) {
			LogsServices.create(
				'getStats error coros',
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

export default CorosController;
