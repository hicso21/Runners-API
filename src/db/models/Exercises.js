import { Schema, model } from 'mongoose';

const exercisesSchema = new Schema({
	name: String /* running, functional, bike, elliptical, others */,
	type: String,
	category: String /* lightly_demanded, slow, comfortable, demanded */,
	measure: String,
	duration: Number,
	measurement_unit: String,
	comentary: String,
	gif_id: String,
	repeat: Number,
});

const Exercises = model('Exercise', exercisesSchema);

export default Exercises;
