import NotificationsServices from '../../../services/v1/Notifications/notifications.services.js';

class NotificationsController {
    static async findOrCreate(req, res) {
        const user_id = req.params.user_id;
        try {
            const existingItem = await NotificationsServices.findByIdUserId(
                user_id
            );

            if (existingItem)
                return res.send({
                    error: false,
                    data: existingItem,
                });

            const newItem = await NotificationsServices.create(user_id);
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
            const notifications = await NotificationsServices.get();
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
            const notifications = await NotificationsServices.setToTrue(
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
            const notifications = await NotificationsServices.setToFalse(
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

export default NotificationsController;
