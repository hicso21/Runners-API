import CorosServices from '../../../services/v1/Coros/coros.services.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';

class CorosController {
	static async authorize(req, res) {
		try {
			const id = req.params.db_id;
			const uri = await CorosServices.oauth(id);
			res.redirect(uri);
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async manageUserCode(req, res) {
		try {
			const { code, state } = req.query;
			const response = await CorosServices.accessToken(code);
			const { access_token, refresh_token, openId, expires_in } =
				response;
			const runnerUpdated = await RunnersServices.update(user_id, {
				refresh_token,
				access_token,
				brand_id: openId,
			});
			if (!runnerUpdated.error) {
				res.send(response);
			}
		} catch (error) {
			return {
				error: true,
				data: error,
			};
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
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getDataByDate(req, res) {
		try {
			const { start_date, end_date } = req.body;
			const { brand_id, access_token } = req.user;
			const workout = await CorosServices.workoutByDate(
				access_token,
				brand_id,
				start_date,
				end_date
			);
			res.send(workout);
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getDailyData(req, res) {
		// max range 30 days
		try {
			
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getStats(req, res) {
		try {
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getActivities(req, res) {
		try {
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}
}

export default CorosController;

//
