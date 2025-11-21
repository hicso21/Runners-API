import { Schema, model } from 'mongoose';

const activitiesSchema = new Schema(
    {
        user_id: { type: String, index: true },
        activity_type: { type: String, index: true },
        timestamp_num: { type: Number, index: true },
        title: String,
        date: String,
        activity_type: String,
        timestamp: String,
        distance: Number,
        total_time: Number,
        average_heart_rate: Number,
        max_heart_rate: Number,
        resting_heart_rate: String,
        average_pace: String,
        calories: Number,
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
    },
    {
        timestamps: false,
        autoIndex: true,
    }
);

const Activities = model('Activitie', activitiesSchema);

export default Activities;
