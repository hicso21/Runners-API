import Activities from '../../../db/models/Activities.js';

class ActivitiesServices {
    static async getAll(user_id) {
        try {
            const activities = await Activities.find({ user_id })
                .lean()
                .sort({ timestamp: -1 });
            return activities;
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async getAllWithoutArray(user_id, options = {}) {
        try {
            const {
                limit,
                offset = 0,
                activityType,
                startDate,
                endDate,
                fields = 'elevation distance average_heart_rate max_heart_rate average_pace calories training_load positive_slope negative_slope average_speed average_cadence max_cadence total_time zones date activity_type',
            } = options;

            const query = { user_id };

            if (activityType && activityType !== 'Todos')
                query.activity_type = activityType;

            if (startDate || endDate) {
                query.timestamp = {};
                if (startDate)
                    query.timestamp.$gte = new Date(startDate).getTime();
                if (endDate) query.timestamp.$lte = new Date(endDate).getTime();
            }

            console.log(query);

            let queryBuilder = Activities.find(query)
                .select(fields)
                .sort({ timestamp: -1 })
                .lean();

            if (limit) queryBuilder = queryBuilder.limit(parseInt(limit));
            if (offset) queryBuilder = queryBuilder.skip(parseInt(offset));

            const activities = await queryBuilder;

            return activities;
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async getAggregatedStats(user_id, options = {}) {
        try {
            const {
                groupBy = 'week', // 'day', 'week', 'month'
                activityType,
                startDate,
                endDate,
            } = options;

            const matchStage = { user_id };

            if (activityType && activityType !== 'Todos')
                matchStage.activity_type = activityType;

            if (startDate || endDate) {
                matchStage.timestamp = {};
                if (startDate)
                    matchStage.timestamp.$gte = new Date(startDate).getTime();
                if (endDate)
                    matchStage.timestamp.$lte = new Date(endDate).getTime();
            }

            let dateFormat;
            switch (groupBy) {
                case 'day':
                    dateFormat = '%Y-%m-%d';
                    break;
                case 'week':
                    dateFormat = '%Y-W%U';
                    break;
                case 'month':
                    dateFormat = '%Y-%m';
                    break;
                default:
                    dateFormat = '%Y-%m-%d';
            }

            const aggregatedData = await Activities.aggregate([
                { $match: matchStage },
                { $sort: { timestamp: 1 } },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: dateFormat,
                                date: '$date',
                            },
                        },
                        total_time: { $avg: '$total_time' },
                        average_heart_rate: { $avg: '$average_heart_rate' },
                        max_heart_rate: { $max: '$max_heart_rate' },
                        distance: { $sum: '$distance' },
                        calories: { $sum: '$calories' },
                        elevation: { $sum: '$elevation' },
                        zones: { $push: '$zones' },
                        count: { $sum: 1 },
                        date: { $first: '$date' },
                    },
                },
                { $sort: { _id: 1 } },
            ]);

            return aggregatedData;
        } catch (error) {
            return {
                error: true,
                data: error,
            };
        }
    }

    static async getById(_id) {
        try {
            const activities = await Activities.findOne({ _id }).lean();
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
            const activities = await Activities.findOne({ activity_id }).lean();
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
            ).lean();
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
            const deletedActivity = await Activities.findOneAndDelete({
                user_id,
                date,
            }).lean();
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
