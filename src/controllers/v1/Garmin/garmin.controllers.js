import GarminService from '../../../services/v1/Garmin/garmin.services.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';
import fetchGarmin from '../../../utils/fetches/fetchGarminAPI.js';
import config from '../../../config/garminData.js';
import crypto from 'crypto';
import OAuth from 'oauth-1.0a';
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

			// Replace with the request token and verifier obtained from the previous step
			const requestToken = oauth_token;
			const verifier = oauth_verifier;

			// Create an OAuth instance
			const oauth = OAuth({
				consumer: {
					key: consumerKey,
					secret: consumerSecret,
				},
				signature_method: 'HMAC-SHA1',
				hash_function(base_string, key) {
					return crypto
						.createHmac('sha1', key)
						.update(base_string)
						.digest('base64');
				},
			});

			// Generate the Authorization header
			const requestData = {
				url: 'https://connectapi.garmin.com/oauth-service/oauth/access_token',
				method: 'POST',
				data: {
					oauth_token: requestToken,
					oauth_verifier: verifier,
				},
			};
			const authorizationHeader = oauth.toHeader(
				oauth.authorize(requestData)
			);

			console.log('Authorization: ', authorizationHeader);

			// Send the request to obtain the access token and secret token
			const res = await fetchGarmin
				.post('/oauth-service/oauth/access_token', null, {
					headers: authorizationHeader,
				})
				.then((response) => {
					// Access token and secret token are available in the response
					console.log('RESPONSE: ', response);
					const accessToken = response.data.oauth_token;
					const secretToken = response.data.oauth_token_secret;

					console.log('Access Token:', accessToken);
					console.log('Secret Token:', secretToken);
				})
				.catch((error) => {
					console.error('Error:', error);
				});
			res.end(res);
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
