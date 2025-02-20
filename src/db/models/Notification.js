import { Schema, model } from 'mongoose';

const notificationSchema = new Schema({
    user_id: String,
    notification: Boolean,
    updatedDate: Date
});

const Notifications = model('Notification', notificationSchema);

export default Notifications;
