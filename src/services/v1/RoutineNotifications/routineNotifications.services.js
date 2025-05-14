import RoutineNotifications from '../../../db/models/RoutineNotifications.js';

export default class RoutineNotificationsServices {
    static async create(user_id) {
        try {
            return await RoutineNotifications.create({
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
            return await RoutineNotifications.find({});
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async findByIdUserId(user_id) {
        try {
            return await RoutineNotifications.findOne({ user_id });
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async setToTrue(user_id) {
        try {
            return await RoutineNotifications.findOneAndUpdate(
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
            return await RoutineNotifications.findOneAndUpdate(
                { user_id },
                { $set: { notification: false } }
            );
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }
}
