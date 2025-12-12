import mongoose from 'mongoose';
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
        // DEFINIR QUERY FUERA DEL TRY PARA EL FALLBACK
        const query = { user_id: user_id };
        const projection = {};

        try {
            const {
                limit = 50,
                offset = 0,
                activityType,
                startDate,
                endDate,
                fields = 'date activity_type timestamp_num distance total_time calories elevation distance average_heart_rate max_heart_rate average_pace training_load positive_slope negative_slope average_speed average_cadence max_cadence',
            } = options;

            // Construir query
            if (startDate) {
                const startTime = new Date(startDate).getTime();
                if (!isNaN(startTime))
                    query.timestamp_num = {
                        ...(query.timestamp_num || {}),
                        $gte: startTime,
                    };
            }

            if (endDate) {
                const endTime = new Date(endDate).getTime();
                if (!isNaN(endTime))
                    query.timestamp_num = {
                        ...(query.timestamp_num || {}),
                        $lte: endTime,
                    };
            }

            if (activityType && activityType !== 'Todos')
                query.activity_type = activityType;

            // Proyección
            if (fields)
                fields.split(' ').forEach((field) => {
                    if (field.trim()) projection[field] = 1;
                });

            // ENFOQUE PRINCIPAL: Mongoose con timeout
            const activities = await Activities.find(query)
                .select(projection)
                .sort({ timestamp_num: -1 })
                .skip(parseInt(offset))
                .limit(parseInt(limit))
                .lean()
                .maxTimeMS(5000);

            console.log(`✅ Query completed: ${activities.length} docs`);
            return activities;
        } catch (error) {
            console.error('❌ Error in getAllWithoutArray:', error.message);
            return [];
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

            const pipeline = [];

            // Match inicial optimizado para usar índices
            const matchStage = {
                user_id: user_id,
                timestamp_num: { $exists: true, $ne: null, $gt: 0 }, // Solo documentos con timestamp_num válido
            };

            if (activityType && activityType !== 'Todos')
                matchStage.activity_type = activityType;

            if (startDate || endDate) {
                matchStage.timestamp_num = {};
                if (startDate)
                    matchStage.timestamp_num.$gte = new Date(
                        startDate
                    ).getTime();

                if (endDate)
                    matchStage.timestamp_num.$lte = new Date(endDate).getTime();
            }

            pipeline.push({ $match: matchStage });

            // Proyección temprana para reducir datos
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
                    average_pace: 1,
                    training_load: 1,
                    positive_slope: 1,
                    negative_slope: 1,
                    average_speed: 1,
                    average_cadence: 1,
                    max_cadence: 1,
                },
            });

            // Convertir timestamp a fecha - método más robusto
            pipeline.push({
                $addFields: {
                    dateObj: {
                        $cond: {
                            if: {
                                $and: [
                                    { $ne: ['$timestamp_num', null] },
                                    { $gt: ['$timestamp_num', 0] },
                                ],
                            },
                            then: { $toDate: '$timestamp_num' },
                            else: { $toDate: new Date() },
                        },
                    },
                },
            });

            // Determinar groupId
            let groupId;
            const groupConfig = {
                day: '%Y-%m-%d',
                week: '%Y-%U',
                month: '%Y-%m',
            };

            groupId = {
                $dateToString: {
                    format: groupConfig[groupBy] || '%Y-%m-%d',
                    date: '$dateObj',
                },
            };

            // Helper para convertir campos numéricos de forma segura
            const safeConvert = (field) => ({
                $cond: {
                    if: {
                        $or: [
                            { $eq: [{ $type: field }, 'array'] },
                            { $eq: [field, ''] },
                            { $eq: [field, null] },
                            { $eq: [{ $type: field }, 'missing'] },
                        ],
                    },
                    then: 0,
                    else: {
                        $convert: {
                            input: field,
                            to: 'double',
                            onError: 0,
                            onNull: 0,
                        },
                    },
                },
            });

            // Group optimizado
            pipeline.push({
                $group: {
                    _id: groupId,
                    total_time: { $avg: safeConvert('$total_time') },
                    average_heart_rate: {
                        $avg: safeConvert('$average_heart_rate'),
                    },
                    max_heart_rate: { $max: safeConvert('$max_heart_rate') },
                    distance: { $sum: safeConvert('$distance') },
                    calories: { $sum: safeConvert('$calories') },
                    elevation: { $sum: safeConvert('$elevation') },
                    average_pace: { $avg: safeConvert('$average_pace') },
                    training_load: { $sum: safeConvert('$training_load') },
                    positive_slope: { $sum: safeConvert('$positive_slope') },
                    negative_slope: { $sum: safeConvert('$negative_slope') },
                    average_speed: { $avg: safeConvert('$average_speed') },
                    average_cadence: { $avg: safeConvert('$average_cadence') },
                    max_cadence: { $max: safeConvert('$max_cadence') },
                    count: { $sum: 1 },
                    start_date: { $min: '$dateObj' },
                    end_date: { $max: '$dateObj' },
                },
            });

            pipeline.push({ $sort: { _id: 1 } });

            // Ejecutar agregación SIN .allowDiskUse() y .maxTimeMS()
            const aggregatedData = await Activities.aggregate(pipeline)
                .option({
                    maxTimeMS: 20000,
                })
                .exec();
            return aggregatedData;
        } catch (error) {
            console.error('Error en getAggregatedStats:', error);
            return {
                error: true,
                data: error.message,
            };
        }
    }

    static async getZones(user_id, options = {}) {
        try {
            const {
                limit = 365,
                offset = 0,
                activityType,
                startDate,
                endDate,
            } = options;

            // Construir query
            const query = {
                user_id,
                zones: { $exists: true, $ne: null }, // Solo actividades con zones
            };

            if (startDate) {
                const startTime = new Date(startDate).getTime();
                if (!isNaN(startTime)) {
                    query.timestamp_num = {
                        ...(query.timestamp_num || {}),
                        $gte: startTime,
                    };
                }
            }

            if (endDate) {
                const endTime = new Date(endDate).getTime();
                if (!isNaN(endTime)) {
                    query.timestamp_num = {
                        ...(query.timestamp_num || {}),
                        $lte: endTime,
                    };
                }
            }

            if (activityType && activityType !== 'Todos') {
                query.activity_type = activityType;
            }

            console.log('🔍 Zones Query:', JSON.stringify(query));

            // Ejecutar query - solo traer zones, date y total_time
            const activities = await Activities.find(query)
                .select('zones date timestamp_num activity_type')
                .sort({ timestamp_num: -1 })
                .skip(parseInt(offset))
                .limit(parseInt(limit))
                .lean()
                .maxTimeMS(15000);

            console.log(`✅ Zones query completed: ${activities.length} docs`);

            // Retornar en formato optimizado
            return activities.map((activity) => ({
                zones: activity.zones,
                date: activity.date,
                total_time: activity.total_time,
                activity_type: activity.activity_type,
            }));
        } catch (error) {
            console.error('❌ Error in getZones:', error.message);
            console.error('Stack:', error.stack);
            return [];
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
            // Si actualizas timestamp, actualiza también timestamp_num
            if (body.timestamp && !body.timestamp_num) {
                body.timestamp_num = parseInt(body.timestamp);
            }

            const activities = await Activities.findByIdAndUpdate(
                activity_id,
                { $set: body },
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
            if (body.timestamp && !body.timestamp_num) {
                body.timestamp_num = parseInt(body.timestamp);
            }
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
