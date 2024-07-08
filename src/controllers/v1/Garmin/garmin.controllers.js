import axios from 'axios';
import crypto from 'crypto';
import Oauth from 'oauth';
import OAuth10a from 'oauth-1.0a';
import config from '../../../config/garminData.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';
import { environment } from '../../../utils/constants/mainUrl.js';
import fetchGarmin from '../../../utils/fetches/fetchGarminAPI.js';
import ActivitiesServices from '../../../services/v1/Activities/activities.services.js';
import { v1 } from 'uuid';
import oauthSignature from 'oauth-signature';

function generateRandomNonce() {
    const randomBytes = crypto.randomBytes(16);
    return randomBytes.toString('base64').replace(/=/g, '').slice(0, 32);
}

class GarminController {
    static async auth(req, res) {
        try {
            const db_id = req.params?.db_id;
            const oauth = OAuth10a({
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
            const tokens = data?.split('&');
            const request_token = tokens[0]?.split('=')[1];
            const request_token_secret = tokens[1]?.split('=')[1];
            const url = environment(req.href);
            const oauth_callback = `${url}/api/v1/garmin/exchange_token?data=${db_id}||${request_token_secret}&request_token_secret=${request_token_secret}`;
            console.log(
                '------------------------------------------------------------------------------------------------------------------------------------------------------------------------'
            );
            console.log(
                `This is oauth_callback: \n${oauth_callback}\n on auth`
            );
            const redirect_url = `https://connect.garmin.com/oauthConfirm?data=${db_id}||${request_token_secret}&oauth_token=${request_token}&oauth_callback=${oauth_callback}`;
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
            const { data, oauth_verifier, oauth_token } = req.query;

            console.log('This is the url: ', req?.originalUrl);

            const db_id = data.split('||')[0];
            const request_token_secret = data.split('||')[1];

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
                oauth_token,
                request_token_secret,
                oauth_verifier,
                async function (error, accessToken, tokenSecret) {
                    if (error) {
                        console.error(
                            'Error getting OAuth10a access token:',
                            error
                        );
                    } else {
                        // const method = 'GET';
                        // const consumerKey = config.client_id;
                        // const consumerSecret = config.client_secret;
                        // const oauth_nonce = v1();
                        // const oauth_timestamp = Math.floor(Date.now() / 1000);
                        // const base_url =
                        //     'https://apis.garmin.com/wellness-api/rest/user/id';

                        // const baseString = `${method}&${base_url}&${oauth_timestamp}&${oauth_nonce}`;
                        // const signingKey = `${consumerSecret}&${tokenSecret}`;
                        // const signature = crypto
                        //     .createHmac('sha1', signingKey)
                        //     .update(baseString)
                        //     .digest()
                        //     .toString('base64');
                        // const oauth_signature = encodeURIComponent(signature);

                        // const authorizationHeader = `OAuth oauth_consumer_key="${consumerKey}", oauth_token="${accessToken}", oauth_nonce="${oauth_nonce}", oauth_timestamp="${oauth_timestamp}", oauth_signature_method="HMAC_SHA1", oauth_signature="${oauth_signature}", oauth_version="1.0"`;

                        const oauth_timestamp = Math.floor(Date.now() / 1000);
                        const oauth_nonce = v1();
                        const parameters = {
                            oauth_consumer_key:
                                '8ea9745c-56a3-4f5f-961f-9731a83a172b',
                            oauth_signature_method: 'HMAC-SHA1',
                            oauth_timestamp: oauth_timestamp,
                            oauth_nonce: oauth_nonce,
                            oauth_version: '1.0',
                            oauth_token: accessToken,
                            oauth_verifier,
                        };
                        let ordered = {};
                        Object.keys(parameters)
                            .sort()
                            .forEach(function (key) {
                                ordered[key] = parameters[key];
                            });
                        let encodedParameters = '';
                        for (let key in ordered) {
                            const encodedValue = escape(ordered[key]);
                            const encodedKey = encodeURIComponent(key);
                            if (encodedParameters === '') {
                                encodedParameters += encodeURIComponent(
                                    `${encodedKey}=${encodedValue}`
                                );
                            } else {
                                encodedParameters += encodeURIComponent(
                                    `&${encodedKey}=${encodedValue}`
                                );
                            }
                        }
                        const method = 'GET';
                        const base_url =
                            'https://apis.garmin.com/wellness-api/rest/user/id';
                        const encodedUrl = encodeURIComponent(base_url);
                        encodedParameters =
                            encodeURIComponent(encodedParameters); // encodedParameters which we generated in last step.
                        const signature_base_string = `${method}&${encodedUrl}&${encodedParameters}`;
                        const signing_key = `${config.client_secret}&${tokenSecret}`;
                        const oauth_signature = crypto
                            .createHmac('sha1', signing_key)
                            .update(signature_base_string)
                            .digest()
                            .toString('base64');
                        const encoded_oauth_signature =
                            encodeURIComponent(oauth_signature);

                        const auth = `OAuth oauth_consumer_key="${parameters.oauth_consumer_key}",oauth_signature_method="${parameters.oauth_signature_method}",oauth_timestamp="${oauth_timestamp}",oauth_nonce="${oauth_nonce}", oauth_token="${parameters.oauth_token}", oauth_version="${parameters.oauth_version}", oauth_signature="${encoded_oauth_signature}", oauth_verifier="${parameters.oauth_verifier}"`;

                        const { data, error } = await axios({
                            url: base_url,
                            method,
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

                        console.log('data => ', data);
                        console.log('auth => ', auth);
                        console.log('oauth_signature => ', oauth_signature);
                        const sign = oauthSignature.generate(
                            method,
                            base_url,
                            parameters,
                            config.client_secret,
                            tokenSecret
                        );
                        console.log('sign => ', sign);

                        if (error) {
                            res.send({
                                error,
                                data: 'An error has ocurred getting garmin id.',
                            });
                        } else {
                            const runner = await RunnersServices.getById(db_id);
                            const updatedRunner = {
                                ...runner,
                                access_token: accessToken,
                                refresh_token: tokenSecret,
                                brand_id: data.userId,
                            };
                            await RunnersServices.update(db_id, updatedRunner);
                            console.log(
                                'This is the db_id of who are sync with garmin ' +
                                    db_id
                            );

                            res.send(
                                'Conexión exitosa! Puedes volver a la app.'
                            );
                        }
                    }
                }
            );
        } catch (error) {
            console.log('Error on Garmin sync: ', error);
            res.status(500).send({
                error: true,
                msg: 'An error has ocurred',
                data: error,
            });
        }
    }

    static async setStats(req, res) {
        const { id, start_time, end_time } = req.body;
        let user;
        try {
            const request_base_url =
                'https://apis.garmin.com/wellness-api/rest/activityDetails';

            const oauth = OAuth10a({
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
            if (id) user = await RunnersServices.getById(id);
            const requestData = {
                url: request_base_url,
                method: 'GET',
                data: { oauth_token: user?.access_token },
            };
            const authHeader = oauth.toHeader(oauth.authorize(requestData));

            const { data } = axios({
                url: request_base_url,
                headers: authHeader,
                data: {
                    uploadStartTimeInSeconds: start_time,
                    uploadEndTimeInSeconds: end_time,
                },
            });
            if (Object.keys(data) == 0)
                return res.send({
                    error: true,
                    data: 'There was not found any data',
                });
            const timestampOnSeconds = parseInt(
                `${data?.startTimeInSeconds}000`
            );
            const dataToSend = {
                user_id: id,
                title: data?.activityType,
                date: new Date(timestampOnSeconds).toLocaleString(),
                timestamp: timestampOnSeconds,
                distance: data?.distanceInMeters,
                total_time: data?.durationInSeconds,
                average_heart_rate: data?.averageHeartRateInBeatsPerMinute,
                max_heart_rate: data?.maxHeartRateInBeatsPerMinute,
                resting_heart_rate: '',
                average_pace: data?.averagePaceInMinutesPerKilometer,
                calories: data?.activeKilocalories,
                positive_slope: data?.totalElevationGainInMeters,
                negative_slope: data?.totalElevationLossInMeters,
                average_speed: data?.averageSpeedInMetersPerSecond * 3.6,
                average_cadence: data?.averageRunCadenceInStepsPerMinute,
                training_load: '',
                max_cadence: data?.maxRunCadenceInStepsPerMinute,
                min_height: '',
                max_height: '',
                estimated_liquid_loss: '',
                average_temperature: '',
                paces: data?.samples,
                triathlonData: [],
                description: '',
                activityId: data?.activityId,
            };
            const activity = await ActivitiesServices.createActivity(
                dataToSend
            );
            res.send({
                data: activity,
                error: false,
            });
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
