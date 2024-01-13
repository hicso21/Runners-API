import LogsServices from '../../../services/v1/Logs/logs.services.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';
import StravaServices from '../../../services/v1/Strava/strava.services.js';

class StravaController {
	static async authorize(req, res) {
		try {
			const id = req.params?.db_id;
			const uri = await StravaServices.authorize(id);
			res.send(uri);
		} catch (error) {
			console.log(error);
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async manageUserCode(req, res) {
		try {
			const user_id = req.params?.db_id;
			const { code } = req.query;
			const token = await StravaServices.token(code);
			const token_type = token.token_type;
			const access_token = token.access_token;
			const refresh_token = token.refresh_token;
			const brand_id = token.athlete.id;
			const response = await RunnersServices.update(user_id, {
				token_type,
				refresh_token,
				access_token,
				brand_id,
			});
			if (response.error)
				res.send(
					'<h2>Ocurrió un error en la autorización, intenta nuevamente.</h2>'
				);
			else res.send('<h2>Vuelve a la app</h2>');
		} catch (error) {
			await LogsServices.create(
				'manageUserCode error strava',
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
			const auth_header = req.bearer_token;
			const user_id = req.params?.id;
			const user = await StravaServices.getUserById(auth_header, user_id);
			res.send(user);
		} catch (error) {
			await LogsServices.create(
				'getCompleteUser error strava',
				JSON.stringify(error),
				error
			);
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getData(req, res) {
		try {
			const auth_header = req.bearer_token;
			const user = await StravaServices.getUserData(auth_header);
			res.send(user);
		} catch (error) {
			await LogsServices.create(
				'getData error strava',
				JSON.stringify(error),
				error
			);
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getZones(req, res) {
		try {
			const auth_header = req.bearer_token;
			const user = await StravaServices.getUserZones(auth_header);
			res.send(user);
		} catch (error) {
			await LogsServices.create(
				'getZones error strava',
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
		try {
			const auth_header = req.bearer_token;
			const user_id = req.params?.id;
			const user = await StravaServices.getUserStats(
				auth_header,
				user_id
			);
			res.send(user);
		} catch (error) {
			await LogsServices.create(
				'getStats error strava',
				JSON.stringify(error),
				error
			);
			console.log(error);
			res.send({
				error: true,
				data: error,
			});
		}
	}

	static async getActivities(req, res) {
		try {
			const auth_header = req.bearer_token;
			const page_number = req.params?.page;
			const user = await StravaServices.getUserActivities(
				auth_header,
				page_number
			);
			res.send(user);
		} catch (error) {
			await LogsServices.create(
				'getActivities error strava',
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

export default StravaController;
