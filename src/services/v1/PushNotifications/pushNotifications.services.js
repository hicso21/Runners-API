import PushNotifications from '../../../db/models/PushNotifications.js';

export default class PushNotificationsServices {
    static async getByToken(token) {
        const notification = await PushNotifications.findOne({ token });
        return notification;
    }

    static async getByUserId(user_id) {
        const notification = await PushNotifications.findOne({ user_id });
        return notification;
    }

    static async setToken(token, user_id) {
        const notification = await PushNotifications.create({ token, user_id });
        return notification;
    }
}
