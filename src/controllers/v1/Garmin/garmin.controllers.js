import GarminService from '../../../services/v1/Garmin/garmin.services.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';
import fetchGarmin from '../../../utils/fetches/fetchGarminAPI.js';
import config from '../../../config/garminData.js';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import mainUrl from '../../../utils/constants/mainUrl.js';

class GarminController {
	static async auth(req, res) {
		try {
			const { db_id } = req.params;
			const oauth = OAuth({
				consumer: {
					key: config.client_id,
					secret: config.client_secret,
				},
				signature_method: 'HMAC-SHA1',
				hash_function: (base_string, key) => {
					return crypto
						.createHmac('sha1', key)
						.update(base_string)
						.digest('base64');
				},
			});
			const requestTokenUrl = `${config.base_url}/oauth-service/oauth/request_token`;
			const requestData = {
				url: requestTokenUrl,
				method: 'POST',
			};
			const authHeader = oauth.toHeader(oauth.authorize(requestData));
			const { data } = await fetchGarmin.post(
				'/oauth-service/oauth/request_token',
				null,
				{
					headers: {
						Authorization: authHeader['Authorization'],
					},
				}
			);
			const tokens = data.split('&');
			const request_token = tokens[0].split('=')[1];
			const request_token_secret = tokens[1].split('=')[1];
			const oauth_callback = `${mainUrl}/api/v1/garmin/exchange_token?db_id=${db_id}`;
			const url = `https://connect.garmin.com/oauthConfirm?oauth_token=${request_token}&oauth_callback=${oauth_callback}`;
			res.redirect(url);
			// res.send({ error: false, data });
		} catch (error) {
			res.status(500).send({
				error: true,
				msg: 'An error has ocurred',
				data: error,
			});
		}
	}

	static async exchange(req, res) {
		try {
			const { db_id, oauth_token, oauth_verifier } = req.query;
			const oauth = OAuth({
				consumer: {
					key: config.client_id,
					secret: config.client_secret,
				},
				signature_method: 'HMAC-SHA1',
				hash_function(base_string, key) {
					return crypto
						.createHmac('sha1', key)
						.update(base_string)
						.digest('base64');
				},
			});
			const requestData = {
				url: 'https://connectapi.garmin.com/oauth-service/oauth/access_token',
				method: 'POST',
				data: {
					oauth_verifier,
					oauth_consumer_key: config.client_id,
					oauth_token,
					oauth_signature_method: 'HMAC-SHA1',
					oauth_nonce: db_id,
					oauth_timestamp: new Date.now(),
					oauth_version: 1.0
				},
			};

			const authorizationHeader = oauth.toHeader(
				oauth.authorize(requestData)
			);
			const { data } = await fetchGarmin.post(
				'/oauth-service/oauth/access_token',
				null,
				{
					headers: authorizationHeader,
				}
			);
			res.send(data);
		} catch (error) {
			res.status(500).send({
				error: true,
				msg: 'An error has ocurred',
				data: error,
			});
		}
	}

	static async getUser(req, res) {
		try {
		} catch (error) {
			res.status(500).send({
				error: true,
				msg: 'An error has ocurred',
				data: error,
			});
		}
	}
}

export default GarminController;
