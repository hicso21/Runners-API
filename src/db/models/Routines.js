import { Schema, model } from 'mongoose';

const RoutineSchema = new Schema({
	name: String,
	exercises: Array,
});

const Routines = model('Routine', RoutineSchema);

export default Routines;
