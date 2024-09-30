import { Schema, model } from 'mongoose';

const RoutineSchema = new Schema(
    {
        name: String,
        exercises: Array,
        type: String,
        start: Date,
        end: Date,
        isDraggable: Boolean,
        pdf: String,
    },
    { timestamps: true }
);

const Routines = model('Routine', RoutineSchema);

export default Routines;
