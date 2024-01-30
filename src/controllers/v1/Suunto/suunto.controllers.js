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
					res.send(response);
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
					res.send(response);
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
					res.send(response);
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
}

export default SuuntoController;
