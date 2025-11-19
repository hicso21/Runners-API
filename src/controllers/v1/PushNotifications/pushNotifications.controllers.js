import PushNotificationsServices from '../../../services/v1/PushNotifications/pushNotifications.services.js';

export default class PushNotificationsControllers {
    static async createNotificationToken(req, res) {
        try {
            const { user_id, token } = req.body;

            if (!user_id || !token) {
                return res.status(400).send({
                    msg: 'Se requieren user_id y token',
                    data: null,
                });
            }

            // Verificar si el token ya existe
            const alreadyExist = await PushNotificationsServices.getByToken(
                token
            );

            if (alreadyExist) {
                return res.status(200).send({
                    msg: 'El token ya existe',
                    data: alreadyExist,
                });
            }

            // Crear el token
            const createdToken = await PushNotificationsServices.setToken(
                token,
                user_id
            );

            if (!createdToken) {
                return res.status(500).send({
                    msg: 'Error al crear el token',
                    data: null,
                });
            }

            return res.status(201).send({
                msg: 'Token creado exitosamente',
                data: createdToken,
            });
        } catch (error) {
            console.error('Error en createNotificationToken:', error);
            return res.status(500).send({
                msg: 'Error del servidor al procesar el token',
                data: null,
                error: error.message,
            });
        }
    }

    static async getTokenByUserId(req, res) {
        try {
            const { user_id } = req.params;

            if (!user_id) {
                return res.status(400).send({
                    msg: 'Se requiere user_id',
                    data: null,
                });
            }

            const userToken = await PushNotificationsServices.getByUserId(
                user_id
            );

            if (!userToken) {
                return res.status(404).send({
                    msg: 'El token no existe',
                    data: null,
                });
            }

            return res.status(200).send({
                msg: 'Solicitud completada exitosamente',
                data: userToken,
            });
        } catch (error) {
            console.error('Error en getTokenByUserId:', error);
            return res.status(500).send({
                msg: 'Error del servidor al obtener el token',
                data: null,
                error: error.message,
            });
        }
    }
}
