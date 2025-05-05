import { Schema, model } from 'mongoose';

const routineNotificationSchema = new Schema({
    user_id: String,
    notification: Boolean,
    updatedDate: Date
});

const RoutineNotifications = model('routine_notification', routineNotificationSchema);

export default RoutineNotifications;
