import axios from 'axios';
import fetchPolar from '../../../utils/fetches/fetchPolarAPI.js';

class PolarServices {
    static async token(body, headers) {
        try {
            console.log('headers', headers);
            console.log('body', body);
            const { data } = await axios.post(
                'https://polarremote.com/v2/oauth2/token',
                body,
                { headers }
            );
            return data;
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async register(x_user_id, token_type, access_token) {
        try {
            const { data } = await axios.post(
                'https://www.polaraccesslink.com/v3/users',
                JSON.stringify({ 'member-id': x_user_id }),
                {
                    headers: {
                        'Content-Type': 'application/xml',
                        Accept: 'application/json',
                        Authorization: `${token_type} ${access_token}`,
                    },
                }
            );
            return data;
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async getUser(userId) {
        try {
            const { data } = await fetchPolar.get(`/v3/users/${userId}`);
            return data;
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async pullNotifications() {
        try {
            const { data } = await fetchPolar.get('/v3/notifications');
            return data;
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    /* Daily Activity*/

    static async postActivityTransactions(id, headers) {
        try {
            const { data } = await fetchPolar({
                url: `/v3/users/${id}/activity-transactions`,
                method: 'POST',
                headers,
            });
            return data;
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async putActivityTransactions(id, transaction, headers) {
        try {
            await fetchPolar({
                url: `/v3/users/${id}/activity-transactions/${transaction['transaction-id']}`,
                method: 'PUT',
                headers,
            });
        } catch (error) {
            return {
                error: true,
                data: false,
            };
        }
    }

    static async listActivities(id, transaction, headers) {
        try {
            const { data } = await fetchPolar({
                url: `/v3/users/${id}/activity-transactions/${transaction['transaction-id']}`,
                method: 'GET',
                headers,
            });
            return data;
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async listOfActivities(activityUrl) {
        try {
            const { data: activitySummary } = await fetchPolar.get(activityUrl);
            const { data: stepSamples } = await fetchPolar.get(
                `${activityUrl}/step-samples`
            );
            return { ...activitySummary, ...stepSamples };
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    /* Training Data */

    static async postTrainingData(id, headers) {
        try {
            const { data } = await fetchPolar({
                url: `/v3/users/${id}/exercise-transactions`,
                method: 'POST',
                headers,
            });
            return data;
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async putTrainingData(id, transaction, headers) {
        try {
            await fetchPolar({
                url: `/v3/users/${id}/exercise-transactions/${transaction['transaction-id']}`,
                method: 'PUT',
                headers,
            });
        } catch (error) {
            return {
                error: true,
                data: false,
            };
        }
    }

    static async listExercises(id, transaction, headers) {
        try {
            const { data } = await fetchPolar({
                url: `/v3/users/${id}/exercise-transactions/${transaction['transaction-id']}`,
                method: 'GET',
                headers,
            });
            return data;
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async getExercise(activityUrl, headers) {
        try {
            const { data } = await axios.get(activityUrl, headers);
            return data;
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }
}

export default PolarServices;
