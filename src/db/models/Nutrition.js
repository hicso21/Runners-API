import { Schema, model } from 'mongoose';

const NutritionSchema = new Schema(
    {
        title: String,
        text: String,
        resource: Object,
        start: Date,
        end: Date,
        isDraggable: Boolean,
        pdf: String,
    },
    { timestamps: true }
);

const Nutritions = model('Nutrition', NutritionSchema);

export default Nutritions;
