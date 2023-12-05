import { Schema, model } from 'mongoose';

const imageSchema = new Schema(
	{
		name: String,
		img: String,
	},
	{ timestamps: true }
);

const Images = model('Image', imageSchema);

export default Images;
