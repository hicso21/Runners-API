import config from '../../../config/polarData.js';
import LogsServices from '../../../services/v1/Logs/logs.services.js';
import PolarServices from '../../../services/v1/Polar/polar.services.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';
import mainUrl from '../../../utils/constants/mainUrl.js';
import { Buffer } from 'buffer';
import fetchPolar from '../../../utils/fetches/fetchPolarAPI.js';
import ActivitiesServices from '../../../services/v1/Activities/activities.services.js';
import qs from 'qs';
import axios from 'axios';
import activityTypes from '../../../utils/constants/activityTypes.js';
import polarTitleParser from '../../../utils/functions/polarTitleParser.js';
import polarDurationParse from '../../../utils/functions/polarDurationParse.js';
import CalendarServices from '../../../services/v1/Calendar/calendar.services.js';
import NotificationsServices from '../../../services/v1/Notifications/notifications.services.js';

class PolarController {
    static async authUser(req, res) {
        try {
            const db_id = req.params?.db_id;
            const redirect_uri = config.redirect_uri;
            const uri =
                `${config.oauth_endpoint}/oauth2/authorization?` +
                `response_type=code&` +
                `client_id=${process.env.polar_client_id}&` +
                `redirect_uri=${redirect_uri}&` +
                `state=${db_id}`;
            res.redirect(uri);
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async getExchangeToken(req, res) {
        const { code, state } = req.query;
        console.log('params', { code, state });
        const body = qs.stringify({
            grant_type: 'authorization_code',
            code,
            redirect_uri: config.redirect_uri,
        });
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
                `${process.env.polar_client_id}:${process.env.polar_client_secret}`
            ).toString('base64')}`,
            Accept: 'application/json;charset=UTF-8',
        };
        try {
            const response = await PolarServices.token(body, headers);
            if (response?.access_token != undefined) {
                console.log('Polar update data', {
                    access_token: response.access_token,
                    token_type: response.token_type,
                    x_user_id: response.x_user_id,
                });
                RunnersServices.update(state, {
                    access_token: response.access_token,
                    token_type: response.token_type,
                    brand_id: response.x_user_id,
                });
                const polarResponse = await PolarServices.register(
                    response.x_user_id,
                    response.token_type,
                    response.access_token
                );
                if (polarResponse?.error) {
                    console.log(
                        'polarResponse data response',
                        polarResponse?.data?.response
                    );
                } else console.log('polarResponse ', polarResponse);
                res.send('<h2>Vuelve a la app</h2>');
            } else {
                await LogsServices.create(
                    'token error polar',
                    JSON.stringify(response)
                );
                res.send('<h2>Ocurrió un error. Intenta nuevamente</h2>');
            }
        } catch (error) {
            await LogsServices.create(
                'token error polar',
                JSON.stringify(error),
                error
            );
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async webhook(req, res) {
        try {
            const body = req.body;
            const brand_id = body?.user_id;
            const exercise_url = body?.url;

            if (body?.event == 'PING')
                return res.status(200).send({ msg: 'Ping event type' });

            const runner = await RunnersServices.getByBrandId(brand_id);

            const activity = await fetch(
                `${exercise_url}?zones=true&route=true`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${runner.access_token}`,
                    },
                }
            ).then((res) => res.json());

            const { error: activityError } =
                await ActivitiesServices.getByBrandActivityId(activity?.id);

            if (!activity?.id || activityError) return res.sendStatus(204);

            const typeOfActivity =
                activityTypes.polar[activity?.detailed_sport_info];
            const { error, data: calendarActivities } =
                await CalendarServices.getLastByActivityType(
                    typeOfActivity,
                    runner._id
                );

            const dataToSend = {
                user_id: runner._id,
                brand_id,
                activity_id: activity?.id,
                activity_type: typeOfActivity,
                title: polarTitleParser(activity?.detailed_sport_info),
                timestamp: new Date(activity?.start_time).getTime(),
                date: new Date(activity?.start_time).toLocaleString(),
                distance: activity?.distance,
                total_time: polarDurationParse(activity?.duration),
                average_heart_rate: activity?.heart_rate?.average,
                max_heart_rate: activity?.heart_rate?.maximum,
                average_pace: '',
                max_pace: '',
                calories: activity?.calories,
                positive_slope: '',
                negative_slope: '',
                average_speed: '',
                max_speed: '',
                average_cadence: '',
                steps: '',
                max_cadence: '',
                training_load: activity?.training_load,
                resting_heart_rate: '',
                min_height: '',
                max_height: '',
                estimated_liquid_loss: '',
                average_temperature: '',
                paces: [],
                heart_rates: [],
                speeds: [].filter((item) => item),
                zones: [],
                time_in_zones: activity?.heart_rate_zones?.map((item) => ({
                    zone: item?.index + 1,
                    time_in_zone: polarDurationParse(item?.in_zone),
                })),
                route: activity?.route
                    ?.map((item) => ({
                        latitude: item?.latitude,
                        longitude: item?.longitude,
                    }))
                    .filter((item) => item.latitude && item.longitude),
                triathlon_data: [],
                description: '',
            };

            const activityResponse = await ActivitiesServices.createActivity(
                dataToSend
            );
            console.log('Polar Activity created', activityResponse);

            if (!error && calendarActivities[0]?._id)
                await CalendarServices.completeActivity(
                    calendarActivities[0]?._id,
                    activityResponse?._id
                );
            NotificationsServices.setToTrue(runner._id);
            res.sendStatus(200);
        } catch (error) {
            await LogsServices.create(
                'webhook error polar',
                JSON.stringify(error),
                error
            );
            res.send({
                error: true,
                data: error,
            });
        }
    }

    // static async getRunnerData(req, res) {
    //     try {
    //         const { db_id } = req.params;
    //         const response = await PolarServices.getUser(db_id);
    //         res.send(response);
    //     } catch (error) {
    //         await LogsServices.create(
    //             'getRunnerData error polar',
    //             JSON.stringify(error),
    //             error
    //         );
    //         res.send({
    //             error: true,
    //             data: error,
    //         });
    //     }
    // }

    // static async getDailyActivity(req, res) {
    //     const { db_id } = req.params;
    //     const headers = new Headers();
    //     try {
    //         const { 'available-user-data': data } =
    //             await PolarServices.pullNotifications();
    //         const haveUserDailyActivity = data?.some(
    //             (item) => item['user-id'] == db_id
    //         );
    //         if (!haveUserDailyActivity) return res.send(false);
    //         const userData = await RunnersServices.getById(db_id);
    //         if (!userData?.access_token) {
    //             await LogsServices.create(
    //                 'getDailyActivity error polar',
    //                 "Data collection by the runners' service did not work as it should have"
    //             );
    //             return res.send({
    //                 error: true,
    //                 data: "Data collection by the runners' service did not work as it should have",
    //             });
    //         }
    //         headers.append('Accept', 'application/json');
    //         headers.append('Authorization', `Bearer ${userData?.access_token}`);
    //         const { data: transaction } = await fetchPolar({
    //             url: `/v3/users/${db_id}/activity-transactions`,
    //             method: 'POST',
    //             headers,
    //         }); // { transaction-id, resource-uri }
    //         if (transaction['transaction-id'] === undefined)
    //             return res.send({
    //                 error: true,
    //                 data: 'The transaction request could not be executed correctly',
    //             });
    //         await fetchPolar({
    //             url: `/v3/users/${db_id}/activity-transactions/${transaction['transaction-id']}`,
    //             method: 'PUT',
    //             headers,
    //         });
    //         const { data: summary } = await fetchPolar({
    //             url: `/v3/users/${db_id}/activity-transactions/${transaction['transaction-id']}`,
    //             method: 'GET',
    //             headers,
    //         });
    //         if (summary['activity-log'] === undefined)
    //             return res.send({
    //                 error: true,
    //                 data: 'The summary of the list of activities could not be obtained correctly.',
    //             });
    //         const listOfActivity = await Promise.all(
    //             summary['activity-log'].map(async (activityUrl) => {
    //                 const { data } = await fetchPolar.get(activityUrl);
    //                 return data;
    //             })
    //         );
    //         res.send(listOfActivity);
    //     } catch (error) {
    //         await LogsServices.create(
    //             'getDailyActivity error polar',
    //             JSON.stringify(error),
    //             error
    //         );
    //         res.send({
    //             error: true,
    //             data: error,
    //         });
    //     }
    // }

    // static async getTrainingData(req, res) {
    //     const { db_id } = req.params;
    //     const headers = new Headers();
    //     try {
    //         const { 'available-user-data': data } =
    //             await PolarServices.pullNotifications();
    //         const haveUserDailyActivity = data?.some(
    //             (item) => item['user-id'] == db_id
    //         );
    //         if (!haveUserDailyActivity) return res.send(false);
    //         const userData = await RunnersServices.getById(db_id);
    //         if (!userData?.access_token) {
    //             await LogsServices.create(
    //                 'getTrainingData error polar',
    //                 "Data collection by the runners' service did not work as it should have"
    //             );
    //             return res.send({
    //                 error: true,
    //                 data: "Data collection by the runners' service did not work as it should have",
    //             });
    //         }
    //         headers.append('Accept', 'application/json');
    //         headers.append('Authorization', `Bearer ${userData?.access_token}`);
    //         const { data: transaction } = await fetchPolar({
    //             url: `/v3/users/${db_id}/exercise-transactions`,
    //             method: 'POST',
    //             headers,
    //         }); // { transaction-id, resource-uri }
    //         if (transaction['transaction-id'] === undefined)
    //             return res.send({
    //                 error: true,
    //                 data: 'The transaction request could not be executed correctly',
    //             });
    //         await fetchPolar({
    //             url: `/v3/users/${db_id}/exercise-transactions/${transaction['transaction-id']}`,
    //             method: 'PUT',
    //             headers,
    //         });
    //         const { data: summary } = await fetchPolar({
    //             url: `/v3/users/${db_id}/exercise-transactions/${transaction['transaction-id']}`,
    //             method: 'GET',
    //             headers,
    //         });
    //         if (summary['exercises'] === undefined)
    //             return res.send({
    //                 error: true,
    //                 data: 'The summary of the list of activities could not be obtained correctly.',
    //             });
    //         const listOfActivity = await Promise.all(
    //             summary['exercises'].map(async (activityUrl) => {
    //                 const { data } = await fetchPolar.get(activityUrl);
    //                 return data;
    //             })
    //         );
    //         res.send(listOfActivity);
    //     } catch (error) {
    //         await LogsServices.create(
    //             'getTrainingData error polar',
    //             JSON.stringify(error),
    //             error
    //         );
    //         res.send({
    //             error: true,
    //             data: error,
    //         });
    //     }
    // }

    // static async getPhysicalData(req, res) {
    //     const { db_id } = req.params;
    //     const headers = new Headers();
    //     try {
    //         const { 'available-user-data': data } =
    //             await PolarServices.pullNotifications();
    //         const haveUserDailyActivity = data?.some(
    //             (item) => item['user-id'] == db_id
    //         );
    //         if (!haveUserDailyActivity) return res.send(false);
    //         const userData = await RunnersServices.getById(db_id);
    //         if (!userData?.access_token) {
    //             await LogsServices.create(
    //                 'getPhysicalData error polar',
    //                 "Data collection by the runners' service did not work as it should have"
    //             );
    //             return res.send({
    //                 error: true,
    //                 data: "Data collection by the runners' service did not work as it should have",
    //             });
    //         }
    //         headers.append('Accept', 'application/json');
    //         headers.append('Authorization', `Bearer ${userData?.access_token}`);
    //         const { data: transaction } = await fetchPolar({
    //             url: `/v3/users/${db_id}/physical-information-transactions`,
    //             method: 'POST',
    //             headers,
    //         }); // { transaction-id, resource-uri }
    //         if (transaction['transaction-id'] === undefined)
    //             return res.send({
    //                 error: true,
    //                 data: 'The transaction request could not be executed correctly',
    //             });
    //         await fetchPolar({
    //             url: `/v3/users/${db_id}/physical-information-transactions/${transaction['transaction-id']}`,
    //             method: 'PUT',
    //             headers,
    //         });
    //         const { data: summary } = await fetchPolar({
    //             url: `/v3/users/${db_id}/physical-information-transactions/${transaction['transaction-id']}`,
    //             method: 'GET',
    //             headers,
    //         });
    //         if (summary['physical-informations'] === undefined)
    //             return res.send({
    //                 error: true,
    //                 data: 'The summary of the list of activities could not be obtained correctly.',
    //             });
    //         const listOfActivity = await Promise.all(
    //             summary['physical-informations'].map(async (activityUrl) => {
    //                 const { data } = await fetchPolar.get(activityUrl);
    //                 return data;
    //             })
    //         );
    //         res.send(listOfActivity);
    //     } catch (error) {
    //         await LogsServices.create(
    //             'getPhysicalData error polar',
    //             JSON.stringify(error),
    //             error
    //         );
    //         res.send({
    //             error: true,
    //             data: error,
    //         });
    //     }
    // }

    // static async setStats(req, res) {
    //     const { id } = req.body;
    //     const headers = new Headers();
    //     headers.append('Accept', 'application/json');
    //     try {
    //         const userData = await RunnersServices.getById(id);
    //         const { 'available-user-data': data } =
    //             await PolarServices.pullNotifications();
    //         const haveUserDailyActivity = data?.some(
    //             (item) => item['user-id'] == userData?.brand_id
    //         );
    //         if (!haveUserDailyActivity) return res.send(false);
    //         if (!userData?.access_token) {
    //             await LogsServices.create(
    //                 'setStats error polar',
    //                 "Data collection by the runners' service did not work as it should have"
    //             );
    //             return res.send({
    //                 error: true,
    //                 data: "Data collection by the runners' service did not work as it should have",
    //             });
    //         }
    //         headers.append('Authorization', `Bearer ${userData?.access_token}`);
    //         const transaction = await PolarServices.postTrainingData(
    //             userData?.brand_id,
    //             headers
    //         ); // { transaction-id, resource-uri }
    //         if (transaction['transaction-id'] === undefined)
    //             return res.send({
    //                 error: true,
    //                 data: 'The transaction request could not be executed correctly',
    //             });
    //         await PolarServices.putTrainingData(
    //             userData?.brand_id,
    //             transaction,
    //             headers
    //         );
    //         const summary = await PolarServices.listExercises(
    //             userData?.brand_id,
    //             transaction,
    //             headers
    //         );
    //         if (!summary['exercises'])
    //             return res.send({
    //                 error: true,
    //                 data: 'The summary of the list of activities could not be obtained correctly.',
    //             });
    //         const training_url = summary['exercises'].sort(
    //             (a, b) => b.split('/').reverse()[0] - a.split('/').reverse()[0]
    //         )[0];
    //         const training = await PolarServices.getExercise(
    //             training_url,
    //             headers
    //         );
    //         const timestampOnSeconds = new Date(
    //             training['start-time']
    //         ).getTime();
    //         const dataToSend = {
    //             user_id: _id,
    //             title: training['detailed-sport-info'],
    //             date: new Date(timestampOnSeconds).toLocaleString(),
    //             timestamp: timestampOnSeconds,
    //             distance: training['distance'],
    //             total_time: parseDurationToSeconds(training['duration']),
    //             average_heart_rate: training['heart-rate'].average,
    //             max_heart_rate: training['heart-rate'].maximum,
    //             resting_heart_rate: '',
    //             average_pace: '',
    //             calories: training['calories'],
    //             positive_slope: '',
    //             negative_slope: '',
    //             average_speed: training[''],
    //             average_cadence: '',
    //             training_load: training['training-load'],
    //             max_cadence: '',
    //             min_height: '',
    //             max_height: '',
    //             estimated_liquid_loss: '',
    //             average_temperature: '',
    //             paces: [],
    //             triathlonData: training[''],
    //             description: '',
    //         };
    //         const activity = await ActivitiesServices.createActivity(
    //             dataToSend
    //         );
    //         res.send({
    //             data: activity,
    //             error: false,
    //         });
    //     } catch (error) {
    //         await LogsServices.create(
    //             'setStats error polar',
    //             JSON.stringify(error),
    //             error
    //         );
    //         res.send({
    //             error: true,
    //             data: error,
    //         });
    //     }
    // }

    // static async getWebhook(req, res) {
    //     try {
    //         const body = req.body;
    //         console.log('Polar getWebhook', body);
    //         const params = req.params;
    //         console.log('Polar params', params);
    //         res.sendStatus(200);
    //     } catch (error) {
    //         await LogsServices.create(
    //             'getWebhook error polar',
    //             JSON.stringify(error),
    //             error
    //         );
    //         res.send({
    //             error: true,
    //             data: error,
    //         });
    //     }
    // }
}

export default PolarController;
