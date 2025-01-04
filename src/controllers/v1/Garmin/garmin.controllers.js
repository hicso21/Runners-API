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
import activityTypes from '../../../utils/constants/activityTypes.js';
import CalendarServices from '../../../services/v1/Calendar/calendar.services.js';
import NotificationsServices from '../../../services/v1/Notifications/notifications.services.js';
import LogsServices from '../../../services/v1/Logs/logs.services.js';
import calculateTimeInZones from '../../../utils/functions/calculateTimeInZones.js';

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

            const db_id = data?.split('||')[0];
            const request_token_secret = data?.split('||')[1];

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
                        const oauth_timestamp = Math.floor(Date.now() / 1000);
                        const oauth_nonce = v1();
                        const parameters = {
                            oauth_consumer_key: process.env.garmin_client_id,
                            oauth_signature_method: 'HMAC-SHA1',
                            oauth_timestamp: oauth_timestamp,
                            oauth_nonce: oauth_nonce,
                            oauth_version: '1.0',
                            oauth_token: accessToken,
                            oauth_verifier,
                        };
                        const method = 'GET';
                        const base_url =
                            'https://apis.garmin.com/wellness-api/rest/user/id';

                        const sign = oauthSignature.generate(
                            method,
                            base_url,
                            parameters,
                            config.client_secret,
                            tokenSecret
                        );

                        const auth = `OAuth oauth_consumer_key="${parameters.oauth_consumer_key}",oauth_signature_method="${parameters.oauth_signature_method}",oauth_timestamp="${oauth_timestamp}",oauth_nonce="${oauth_nonce}", oauth_token="${parameters.oauth_token}", oauth_version="${parameters.oauth_version}", oauth_signature="${sign}", oauth_verifier="${parameters.oauth_verifier}"`;

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

                        if (error) {
                            res.send({
                                error,
                                data: 'An error has ocurred getting garmin id.',
                            });
                        } else {
                            const updatedRunnerData = {
                                access_token: accessToken,
                                refresh_token: tokenSecret,
                                brand_id: data.userId,
                            };
                            console.log(
                                'updatedRunnerData => ',
                                updatedRunnerData
                            );
                            const updateResponse = await RunnersServices.update(
                                db_id,
                                updatedRunnerData
                            );
                            console.log('updateResponse', updateResponse);

                            res.send(
                                '<h2>Conexión exitosa! Puedes volver a la app.</h2>'
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
            if (id) user = await RunnersServices.getById(id);
            else
                return res.send({
                    data: 'You must send the ID of the user',
                    error: true,
                });

            const oauth_timestamp = Math.floor(Date.now() / 1000);
            const oauth_nonce = v1();
            const parameters = {
                oauth_consumer_key: process.env.garmin_client_id,
                oauth_signature_method: 'HMAC-SHA1',
                oauth_timestamp: oauth_timestamp,
                oauth_nonce: oauth_nonce,
                oauth_version: '1.0',
                oauth_token: user?.access_token,
                oauth_verifier,
            };
            const method = 'GET';
            const base_url =
                'https://apis.garmin.com/wellness-api/rest/activityDetails';

            const sign = oauthSignature.generate(
                method,
                base_url,
                parameters,
                config.client_secret,
                tokenSecret
            );

            const auth = `OAuth oauth_consumer_key="${parameters.oauth_consumer_key}",oauth_signature_method="${parameters.oauth_signature_method}",oauth_timestamp="${oauth_timestamp}",oauth_nonce="${oauth_nonce}", oauth_token="${parameters.oauth_token}", oauth_version="${parameters.oauth_version}", oauth_signature="${sign}", oauth_verifier="${parameters.oauth_verifier}"`;

            const { data } = await axios({
                url: base_url,
                method,
                headers: {
                    Authorization: auth,
                },
                data: {
                    uploadStartTimeInSeconds: start_time,
                    uploadEndTimeInSeconds: end_time,
                },
            });
            console.log('setStats response => ', data);
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
                triathlon_data: [],
                description: '',
                activityId: data?.activityId,
            };
            const activity = await ActivitiesServices.createActivity(
                dataToSend
            );

            console.log('New Garmin Activity response', activity);

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

    static async activitiesWebhook(req, res) {
        try {
            const activities = req?.body?.activities;
            const userBrandId = activities[0].userId;
            const runner = await RunnersServices.getByBrandId(userBrandId);
            console.log('runner_id:', runner?._id);
            activities?.map(async (activity) => {
                console.log('garmin activity', activity);
                const typeOfActivity =
                    activityTypes.garmin[activity?.activityType];

                const { error, data } =
                    await CalendarServices.getLastByActivityType(
                        typeOfActivity,
                        runner._id
                    );

                const { data: activityData, error: ActivityError } =
                    await ActivitiesServices.getByBrandActivityId(
                        activity?.activityId
                    );

                const dataToSend = {
                    user_id: runner._id,
                    brand_id: activity?.userId,
                    activity_id: activity?.activityId,
                    activity_type: typeOfActivity || activity?.activityType,
                    title: '',
                    timestamp: activity?.startTimeInSeconds * 1000,
                    date: new Date(
                        activity?.startTimeInSeconds * 1000
                    ).toLocaleString(),
                    distance: activity?.distanceInMeters,
                    total_time: activity?.durationInSeconds,
                    average_heart_rate:
                        activity?.averageHeartRateInBeatsPerMinute,
                    max_heart_rate: activity?.maxHeartRateInBeatsPerMinute,
                    average_pace: activity?.averagePaceInMinutesPerKilometer,
                    max_pace: activity?.maxPaceInMinutesPerKilometer,
                    calories: activity?.activeKilocalories,
                    positive_slope: activity?.totalElevationGainInMeters,
                    negative_slope: activity?.totalElevationLossInMeters,
                    average_speed: activity?.averageSpeedInMetersPerSecond,
                    max_speed: activity?.maxSpeedInMetersPerSecond,
                    average_cadence:
                        activity?.averageRunCadenceInStepsPerMinute,
                    steps: activity?.steps,
                    max_cadence: activity?.maxRunCadenceInStepsPerMinute,
                    training_load: '',
                    resting_heart_rate: '',
                    min_height: '',
                    max_height: '',
                    estimated_liquid_loss: '',
                    average_temperature: '',
                    paces: [],
                    heart_rates: [],
                    speeds: [],
                    zones: [],
                    time_in_zones: [],
                    route: [],
                    triathlon_data: [],
                    description: '',
                };

                if (!ActivityError && activityData?.heart_rates?.length > 0) {
                    const {
                        paces,
                        heart_rates,
                        speeds,
                        zones,
                        route,
                        triathlon_data,
                        ...sendingData
                    } = dataToSend;
                    const activityResponse =
                        await ActivitiesServices.updateActivity(
                            activityData?._id,
                            sendingData
                        );
                    if (!error && data[0]?._id)
                        await CalendarServices.completeActivity(
                            data[0]?._id,
                            activityResponse?._id
                        );
                } else {
                    const activityResponse =
                        await ActivitiesServices.createActivity(dataToSend);
                    if (!error && data[0]?._id)
                        await CalendarServices.completeActivity(
                            data[0]?._id,
                            activityResponse?._id
                        );
                }
            });
            NotificationsServices.setToTrue(runner._id);
            res.status(200).send('EVENT_RECEIVED');
        } catch (error) {
            console.log('Error on POST of get_stats_activities');
            await LogsServices.create(
                'activitiesWebhook error garmin',
                JSON.stringify(error),
                error
            );
            res.status(500).send({
                error: true,
                msg: 'An error has ocurred',
                data: error,
            });
        }
    }

    static async getStatsActivityDetails(req, res) {
        const body = req.body;
        try {
            console.log('getStatsActivityDetails:', body);
            console.log(
                'getStatsActivityDetails summary',
                body?.activityDetails[0].summary
            );
            console.log(
                'getStatsActivityDetails samples',
                body?.activityDetails[0].samples[0]
            );
            const activities = body?.activityDetails;
            const userBrandId = activities[0].userId;
            const runner = await RunnersServices.getByBrandId(userBrandId);
            activities?.map(async (activity) => {
                const typeOfActivity =
                    activityTypes.garmin[activity?.summary?.activityType];

                const { error, data } =
                    await CalendarServices.getLastByActivityType(
                        typeOfActivity,
                        runner._id
                    );

                const { time_in_zones, zones } = calculateTimeInZones(
                    runner?.birthday,
                    activity?.samples
                );
                console.log({
                    zones: [zones[0], zones[1], zones[2]],
                    time_in_zones,
                });

                const dataToSend = {
                    user_id: runner._id,
                    brand_id: activity?.summary?.userId,
                    activity_id: activity?.summary?.activityId,
                    activity_type:
                        typeOfActivity || activity?.summary?.activityType,
                    title: '',
                    timestamp: activity?.summary?.startTimeInSeconds * 1000,
                    date: new Date(
                        activity?.summary?.startTimeInSeconds * 1000
                    ).toLocaleString(),
                    distance: activity?.summary?.distanceInMeters,
                    total_time: activity?.summary?.durationInSeconds,
                    average_heart_rate:
                        activity?.summary?.averageHeartRateInBeatsPerMinute,
                    max_heart_rate:
                        activity?.summary?.maxHeartRateInBeatsPerMinute,
                    average_pace:
                        activity?.summary?.averagePaceInMinutesPerKilometer,
                    max_pace: activity?.summary?.maxPaceInMinutesPerKilometer,
                    calories: activity?.summary?.activeKilocalories,
                    positive_slope:
                        activity?.summary?.totalElevationGainInMeters,
                    negative_slope:
                        activity?.summary?.totalElevationLossInMeters,
                    average_speed:
                        activity?.summary?.averageSpeedInMetersPerSecond,
                    max_speed: activity?.summary?.maxSpeedInMetersPerSecond,
                    average_cadence:
                        activity?.summary?.averageRunCadenceInStepsPerMinute,
                    steps: activity?.summary?.steps,
                    max_cadence:
                        activity?.summary?.maxRunCadenceInStepsPerMinute,
                    training_load: '',
                    resting_heart_rate: '',
                    min_height: '',
                    max_height: '',
                    estimated_liquid_loss: '',
                    average_temperature: '',
                    rate: activity?.samples
                        ?.map((item) => (item.stepsPerMinute * 60) / 1000)
                        .filter((item) => item),
                    paces: activity?.samples
                        ?.map((item) =>
                            Math.pow(
                                (item.speedMetersPerSecond * 60) / 1000,
                                -1
                            )
                        )
                        .filter((item) => item),
                    elevation: activity?.samples
                        ?.map((item) => item.elevationInMeters)
                        .filter((item) => item),
                    heart_rates: activity?.samples?.map(
                        (item) => item.heartRate
                    ),
                    speeds: activity?.samples
                        ?.map((item) => item.speedMetersPerSecond)
                        .filter((item) => item),
                    zones,
                    time_in_zones,
                    route: activity?.samples
                        ?.map((item) => ({
                            latitude: item.latitudeInDegree,
                            longitude: item.longitudeInDegree,
                        }))
                        .filter((item) => item.latitude && item.longitude),
                    triathlon_data: [],
                    description: '',
                };

                const activityResponse =
                    await ActivitiesServices.createActivity(dataToSend);
                if (!error && data[0]?._id)
                    await CalendarServices.completeActivity(
                        data[0]?._id,
                        activityResponse?._id
                    );
            });
            NotificationsServices.setToTrue(runner._id);
            res.status(200).send('EVENT_RECEIVED');
        } catch (error) {
            console.log('Error on POST of get_stats_activity_details');
            await LogsServices.create(
                'getStatsActivityDetails error garmin',
                JSON.stringify(error),
                error
            );
            res.status(500).send({
                error: true,
                msg: 'An error has ocurred',
                data: error,
            });
        }
    }
}

export default GarminController;
