import ActivitiesServices from '../../../services/v1/Activities/activities.services.js';
import LogsServices from '../../../services/v1/Logs/logs.services.js';
import RunnersServices from '../../../services/v1/Runners/runners.services.js';
import StravaServices from '../../../services/v1/Strava/strava.services.js';
import fromKilojouleToCalories from '../../../utils/functions/fromKilojouleToCalories.js';

class StravaController {
    static async authorize(req, res) {
        try {
            const id = req.params?.db_id;
            const uri = await StravaServices.authorize(id);
            res.redirect(uri);
        } catch (error) {
            console.log(error);
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async manageUserCode(req, res) {
        try {
            const user_id = req.params?.db_id;
            const { code } = req.query;
            const token = await StravaServices.token(code);
            const token_type = token.token_type;
            const access_token = token.access_token;
            const refresh_token = token.refresh_token;
            const brand_id = token.athlete.id;
            const response = await RunnersServices.update(user_id, {
                token_type,
                refresh_token,
                access_token,
                brand_id,
            });
            if (response.error)
                res.send(
                    '<h2>Ocurrió un error en la autorización, intenta nuevamente.</h2>'
                );
            else res.send('<h2>Vuelve a la app</h2>');
        } catch (error) {
            await LogsServices.create(
                'manageUserCode error strava',
                JSON.stringify(error),
                error
            );
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async getCompleteUser(req, res) {
        try {
            const auth_header = req.bearer_token;
            const user_id = req.params?.id;
            const user = await StravaServices.getUserById(auth_header, user_id);
            res.send({ data: user, error: false });
        } catch (error) {
            await LogsServices.create(
                'getCompleteUser error strava',
                JSON.stringify(error),
                error
            );
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async getData(req, res) {
        try {
            const auth_header = req.bearer_token;
            const user = await StravaServices.getUserData(auth_header);
            res.send({ data: user, error: false });
        } catch (error) {
            await LogsServices.create(
                'getData error strava',
                JSON.stringify(error),
                error
            );
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async getZones(req, res) {
        try {
            const auth_header = req.bearer_token;
            const user = await StravaServices.getUserZones(auth_header);
            res.send({ data: user, error: false });
        } catch (error) {
            await LogsServices.create(
                'getZones error strava',
                JSON.stringify(error),
                error
            );
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async getTotalStats(req, res) {
        try {
            const auth_header = req.bearer_token;
            const user_id = req.params?.id;
            const user = await StravaServices.getUserStats(
                auth_header,
                user_id
            );
            res.send({ data: user, error: false });
        } catch (error) {
            await LogsServices.create(
                'getTotalStats error strava',
                JSON.stringify(error),
                error
            );
            console.log(error);
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async getActivities(req, res) {
        try {
            const auth_header = req.bearer_token;
            const page_number = req.params?.page;
            const user = await StravaServices.getUserActivities(
                auth_header,
                page_number
            );
            res.send({ data: user, error: false });
        } catch (error) {
            await LogsServices.create(
                'getActivities error strava',
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
        try {
            const auth_header = req.bearer_token;
            const { start_time, end_time, page, per_page } = req.body;
            const { brand_id, _id } = req.user;
            const activitiesList = await StravaServices.listAthleteActivities(
                auth_header,
                start_time,
                end_time,
                page,
                per_page
            );
            const data = activitiesList.filter(
                (item) => item.athlete.id == brand_id
            );
            if (!data[0] || Object.keys(data[0]).length == 0)
                return res.send({
                    error: true,
                    data: 'There was not found any data',
                });
            const dataToSend = {
                user_id: _id,
                title: data[0]?.sport_type,
                date: new Date(data[0]?.start_time).toLocaleString(),
                timestamp: new Date(data[0]?.start_time).getTime(),
                distance: data[0]?.distance,
                total_time: data[0]?.elapsed_time,
                average_heart_rate: data[0]?.average_heartrate,
                max_heart_rate: data[0]?.max_heartrate,
                resting_heart_rate: '',
                average_pace: '',
                calories: `${fromKilojouleToCalories(data[0]?.kilojoules)}`,
                positive_slope: data[0]?.total_elevation_gain,
                negative_slope: '',
                average_speed: data[0]?.average_speed,
                average_cadence: data[0]?.average_cadence,
                training_load: '',
                max_cadence: '',
                min_height: '',
                max_height: '',
                estimated_liquid_loss: '',
                average_temperature: '',
                paces: [],
                triathlonData: [],
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
                'setStats error strava',
                JSON.stringify(error),
                error
            );
            console.log(error);
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async webhookVerify(req, res) {
        try {
            // Your verify token. Should be a random string.
            console.log(req.query)
            const VERIFY_TOKEN = 'delaf2023';
            // Parses the query params
            let mode = req.query['hub.mode'];
            let token = req.query['hub.verify_token'];
            let challenge = req.query['hub.challenge'];
            // Checks if a token and mode is in the query string of the request
            if (mode && token) {
                // Verifies that the mode and token sent are valid
                if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                    // Responds with the challenge token from the request
                    console.log('WEBHOOK_VERIFIED');
                    res.json({ 'hub.challenge': challenge });
                } else {
                    // Responds with '403 Forbidden' if verify tokens do not match
                    res.sendStatus(403);
                }
            }
        } catch (error) {
            await LogsServices.create(
                'webhookVerify error strava',
                JSON.stringify(error),
                error
            );
            console.log(error);
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async webhookData() {
        try {
            console.log('webhook event received!', req.query, req.body);
            res.status(200).send('EVENT_RECEIVED');
        } catch (error) {
            await LogsServices.create(
                'webhookVerify error strava',
                JSON.stringify(error),
                error
            );
            console.log(error);
            res.send({
                error: true,
                data: error,
            });
        }
    }
}

export default StravaController;
