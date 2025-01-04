import mainUrl from '../../../utils/constants/mainUrl.js';
import fetchSuunto from '../../../utils/fetches/fetchSuuntoAPI.js';
import config from '../../../config/suuntoData.js';
import LogsServices from '../Logs/logs.services.js';
import axios from 'axios';

class SuuntoServices {
    static async getAuthorizeUrl(id) {
        try {
            const redirect_uri = `${mainUrl}/api/v1/suunto/exchange_token?db_id=${id}`;
            const uri =
                'https://cloudapi-oauth.suunto.com/oauth/authorize?' +
                `response_type=${config.response_type}` +
                '&' +
                `client_id=${process.env.suunto_client_id}` +
                '&' +
                `redirect_uri=${redirect_uri}`;
            return uri;
        } catch (error) {
            await LogsServices.create(
                'getAuthorizeUrl error suunto',
                JSON.stringify(error),
                error
            );
            return { error: true, data: error };
        }
    }

    static async token(redirect_uri, code) {
        console.log('redirect_uri', redirect_uri);
        console.log('code', code);
        const data = `${process.env.suunto_client_id}:${process.env.suunto_client_secret}`;
        const encodedString = Buffer.from(data).toString('base64');
        console.log('encodedString => ', data);
        console.log('encodedString => ', encodedString);
        try {
            const res = await fetchSuunto.post(
                '/oauth/token',
                {
                    grant_type: 'authorization_code',
                    redirect_uri,
                    code,
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: `Basic ${encodedString}`,
                    },
                }
            );
            return res.data;
        } catch (error) {
            await LogsServices.create(
                'token error suunto',
                JSON.stringify(error),
                error
            );
            return { error: true, data: error };
        }
    }

    static async dailyActivity(from, to, auth) {
        try {
            const response = await fetchSuunto.get(
                `/247samples/activity?from=${from}&to=${to}`,
                {
                    headers: {
                        Authorization: auth,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response;
        } catch (error) {
            await LogsServices.create(
                'dailyActivity error suunto',
                JSON.stringify(error),
                error
            );
            return { error: true, data: error };
        }
    }

    static async activityStatistics(startdate, enddate, auth) {
        try {
            const response = await fetchSuunto.get(
                `/247samples/daily-activity-statistics?startdate=${startdate}&enddate=${enddate}`,
                {
                    headers: {
                        Authorization: auth,
                    },
                }
            );
            return response;
        } catch (error) {
            await LogsServices.create(
                'activityStatistics error suunto',
                JSON.stringify(error),
                error
            );
            return { error: true, data: error };
        }
    }

    static async sleepData(from, to, auth) {
        try {
            const response = await fetchSuunto.get(
                `/247samples/sleep?from=${from}&to=${to}`,
                {
                    headers: {
                        Authorization: auth,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response;
        } catch (error) {
            await LogsServices.create(
                'sleepData error suunto',
                JSON.stringify(error),
                error
            );
            return { error: true, data: error };
        }
    }

    static async getWorkoutById(workoutid, refresh_runner_token) {
        try {
            const extensions =
                'CadenceStreamExtension,' +
                'HeartrateStreamExtension,' +
                'SpeedStreamExtension,' +
                'AltitudeStreamExtension,' +
                'IntensityExtension,' +
                'LocationStreamExtension';
            const { data } = await axios.get(
                `https://cloudapi.suunto.com/v3/workouts/${workoutid}?extensions=${extensions}`,
                {
                    headers: {
                        Authorization: refresh_runner_token,
                        'Cache-Control': 'no-cache',
                        'Ocp-Apim-Subscription-Key':
                            process.env.suunto_primary_key,
                    },
                }
            );
            return data;
        } catch (error) {
            await LogsServices.create(
                'getWorkoutById error suunto',
                JSON.stringify(error),
                error
            );
            return { error: true, data: error };
        }
    }

    static async getWorkoutsList(from, to, auth) {
        try {
            const { data } = await fetchSuunto.get(
                `/v2/workouts?since=${from}&until=${to}`,
                {
                    headers: {
                        Authorization: auth,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return data;
        } catch (error) {
            await LogsServices.create(
                'getWorkoutsList error suunto',
                JSON.stringify(error),
                error
            );
            return { error: true, data: error };
        }
    }
}

export default SuuntoServices;
