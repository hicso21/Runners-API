import PushNotifications from '../../../db/models/PushNotifications.js';

export default class PushNotificationsServices {
    static async getByToken(token) {
        try {
            const notification = await PushNotifications.findOne({
                token,
            }).lean();
            return notification;
        } catch (error) {
            console.error('Error en getByToken:', error);
            throw error;
        }
    }

    static async getByUserId(user_id) {
        try {
            const notification = await PushNotifications.findOne({
                user_id,
            }).lean();
            return notification;
        } catch (error) {
            console.error('Error en getByUserId:', error);
            throw error;
        }
    }

    static async setToken(token, user_id) {
        try {
            const notification = await PushNotifications.findOneAndUpdate(
                { user_id },
                { token, user_id },
                { new: true, upsert: true }
            ).lean();
            return notification;
        } catch (error) {
            console.error('Error en setToken:', error);
            throw error;
        }
    }

    static async deleteToken(token) {
        try {
            const deleted = await PushNotifications.findOneAndDelete({
                token,
            }).lean();
            return deleted;
        } catch (error) {
            console.error('Error en deleteToken:', error);
            throw error;
        }
    }
}
