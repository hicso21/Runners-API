import { Schema, model } from 'mongoose';

const activitiesSchema = new Schema({
    user_id: String,
    activity_id: String,
    title: String,
    date: String,
    activity_type: String,
    timestamp: String,
    distance: String,
    total_time: String,
    average_heart_rate: String,
    max_heart_rate: String,
    resting_heart_rate: String,
    average_pace: String,
    calories: String,
    training_load: String,
    positive_slope: String,
    negative_slope: String,
    average_speed: String,
    average_cadence: String,
    max_cadence: String,
    min_height: String,
    max_height: String,
    estimated_liquid_loss: String,
    average_temperature: String,
    rate: Array,
    heart_rates: Array,
    zones: Array,
    time_in_zones: Array,
    route: Array,
    speeds: Array,
    elevation: Array,
    paces: Array,
    triathlon_data: Array,
    description: String,
});

activitiesSchema.index({ user_id: 1, date: -1 }, { name: 'user_date_idx' });
activitiesSchema.index(
    { user_id: 1, activity_type: 1, date: -1 },
    { name: 'user_type_date_idx' }
);
activitiesSchema.index(
    { user_id: 1, date: -1, activity_type: 1 },
    { name: 'user_date_type_idx' }
);

activitiesSchema.set('autoIndex', process.env.NODE_ENV !== 'production');

const Activities = model('Activitie', activitiesSchema);

export default Activities;
