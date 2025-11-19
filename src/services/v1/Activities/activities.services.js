import Activities from '../../../db/models/Activities.js';

class ActivitiesServices {
    static async getAll(user_id) {
        try {
            const activities = await Activities.find({ user_id })
                .lean()
                .sort({ timestamp_num: -1 });
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
                fields = 'elevation distance average_heart_rate max_heart_rate average_pace calories training_load positive_slope negative_slope average_speed average_cadence max_cadence total_time zones date activity_type timestamp timestamp_num',
            } = options;

            // Construir query simple que USA ÍNDICES
            const query = { user_id };

            // Filtro por tipo de actividad
            if (activityType && activityType !== 'Todos') {
                query.activity_type = activityType;
            }

            // Filtro por timestamp_num (campo numérico indexado)
            if (startDate || endDate) {
                query.timestamp_num = {};

                if (startDate) {
                    query.timestamp_num.$gte = new Date(startDate).getTime();
                }

                if (endDate) {
                    query.timestamp_num.$lte = new Date(endDate).getTime();
                }
            }

            // Query optimizada que USA ÍNDICES
            let queryBuilder = Activities.find(query)
                .select(fields)
                .sort({ timestamp_num: -1 })
                .lean();

            if (limit) {
                queryBuilder = queryBuilder.limit(parseInt(limit));
            }

            if (offset) {
                queryBuilder = queryBuilder.skip(parseInt(offset));
            }

            const activities = await queryBuilder;
            return activities;
        } catch (error) {
            console.error('Error en getAllWithoutArray:', error);
            return {
                error: true,
                data: error.message,
            };
        }
    }

    static async getAggregatedStats(user_id, options = {}) {
        try {
            const {
                groupBy = 'week',
                activityType,
                startDate,
                endDate,
            } = options;

            // Pipeline optimizado que USA ÍNDICES
            const pipeline = [
                // Match con índice
                {
                    $match: { user_id },
                },
            ];

            // Construir match adicional con timestamp_num
            const additionalMatch = {};

            if (activityType && activityType !== 'Todos') {
                additionalMatch.activity_type = activityType;
            }

            if (startDate || endDate) {
                additionalMatch.timestamp_num = {};
                if (startDate) {
                    additionalMatch.timestamp_num.$gte = new Date(
                        startDate
                    ).getTime();
                }
                if (endDate) {
                    additionalMatch.timestamp_num.$lte = new Date(
                        endDate
                    ).getTime();
                }
            }

            if (Object.keys(additionalMatch).length > 0) {
                pipeline.push({ $match: additionalMatch });
            }

            // Proyectar solo campos necesarios
            pipeline.push({
                $project: {
                    timestamp_num: 1,
                    activity_type: 1,
                    total_time: 1,
                    average_heart_rate: 1,
                    max_heart_rate: 1,
                    distance: 1,
                    calories: 1,
                    elevation: 1,
                    zones: 1,
                },
            });

            // Convertir timestamp a fecha
            pipeline.push({
                $addFields: {
                    dateObj: { $toDate: '$timestamp_num' },
                },
            });

            // Formato de agrupación
            let groupId;
            switch (groupBy) {
                case 'day':
                    groupId = {
                        $dateToString: { format: '%Y-%m-%d', date: '$dateObj' },
                    };
                    break;
                case 'week':
                    groupId = {
                        $dateToString: { format: '%Y-W%U', date: '$dateObj' },
                    };
                    break;
                case 'month':
                    groupId = {
                        $dateToString: { format: '%Y-%m', date: '$dateObj' },
                    };
                    break;
                default:
                    groupId = {
                        $dateToString: { format: '%Y-%m-%d', date: '$dateObj' },
                    };
            }

            // Ordenar antes de agrupar
            pipeline.push({ $sort: { timestamp_num: 1 } });

            // Convertir campos a números de forma segura
            pipeline.push({
                $addFields: {
                    total_time_num: {
                        $cond: {
                            if: {
                                $or: [
                                    {
                                        $eq: [
                                            { $type: '$total_time' },
                                            'array',
                                        ],
                                    },
                                    { $eq: ['$total_time', ''] },
                                    { $eq: ['$total_time', null] },
                                ],
                            },
                            then: 0,
                            else: { $toDouble: '$total_time' },
                        },
                    },
                    average_heart_rate_num: {
                        $cond: {
                            if: {
                                $or: [
                                    {
                                        $eq: [
                                            { $type: '$average_heart_rate' },
                                            'array',
                                        ],
                                    },
                                    { $eq: ['$average_heart_rate', ''] },
                                    { $eq: ['$average_heart_rate', null] },
                                ],
                            },
                            then: 0,
                            else: { $toDouble: '$average_heart_rate' },
                        },
                    },
                    max_heart_rate_num: {
                        $cond: {
                            if: {
                                $or: [
                                    {
                                        $eq: [
                                            { $type: '$max_heart_rate' },
                                            'array',
                                        ],
                                    },
                                    { $eq: ['$max_heart_rate', ''] },
                                    { $eq: ['$max_heart_rate', null] },
                                ],
                            },
                            then: 0,
                            else: { $toDouble: '$max_heart_rate' },
                        },
                    },
                    distance_num: {
                        $cond: {
                            if: {
                                $or: [
                                    { $eq: [{ $type: '$distance' }, 'array'] },
                                    { $eq: ['$distance', ''] },
                                    { $eq: ['$distance', null] },
                                ],
                            },
                            then: 0,
                            else: { $toDouble: '$distance' },
                        },
                    },
                    calories_num: {
                        $cond: {
                            if: {
                                $or: [
                                    { $eq: [{ $type: '$calories' }, 'array'] },
                                    { $eq: ['$calories', ''] },
                                    { $eq: ['$calories', null] },
                                ],
                            },
                            then: 0,
                            else: { $toDouble: '$calories' },
                        },
                    },
                    elevation_num: {
                        $cond: {
                            if: {
                                $or: [
                                    { $eq: [{ $type: '$elevation' }, 'array'] },
                                    { $eq: ['$elevation', ''] },
                                    { $eq: ['$elevation', null] },
                                ],
                            },
                            then: 0,
                            else: { $toDouble: '$elevation' },
                        },
                    },
                },
            });

            // Agrupar
            pipeline.push({
                $group: {
                    _id: groupId,
                    total_time: { $avg: '$total_time_num' },
                    average_heart_rate: { $avg: '$average_heart_rate_num' },
                    max_heart_rate: { $max: '$max_heart_rate_num' },
                    distance: { $sum: '$distance_num' },
                    calories: { $sum: '$calories_num' },
                    elevation: { $sum: '$elevation_num' },
                    zones: { $push: '$zones' },
                    count: { $sum: 1 },
                    date: { $first: '$dateObj' },
                },
            });

            // Ordenar resultado
            pipeline.push({ $sort: { _id: 1 } });

            const aggregatedData = await Activities.aggregate(pipeline);
            return aggregatedData;
        } catch (error) {
            console.error('Error en getAggregatedStats:', error);
            return {
                error: true,
                data: error.message,
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
            // Agregar timestamp_num al crear
            if (body.timestamp && !body.timestamp_num)
                body.timestamp_num = parseInt(body.timestamp);

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
