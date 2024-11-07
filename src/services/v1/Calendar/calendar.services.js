import Calendar from '../../../db/models/Calendar.js';

class CalendarServices {
    static async create(events) {
        try {
            const data = await Calendar.create(events);
            return data;
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async deleteEvents(events) {
        try {
            await Calendar.deleteMany({ _id: { $in: events } });
            return {
                error: false,
            };
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async findOneDayEvents(user_id) {
        try {
            const data = await Calendar.find({
                completed: false,
                user_id,
            });
            return data;
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async getLastByActivityType(activityType, user_id) {
        try {
            const today = new Date().setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const lastItems = await Calendar.find({
                activityType,
                user_id,
                start: {
                    $lt: tomorrow,
                },
                completed: false,
            })
                .lean()
                .exec();
            return {
                error: false,
                data: lastItems.sort((a, b) => b.start - a.start),
            };
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async completeActivity(routine_id, activity_id) {
        const activityId = activity_id || ''
        try {
            const updatedActivity = await Calendar.findByIdAndUpdate(
                routine_id,
                { $set: { completed: true, activityId } },
                { new: true }
            );
            return {
                error: false,
                data: updatedActivity,
            };
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }
}

export default CalendarServices;
