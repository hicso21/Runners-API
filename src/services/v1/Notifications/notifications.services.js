import Notifications from '../../../db/models/Notification.js';

export default class NotificationsServices {
    static async create(user_id) {
        try {
            return await Notifications.create({
                user_id,
                notification: true,
                updatedDate: Date.now(),
            });
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async get() {
        try {
            return await Notifications.find({});
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async findByIdUserId(user_id) {
        try {
            return await Notifications.findOne({ user_id });
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async setToTrue(user_id) {
        try {
            return await Notifications.findOneAndUpdate(
                { user_id },
                {
                    $set: {
                        notification: true,
                        updatedDate: Date.now(),
                    },
                }
            );
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async setToFalse(user_id) {
        try {
            return await Notifications.findOneAndUpdate(
                { user_id },
                { $set: { notification: false, updatedDate: Date.now() } }
            );
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }
}
