import PushNotificationsServices from '../../../services/v1/PushNotifications/pushNotifications.services.js';

export default class PushNotificationsControllers {
    static async createNotificationToken(req, res) {
        const { token, user_id } = req.body;

        if (!user_id || !push_token) {
            return res
                .status(400)
                .send({ msg: 'Se requieren user_id y push_token', data: null });
        }

        const alreadyExist = await PushNotificationsServices.getByToken(token);
        if (alreadyExist)
            return res.send({
                msg: 'The token already exist',
                data: null,
            });
        const createdToken = await PushNotificationsServices.setToken(
            token,
            user_id
        );
        res.send({ msg: 'Token created successfully', data: createdToken });
    }

    static async getTokenByUserId(req, res) {
        const { user_id } = req.params;

        if (!user_id) {
            return res
                .status(400)
                .send({ msg: 'Se requieren user_id y push_token', data: null });
        }

        const userToken = await PushNotificationsServices.getByUserId(user_id);
        if (!userToken)
            return res.send({
                msg: "The token doesn't exist",
                data: null,
            });
        res.send({
            msg: 'Request completed successfully',
            data: userToken,
        });
    }
}
