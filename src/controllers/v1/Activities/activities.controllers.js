import ActivitiesServices from '../../../services/v1/Activities/activities.services.js';

class ActivitiesControllers {
    static async getAll(req, res) {
        const { user_id } = req.params;
        try {
            const activities = await ActivitiesServices.getAll(user_id);

            res.json(activities);
        } catch (error) {
            res.status(500).json({
                error: true,
                data: error.message,
            });
        }
    }

    static async getAllWithoutArray(req, res) {
        const { user_id } = req.params;
        const { limit, offset, activityType, startDate, endDate, fields } =
            req.query;

        try {
            const activities = await ActivitiesServices.getAllWithoutArray(
                user_id,
                {
                    limit,
                    offset,
                    activityType,
                    startDate,
                    endDate,
                    fields,
                }
            );

            res.set({
                'Cache-Control': 'private, max-age=120',
                ETag: `W/"${user_id}-${Date.now()}"`,
            });

            res.json(activities);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: true,
                data: error,
            });
        }
    }

    static async getAggregated(req, res) {
        const { user_id } = req.params;
        const { groupBy, activityType, startDate, endDate } = req.query;

        try {
            const aggregatedData = await ActivitiesServices.getAggregatedStats(
                user_id,
                {
                    groupBy,
                    activityType,
                    startDate,
                    endDate,
                }
            );

            res.set({ 'Cache-Control': 'private, max-age=300' });

            res.json(aggregatedData);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: true,
                data: error.message,
            });
        }
    }

    static async getZones(req, res) {
        const { user_id } = req.params;
        const { limit, offset, activityType, startDate, endDate } = req.query;

        try {
            const zones = await ActivitiesServices.getZones(user_id, {
                limit,
                offset,
                activityType,
                startDate,
                endDate,
            });

            // Agregar headers para caché
            res.set({
                'Cache-Control': 'private, max-age=120', // 2 minutos
            });

            res.json(zones);
        } catch (error) {
            res.status(500).json({
                error: true,
                data: error.message,
            });
        }
    }

    static async getById(req, res) {
        const activity_id = req.params.activity_id;
        try {
            const activities = await ActivitiesServices.getById(activity_id);
            res.json(activities);
        } catch (error) {
            res.status(500).json({
                error: true,
                data: error.message,
            });
        }
    }

    static async postActivity(req, res) {
        const body = req.body;
        try {
            const newActivity = await ActivitiesServices.createActivity(body);
            res.status(201).json(newActivity);
        } catch (error) {
            res.status(500).json({
                error: true,
                data: error.message,
            });
        }
    }

    static async deleteActivity(req, res) {
        const { user_id, date } = req.body;
        try {
            const deletedActivity = await ActivitiesServices.eraseActivity(
                user_id,
                date
            );
            res.json(deletedActivity);
        } catch (error) {
            res.status(500).json({
                error: true,
                data: error.message,
            });
        }
    }
}

export default ActivitiesControllers;
