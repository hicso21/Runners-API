import { Schema, model } from 'mongoose';

const RoutineSchema = new Schema({
	name: String,
	exercises: Array,
	start: Date,
	end: Date,
	isDraggable: Boolean,
	pdf: String,
});

const Routines = model('Routine', RoutineSchema);

export default Routines;
