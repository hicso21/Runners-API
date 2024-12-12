import Activities from '../../../db/models/Activities.js';

class ActivitiesServices {
    static async getAll(user_id) {
        try {
            const activities = await Activities.find({ user_id });
            return activities;
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async getById(_id) {
        try {
            const activities = await Activities.findOne({ _id });
            return activities;
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async getByBrandActivityId(activity_id) {
        try {
            const activities = await Activities.findOne({ activity_id });
            return {
                error: false,
                data: activities,
            };
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async updateActivity(activity_id, body) {
        try {
            const activities = await Activities.findByIdAndUpdate(
                activity_id,
                {
                    $set: body,
                },
                { new: true }
            );
            return {
                error: false,
                data: activities,
            };
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async createActivity(body) {
        try {
            const activity = await Activities.create(body);
            return activity;
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async eraseActivity(user_id, date) {
        try {
            const activity = await Activities.findOne({ user_id, date });
            const deletedActivity = await Activities.findByIdAndDelete(
                activity._id
            );
            return deletedActivity;
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }
}

export default ActivitiesServices;
