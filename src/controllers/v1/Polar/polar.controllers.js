import axios from 'axios';
import config from '../../../config/polarData.json' assert { type: 'json' };
import PolarService from '../../../services/v1/Polar/polar.services.js';
import mainUrl from '../../../utils/constants/mainUrl.js';
import Runners from '../../../db/models/Runners.js';
import Logs from '../../../db/models/Logs.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';
import LogsServices from '../../../services/v1/Logs/logs.services.js';

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
		const encodedCredentials = btoa(
			`${config.client_id}:${config.client_secret}`
		);
		const headers = new Headers();
		headers.append('Authorization', `Basic ${encodedCredentials}`);
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		headers.append('Accept', 'application/json;charset=UTF-8');
		const config = {
			headers: headers,
		};
		try {
			const { data } = await axios.post(
				'https://polarremote.com/v2/oauth2/token',
				body,
				config
			);
			if (data?.access_token != undefined) {
				RunnersServices.update(state, {
					access_token: data.access_token,
					token_type: data.token_type,
					brand_id: data.x_user_id,
				});
				return res.send('<h2>Vuelve a la app</h2>');
			} else {
				const log = LogsServices.create(
					'token error polar',
					JSON.stringify(data),
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
			
		} catch (error) {
			return {
				error: true,
				data: error,
			};
		}
	}
}

export default PolarController;
