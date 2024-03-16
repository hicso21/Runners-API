import { Schema, model } from 'mongoose';

const activitiesSchema = new Schema({
	user_id: String,
	title: String,
	date: String,
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
	paces: Array,
	triathlonData: Array,
	description: String,
});

const Activities = model('Activitie', activitiesSchema);

export default Activities;
