import axios from 'axios';
import crypto from 'crypto';
import Oauth from 'oauth';
import OAuth from 'oauth-1.0a';
import config from '../../../config/garminData.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';
import { environment } from '../../../utils/constants/mainUrl.js';
import fetchGarmin from '../../../utils/fetches/fetchGarminAPI.js';
import querystring from 'querystring';

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
			const oauth_callback = `${url}/api/v1/garmin/exchange_token?personal_data=${
				db_id +
				'||' +
				request_token_secret +
				'||' +
				authHeader['Authorization']
					.split('oauth_signature="')[1]
					.split('"')[0]
			}&token_secret=${request_token_secret}`;
			const redirect_url = `https://connect.garmin.com/oauthConfirm?oauth_token=${request_token}&oauth_callback=${oauth_callback}`;
			res.send(redirect_url);
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
			const { personal_data, oauth_token, oauth_verifier } = req.query;
			const nonce = personal_data.split('||')[0];
			const token_secret = personal_data.split('||')[1];
			const oauth_signature = personal_data.split('||')[1];
			const consumerKey = config.client_id;
			const consumerSecret = config.client_secret;

			const oauth = new Oauth.OAuth(
				'https://connectapi.garmin.com/oauth-service/oauth/request_token',
				'https://connectapi.garmin.com/oauth-service/oauth/access_token',
				consumerKey,
				consumerSecret,
				'1.0',
				null,
				'HMAC-SHA1'
			);

			oauth.getOAuthAccessToken(
				oauth_token,
				token_secret,
				oauth_verifier,
				async function (error, accessToken, accessTokenSecret) {
					if (error) {
						console.error(
							'Error getting OAuth access token:',
							error
						);
					} else {
						const runner = await RunnersServices.getById(nonce);
						const updatedRunner = {
							...runner,
							access_token: accessToken,
							refresh_token: accessTokenSecret,
						};
						const response = await RunnersServices.update(
							nonce,
							updatedRunner
						);

						const requestBaseUrl =
							'https://apis.garmin.com/wellness-api/rest/user/id';

						let oauth_timestamp = Math.floor(Date.now() / 1000);
						let oauth_nonce = nonce;
						let oauth_token_secret = token_secret;
						let oauth_consumer_key = config.client_id;
						let oauth_consumer_secret = config.client_secret;
						let oauth_signatureMethod = 'HMAC-SHA1';
						let oauth_version = '1.0';

						let base_signature =
							'GET&' +
							querystring.escape(requestBaseUrl) +
							'&' +
							querystring.escape(
								'oauth_consumer_key=' +
									oauth_consumer_key +
									'&oauth_nonce=' +
									oauth_nonce +
									'&oauth_signature_method=' +
									oauth_signatureMethod +
									'&oauth_timestamp=' +
									oauth_timestamp +
									'&oauth_token=' +
									oauth_token +
									'&oauth_version=' +
									oauth_version
							);

						let hmac = crypto.createHmac(
							'sha1',
							oauth_consumer_secret + '&' + oauth_token_secret
						);
						hmac.update(base_signature);
						let oauthSig = hmac.digest('hex');

						oauthSig = querystring.escape(
							Buffer.from(oauthSig, 'hex').toString('base64')
						);

						const authorizationHeader = `OAuth oauth_consumer_key="${
							config.client_id
						}", oauth_nonce="${nonce}", oauth_signature="${oauth_signature}", oauth_signature_method="HMAC-SHA1", oauth_timestamp=${Math.floor(
							Date.now() / 1000
						)}, oauth_token="${accessToken}", oauth_version="1.0"`;

						console.log(authorizationHeader);

						axios
							.post(requestBaseUrl, null, {
								headers: { Authorization: authorizationHeader },
							})
							.then((res) => console.log(res))
							.catch((err) => console.log(err));
						res.send(response);
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
			const response = await axios.post(
				`https://delaf.click/activities?userId=${db_id}`,
				null
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
