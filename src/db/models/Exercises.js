import { Schema, model } from 'mongoose';

const exercisesSchema = new Schema({
	name: String,
	type: String,
	category: String /* running, funcional, bike, elliptical, other */,
	measure: String, 
	duration: Number,
	measurement_unit : String,
	comentary: String,
	// gif: Gif
});

const Exercises = model('Exercise', exercisesSchema);

export default Exercises;
