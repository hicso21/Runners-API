import LogsServices from '../../services/v1/Logs/logs.services.js';
import NotificationsServices from '../../services/v1/Notifications/notifications.services.js';
import RoutineNotificationsServices from '../../services/v1/RoutineNotifications/routineNotifications.services.js';

export default async function creatingProcess(user_id) {
    const notificationResponse = await NotificationsServices.create(user_id)
        .then((res) => res)
        .catch((err) => err);

    const routineNotificationResponse =
        await RoutineNotificationsServices.create(user_id)
            .then((res) => res)
            .catch((err) => err);

    if (notificationResponse.error) {
        LogsServices.create(
            'NotificationsServices.create',
            'Error creating the user to analyse whether or not he/she has notifications',
            notificationResponse.data
        );
    }

    if (routineNotificationResponse.error) {
        LogsServices.create(
            'RoutineNotificationsServices.create',
            'Error creating the user to analyse whether or not he/she has notifications',
            routineNotificationResponse.data
        );
    }
}
