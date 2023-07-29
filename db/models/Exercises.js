import { Schema, model } from "mongoose";

const exercisesSchema = new Schema({
    name: String,
    type: String,
    category: String, /* Running, Funcional, Bike */
    duration: Number,
    intensity: String,
    comentary: String
});

const Exercises = model("Exercise", exercisesSchema);

export default Exercises;