import GarminService from '../../../services/v1/Garmin/garmin.services.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';
import fetchGarmin from '../../../utils/fetches/fetchGarminAPI.js';
import config from '../../../config/garminData.js';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import mainUrl from '../../../utils/constants/mainUrl.js';

function generateSignature(method, url, params, consumerSecret, tokenSecret) {
	const baseString =
		method.toUpperCase() +
		'&' +
		encodeURIComponent(url) +
		'&' +
		encodeURIComponent(params);
	const signingKey =
		encodeURIComponent(consumerSecret) +
		'&' +
		encodeURIComponent(tokenSecret);
	return crypto
		.createHmac('sha1', signingKey)
		.update(baseString)
		.digest('base64');
}

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
				data: { oauth_nonce: db_id },
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
			const oauth_callback = `${mainUrl}/api/v1/garmin/exchange_token?db_id=${db_id}&token_secret=${request_token_secret}`;
			const url = `https://connect.garmin.com/oauthConfirm?oauth_token=${request_token}&oauth_callback=${oauth_callback}`;
			res.redirect(url);
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
			const { db_id, oauth_token, oauth_verifier, token_secret } =
				req.query;
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
			// const requestData = {
			// 	url: 'https://connectapi.garmin.com/oauth-service/oauth/access_token',
			// 	method: 'POST',
			// 	data: { oauth_verifier, oauth_nonce: db_id, oauth_token },
			// };

			// const authorizationHeader = oauth.toHeader(
			// 	oauth.authorize(requestData)
			// );
			// console.log(authorizationHeader);
			const url =
				'https://connectapi.garmin.com/oauth-service/oauth/access_token';

			const params = `oauth_consumer_key=${
				config.client_id
			}&oauth_nonce=${db_id}&oauth_signature_method=HMAC-SHA1&oauth_timestamp=${Math.floor(
				Date.now() / 1000
			)}&oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}&oauth_version=1.0`;

			const signature = generateSignature(
				'POST',
				url,
				params,
				config.client_secret,
				token_secret
			);

			const authorizationHeader = `OAuth oauth_consumer_key="${consumerKey}", oauth_nonce="${
				params.oauth_nonce
			}", oauth_signature="${encodeURIComponent(
				signature
			)}", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${
				params.oauth_timestamp
			}", oauth_token="${requestToken}", oauth_verifier="${verifier}", oauth_version="1.0"`;

			const { data } = await fetchGarmin.post(
				'/oauth-service/oauth/access_token',
				null,
				{
					headers: {
						Authorization: authorizationHeader,
					},
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
