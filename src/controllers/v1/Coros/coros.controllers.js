import CorosServices from '../../../services/v1/Coros/coros.services.js';
import LogsServices from '../../../services/v1/Logs/logs.services.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';

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
			res.send(workout);
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
}

export default CorosController;

//
