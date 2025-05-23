import ActivitiesServices from '../../../services/v1/Activities/activities.services.js';
import CalendarServices from '../../../services/v1/Calendar/calendar.services.js';
import LogsServices from '../../../services/v1/Logs/logs.services.js';
import RoutineNotificationsServices from '../../../services/v1/RoutineNotifications/routineNotifications.services.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';
import SuuntoServices from '../../../services/v1/Suunto/suunto.services.js';
import activityTypes from '../../../utils/constants/activityTypes.js';
import SuuntoActivitiesId from '../../../utils/constants/SuuntoActivitiesId.js';
import calculateTimeInZones from '../../../utils/functions/calculateTimeInZones.js';

class SuuntoController {
    static async getUser(req, res) {
        try {
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async auth(req, res) {
        try {
            const id = req.params?.db_id;
            const uri = await SuuntoServices.getAuthorizeUrl(id);
            console.log('uri: ', uri);
            res.redirect(uri);
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async getToken(req, res) {
        const { code, db_id } = req.query;
        const redirect_uri = `https://${req.hostname}/api/v1/suunto${req.path}?db_id=${db_id}`;
        try {
            const tokens = await SuuntoServices.token(redirect_uri, code);
            console.log('Polar tokens:', tokens);
            console.log('Polar tokens response data:', tokens?.response);
            const { access_token, token_type, refresh_token, user } = tokens;
            const response = await RunnersServices.update(db_id, {
                access_token,
                token_type,
                refresh_token,
                brand_id: user,
            });
            if (response.error)
                res.send(
                    '<h2>Ocurrió un error en la autorización, intenta nuevamente.</h2>'
                );
            else {
                await LogsServices.create(
                    `auth suunto`,
                    `authorization completed by the id user: ${db_id}`
                );
                res.send('<h2>Vuelve a la app</h2>');
            }
        } catch (error) {
            await LogsServices.create(
                'getToken suunto',
                JSON.stringify(error),
                error
            );
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async getActivitySamples(req, res) {
        try {
            const { from, to } = req.query;
            const { db_id } = req.params;
            if (!from || !to || !db_id) {
                res.send({
                    error: true,
                    data: 'Queries and parameter are required',
                });
            } else {
                const userData = await RunnersServices.getById(db_id);
                if (userData.error)
                    res.send({
                        error: true,
                        data: 'An error occurred while trying to obtain user data.',
                    });
                else {
                    const response = await SuuntoServices.dailyActivity(
                        from,
                        to,
                        userData.access_token
                    );
                    res.send({ error: false, data: response });
                }
            }
        } catch (error) {
            await LogsServices.create(
                'getActivitySamples suunto error',
                JSON.stringify(error),
                error
            );
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async getActivityStatistics(req, res) {
        try {
            const { startdate, enddate } = req.query;
            const { db_id } = req.params;
            if (!from || !to || !db_id) {
                res.send({
                    error: true,
                    data: 'Queries and parameter are required',
                });
            } else {
                const userData = await RunnersServices.getById(db_id);
                if (userData.error)
                    res.send({
                        error: true,
                        data: 'An error occurred while trying to obtain user data.',
                    });
                else {
                    const response = await SuuntoServices.activityStatistics(
                        startdate,
                        enddate,
                        userData.access_token
                    );
                    res.send({ error: false, data: response });
                }
            }
        } catch (error) {
            await LogsServices.create(
                'getActivityStatistics suunto error',
                JSON.stringify(error),
                error
            );
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async getSleepData(req, res) {
        try {
            const { from, to } = req.query;
            const { db_id } = req.params;
            if (!from || !to || !db_id) {
                res.send({
                    error: true,
                    data: 'Queries and parameter are required',
                });
            } else {
                const userData = await RunnersServices.getById(db_id);
                if (userData.error)
                    res.send({
                        error: true,
                        data: 'An error occurred while trying to obtain user data.',
                    });
                else {
                    const response = await SuuntoServices.sleepData(
                        from,
                        to,
                        userData.access_token
                    );
                    res.send({ error: false, data: response });
                }
            }
        } catch (error) {
            await LogsServices.create(
                'getSleepData suunto error',
                JSON.stringify(error),
                error
            );
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async setStats(req, res) {
        const { id, start_time, end_time } = req.body;
        try {
            if (!start_time || !end_time || !id)
                return res.send({
                    error: true,
                    data: 'Queries and parameter are required',
                });
            const userData = await RunnersServices.getById(db_id);
            if (userData.error)
                return res.send({
                    error: true,
                    data: 'An error occurred while trying to obtain user data.',
                });
            const response = await SuuntoServices.getWorkoutsList(
                start_time,
                end_time,
                userData.access_token
            );
            if (response.error) throw new Error('Error on requesting data');
            if (
                response?.payload[0] ||
                Object.keys(response?.payload[0]).length == 0
            )
                return res.send({
                    error: true,
                    data: 'There was not found any data',
                });
            const timestampOnSeconds = response?.payload[0]?.startTime;
            const dataToSend = {
                user_id: id,
                title: '',
                date: new Date(timestampOnSeconds).toLocaleString(),
                timestamp: timestampOnSeconds,
                distance: response?.payload[0]?.totalDistance,
                total_time: response?.payload[0]?.totalTime,
                average_heart_rate: response?.payload[0]?.hrdata?.workoutAvgHR,
                max_heart_rate: response?.payload[0]?.hrdata?.workoutMaxHR,
                resting_heart_rate: '',
                average_pace: response?.payload[0]?.avgPace,
                calories: response?.payload[0]?.energyConsumption,
                positive_slope: '',
                negative_slope: '',
                average_speed: response?.payload[0]?.avgSpeed,
                average_cadence: response?.payload[0]?.extensions?.avgCadence,
                training_load: '',
                max_cadence: response?.payload[0]?.cadence?.max,
                min_height: response?.payload[0]?.minAltitude,
                max_height: response?.payload[0]?.maxAltitude,
                estimated_liquid_loss: '',
                average_temperature:
                    response?.payload[0]?.extensions?.avgTemperature,
                paces: [],
                triathlon_data: [],
                description: '',
            };
            const activity = await ActivitiesServices.createActivity(
                dataToSend
            );
            res.send({
                data: activity,
                error: false,
            });
        } catch (error) {
            await LogsServices.create(
                'setStats suunto error',
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
            const brand_id = body.username;
            const workoutid = body.workoutid;
            const runner = await RunnersServices.getByBrandId(brand_id);
            const data = await SuuntoServices.getWorkoutById(
                workoutid,
                runner.refresh_token
            );
            const workoutData = data.payload;

            if (data.error) {
                console.log(data.error);
                return await LogsServices.create(
                    'GET workout suunto webhook error',
                    JSON.stringify(data.error),
                    data.error
                );
            }

            const suuntoActivityType =
                SuuntoActivitiesId[workoutData?.activityId];

            const typeOfActivity = activityTypes.suunto[suuntoActivityType];
            const { error, data: calendarActivities } =
                await CalendarServices.getLastByActivityType(
                    typeOfActivity,
                    runner._id
                );

            const { zones } = calculateTimeInZones(
                runner?.birthday,
                workoutData?.extensions.find(
                    (item) => item.type == 'HeartrateStreamExtension'
                )?.points
            );

            const time_in_zones = Object.values(
                workoutData?.extensions.find(
                    (item) => item.type == 'IntensityExtension'
                )?.zones?.heartRate
            ).map((item, index) => ({
                zone: index + 1,
                time_in_zone: item.totalTime,
            }));

            console.log({
                zones: [zones[0], zones[1], zones[2]],
                time_in_zones,
            });

            const dataToSend = {
                user_id: runner._id,
                brand_id,
                activity_id: workoutData?.workoutKey,
                activity_type: typeOfActivity || suuntoActivityType,
                title: suuntoActivityType,
                timestamp: workoutData?.startTime,
                date: new Date(workoutData?.startTime).toLocaleString(),
                distance:
                    parseInt(workoutData?.totalDistance) > 1000
                        ? workoutData?.totalDistance / 1000
                        : workoutData?.totalDistance,
                total_time: workoutData?.totalTime,
                average_heart_rate: workoutData?.hrdata?.workoutAvgHR,
                max_heart_rate: workoutData?.hrdata?.workoutMaxHR,
                average_pace: workoutData?.avgPace,
                max_pace: '',
                calories: workoutData?.energyConsumption,
                positive_slope: workoutData?.totalAscent,
                negative_slope: workoutData?.totalDescent,
                average_speed: workoutData?.avgSpeed,
                max_speed: workoutData?.maxSpeed,
                average_cadence: workoutData?.cadence?.avg,
                steps: workoutData?.stepCount,
                max_cadence: workoutData?.cadence?.max,
                training_load: '',
                resting_heart_rate: '',
                min_height: workoutData?.minAltitude,
                max_height: workoutData?.maxAltitude,
                estimated_liquid_loss: '',
                average_temperature: '',
                cadences: workoutData?.extensions
                    .find((item) => item.type == 'CadenceStreamExtension')
                    .points.map((item) => item.value)
                    .filter((item) => item),
                paces: workoutData?.extensions
                    .find((item) => item.type == 'SpeedStreamExtension')
                    ?.points?.map((item) =>
                        Math.pow((item.value * 60) / 1000, -1)
                    )
                    .filter((item) => item),
                elevation: workoutData?.extensions
                    .find((item) => item.type == 'AltitudeStreamExtension')
                    ?.points?.map((item) => item.value)
                    .filter((item) => item),
                heart_rates: workoutData?.extensions
                    .find((item) => item.type == 'HeartrateStreamExtension')
                    ?.points?.map((item) => item.value)
                    .filter((item) => item),
                speeds: workoutData?.extensions
                    .find((item) => item.type == 'SpeedStreamExtension')
                    ?.points?.map((item) => item.value)
                    .filter((item) => item),
                zones,
                time_in_zones,
                route: workoutData?.extensions
                    .find((item) => item.type == 'LocationStreamExtension')
                    ?.locationPoints?.map((item) => ({
                        latitude: item.latitude,
                        longitude: item.longitude,
                    }))
                    .filter((item) => item.latitude && item.longitude),
                triathlon_data: [],
                description: '',
            };
            const activityResponse = await ActivitiesServices.createActivity(
                dataToSend
            );
            if (!error && calendarActivities[0]?._id)
                await CalendarServices.completeActivity(
                    calendarActivities[0]?._id,
                    activityResponse?._id
                );

            RoutineNotificationsServices.setToTrue(runner._id);
            res.status(200).send('Suunto Webhook');
        } catch (error) {
            await LogsServices.create(
                'webhook suunto error',
                JSON.stringify(error),
                error
            );
            res.send({
                error: true,
                data: error,
            });
        }
    }
}

export default SuuntoController;
