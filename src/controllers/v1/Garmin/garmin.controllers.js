import GarminService from '../../../services/v1/Garmin/garmin.services.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';
import fetchGarmin from '../../../utils/fetches/fetchGarminAPI.js';
import config from '../../../config/garminData.js';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import Oauth from 'oauth';
import { environment } from '../../../utils/constants/mainUrl.js';
import querystring from 'querystring';
import axios from 'axios';

function generateAuthorizationHeader(
	httpMethod,
	url,
	consumerKey,
	consumerSecret,
	oauth_token,
	tokenSecret,
	oauthNonce
) {
	const oauthSignatureMethod = 'HMAC-SHA1';
	const oauthVersion = '1.0';
	const oauthTimestamp = Math.floor(Date.now() / 1000).toString();

	const baseString = generateBaseString(
		httpMethod,
		url,
		consumerKey,
		oauth_token,
		oauthSignatureMethod,
		oauthTimestamp,
		oauthNonce
	);
	const signature = generateSignature(
		httpMethod,
		url,
		baseString,
		consumerSecret,
		tokenSecret
	);

	const oauthParams = {
		oauth_consumer_key: config.client_id,
		oauth_token,
		oauth_signature_method: oauthSignatureMethod,
		oauth_timestamp: oauthTimestamp,
		oauth_nonce: oauthNonce,
		oauth_version: oauthVersion,
		oauth_signature: signature,
	};

	const headerParams = Object.keys(oauthParams)
		.sort()
		.map((key) => `${key}="${encodeURIComponent(oauthParams[key])}"`)
		.join(', ');

	return `OAuth ${headerParams}`;
}

function generateBaseString(
	httpMethod,
	url,
	consumerKey,
	token,
	oauthSignatureMethod,
	oauthTimestamp,
	oauthNonce
) {
	const encodedUrl = encodeURIComponent(url);
	const encodedParams = encodeURIComponent(
		`oauth_consumer_key=${consumerKey}&oauth_nonce=${oauthNonce}&oauth_signature_method=${oauthSignatureMethod}&oauth_timestamp=${oauthTimestamp}&oauth_token=${token}&oauth_version=1.0`
	);
	return `${httpMethod}&${encodedUrl}&${encodedParams}`;
}

function generateSignature(
	method,
	url,
	parameters,
	consumerSecret,
	tokenSecret
) {
	const baseString =
		method.toUpperCase() +
		'&' +
		encodeURIComponent(url) +
		'&' +
		encodeURIComponent(parameters);

	const signingKey =
		encodeURIComponent(consumerSecret) +
		'&' +
		encodeURIComponent(tokenSecret);

	const signature = crypto
		.createHmac('sha1', signingKey)
		.update(baseString)
		.digest('base64');

	return signature;
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
					headers: authHeader,
				}
			);
			const tokens = data.split('&');
			const request_token = tokens[0].split('=')[1];
			const request_token_secret = tokens[1].split('=')[1];
			const url = environment(req.href);
			const oauth_callback = `${url}/api/v1/garmin/exchange_token?personal_data=${
				db_id + '||' + request_token_secret
			}&token_secret=${request_token_secret}`;
			const redirect_url = `https://connect.garmin.com/oauthConfirm?oauth_token=${request_token}&oauth_callback=${oauth_callback}`;
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
			const { personal_data, oauth_token, oauth_verifier } = req.query;
			const nonce = personal_data.split('||')[0];
			const token_secret = personal_data.split('||')[1];
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

			console.log(oauth);

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
						console.log('OAuth access token:', accessToken);
						console.log(
							'OAuth access token secret:',
							accessTokenSecret
						);
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

						const Oauth = OAuth({
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

						const requestData = {
							url: `${config.base_url}/oauth-service/oauth/access_token`,
							method: 'POST',
							data: { oauth_token: accessToken },
						};
						const authHeader = Oauth.toHeader(
							Oauth.authorize(requestData)
						);
						await axios
							.get(
								'https://apis.garmin.com/wellness-api/rest/user/id',
								{
									headers: authHeader,
								}
							)
							.then((response) => {
								console.log('ID de usuario:', response.data);
							})
							.catch((error) => {
								console.error(
									'Error al obtener el ID de usuario:',
									error
								);
							});
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
		const { db_id } = req.params;
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
