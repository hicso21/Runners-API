import { Schema, model } from 'mongoose';

const notificationSchema = new Schema({
    user_id: String,
    token: String,
});

const PushNotifications = model('PushNotification', notificationSchema);

export default PushNotifications;
