import axios from 'axios';
import crypto from 'crypto';
import Oauth from 'oauth';
import OAuth from 'oauth-1.0a';
import config from '../../../config/garminData.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';
import { environment } from '../../../utils/constants/mainUrl.js';
import fetchGarmin from '../../../utils/fetches/fetchGarminAPI.js';

function generateRandomNonce() {
	const randomBytes = crypto.randomBytes(16);
	return randomBytes.toString('base64').replace(/=/g, '').slice(0, 32);
}

class GarminController {
	static async auth(req, res) {
		try {
			const db_id = req.params?.db_id;
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
				data: { oauth_nonce: db_id },
			};
			const authHeader = oauth.toHeader(oauth.authorize(requestData));
			const { data } = await fetchGarmin.post(
				'/oauth-service/oauth/request_token',
				null,
				{
					headers: authHeader,
				}
			);
			const tokens = data.split('&');
			const request_token = tokens[0].split('=')[1];
			const request_token_secret = tokens[1].split('=')[1];
			const url = environment(req.href);
			const oauth_callback = `${url}/api/v1/garmin/exchange_token?request_token_secret=${request_token_secret}`;
			const redirect_url = `https://connect.garmin.com/oauthConfirm?userData=${
				request_token + '||' + db_id
			}&oauth_callback=${oauth_callback}`;
			res.redirect(redirect_url);
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
			const { request_token_secret, userData, oauth_verifier } =
				req.query;

			const request_token = userData.split('||')[0];
			const db_id = userData.split('||')[1];

			const oauth = new Oauth.OAuth(
				'https://connectapi.garmin.com/oauth-service/oauth/request_token',
				'https://connectapi.garmin.com/oauth-service/oauth/access_token',
				config.client_id,
				config.client_secret,
				'1.0',
				null,
				'HMAC-SHA1'
			);

			oauth.getOAuthAccessToken(
				request_token,
				request_token_secret,
				oauth_verifier,
				async function (error, accessToken, tokenSecret) {
					if (error) {
						console.error(
							'Error getting OAuth access token:',
							error
						);
					} else {
						const oauth_nonce = generateRandomNonce();
						const oauth_timestamp = Math.floor(Date.now() / 1000);

						const requestBaseUrl =
							'https://apis.garmin.com/wellness-api/rest/user/id';

						const baseSignature = (
							'GET&' +
							encodeURIComponent(requestBaseUrl) +
							'&' +
							encodeURIComponent(
								`oauth_consumer_key=${config.client_id}&oauth_nonce=${oauth_nonce}&oauth_signature_method=HMAC-SHA1&oauth_timestamp=${oauth_timestamp}&oauth_token=${accessToken}&oauth_version=1.0`
							)
						).replace('%22', '');

						const signingKey =
							encodeURIComponent(config.client_secret) +
							'&' +
							encodeURIComponent(tokenSecret);
						const oauth_signature = crypto
							.createHmac('sha1', signingKey)
							.update(baseSignature)
							.digest('base64');

						const auth = `OAuth oauth_consumer_key="${encodeURIComponent(
							config.client_id
						)}", oauth_nonce="${encodeURIComponent(
							oauth_nonce
						)}", oauth_signature="${encodeURIComponent(
							oauth_signature
						)}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${oauth_timestamp}", oauth_token="${encodeURIComponent(
							accessToken
						)}", oauth_version="1.0"`;

						const { data, error } = await axios({
							url: requestBaseUrl,
							method: 'GET',
							headers: {
								Authorization: auth,
							},
						})
							.then((res) => {
								return { error: false, data: res.data };
							})
							.catch((error) => {
								return { error: true, data: error };
							});

						if (error) res.send(error);
						else {
							const runner = await RunnersServices.getById(db_id);
							const updatedRunner = {
								...runner,
								access_token: accessToken,
								refresh_token: tokenSecret,
								brand_id: data.userId,
							};
							const response = await RunnersServices.update(
								db_id,
								updatedRunner
							);

							res.send(
								'Conexión exitosa! Puedes volver a la app.'
							);
						}
					}
				}
			);
		} catch (error) {
			res.status(500).send({
				error: true,
				msg: 'An error has ocurred',
				data: error,
			});
		}
	}

	static async getActivities(req, res) {
		const db_id = req.params?.db_id;
		try {
			const response = await axios.get(
				`https://delaf.click/activities?userId=${db_id}`
			);
			res.send(response);
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
