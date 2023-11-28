import { Schema, model } from 'mongoose';

const gifSchema = new Schema(
	{
		name: String,
		gif: String,
	},
	{ timestamps: true }
);

const Gifs = model('Gif', gifSchema);

export default Gifs;
