import { Schema, model } from 'mongoose';

const RoutineSchema = new Schema({
	name: String,
	exercises: [
		{
			name: String,
			type: String,
			category: String /* running, funcional, bike, elliptical, other */,
			measure: String,
			duration: Number,
			measurement_unit: String,
			commentary: String,
		},
	],
});

const Routines = model('Routine', RoutineSchema);

export default Routines;
