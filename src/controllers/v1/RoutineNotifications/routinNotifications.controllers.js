import RoutineNotificationsServices from '../../../services/v1/RoutineNotifications/routineNotifications.services';

class RoutineNotificationsController {
    static async findOrCreate(req, res) {
        const user_id = req.params.user_id;
        try {
            const existingItem =
                await RoutineNotificationsServices.findByIdUserId(user_id);

            if (existingItem)
                return res.send({
                    error: false,
                    data: existingItem,
                });

            const newItem = await RoutineNotificationsServices.create(user_id);
            res.send({
                error: false,
                data: newItem,
            });
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async getAll(req, res) {
        try {
            const notifications = await RoutineNotificationsServices.get();
            res.send({
                error: false,
                data: notifications,
            });
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async addNotification(req, res) {
        const user_id = req.params.user_id;
        try {
            const notifications = await RoutineNotificationsServices.setToTrue(
                user_id
            );
            res.send({
                error: false,
                data: notifications,
            });
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }

    static async eraseNotification(req, res) {
        const user_id = req.params.user_id;
        try {
            const notifications = await RoutineNotificationsServices.setToFalse(
                user_id
            );
            res.send({
                error: false,
                data: notifications,
            });
        } catch (error) {
            res.send({
                error: true,
                data: error,
            });
        }
    }
}

export default RoutineNotificationsController;
