import { Schema, model } from 'mongoose';

const foodSchema = new Schema(
    {
        food: String,
        type: String,
    },
    { timestamps: true }
);

const Foods = model('Food', foodSchema);

export default Foods;
