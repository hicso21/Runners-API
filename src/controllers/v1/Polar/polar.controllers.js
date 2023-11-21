import config from '../../../config/polarData.json' assert { type: 'json' };
import LogsServices from '../../../services/v1/Logs/logs.services.js';
import PolarServices from '../../../services/v1/Polar/polar.services.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';
import mainUrl from '../../../utils/constants/mainUrl.js';

class PolarController {
	static async authUser(req, res) {
		try {
			const user_id = req.params.user_id;
			const redirect_uri = `${mainUrl}/api/v1/polar/exchange_token`;
			const uri =
				`${config.oauth_endpoint}/oauth2/authorization?` +
				`response_type=code&` +
				`client_id=${config.client_id}&` +
				`redirect_uri=${redirect_uri}&` +
				`state=${user_id}`;
			res.redirect(uri);
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getExchangeToken(req, res) {
		const { code, state } = req.params;
		const redirect_uri = `${mainUrl}/api/v1/polar/exchange_token`;
		const body = {
			grant_type: 'authorization_code',
			code,
			redirect_uri,
		};
		const headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		const config = {
			headers,
		};
		try {
			const response = await PolarServices.token(body, config);
			if (response?.access_token != undefined) {
				RunnersServices.update(state, {
					access_token: response.access_token,
					token_type: response.token_type,
					brand_id: response.x_user_id,
				});
				return res.send('<h2>Vuelve a la app</h2>');
			} else {
				const log = LogsServices.create(
					'token error polar',
					JSON.stringify(response),
					new Date().toLocaleString()
				);
				await log.save();
				return res.send(
					'<h2>Ocurrió un error. Intenta nuevamente</h2>'
				);
			}
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getRunnerData(req, res) {
		try {
			const { user_id } = req.params;
			const response = await PolarServices.getUser(user_id);
			return res.send(response);
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}

	static async getDailyActivity(req, res) {
		const { user_id } = req.params;
		const { 'available-user-data': data } =
			await PolarServices.pullNotifications();
		const haveUserDailyActivity = data?.filter(
			(item) => item['user-id'] == user_id
		);
		if (haveUserDailyActivity.length > 0) {
		}
	}
}

export default PolarController;
