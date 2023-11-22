import { Schema, model } from 'mongoose';

const gifSchema = new Schema(
	{
		gif: Object()
	},
	{ timestamps: true }
);


const Gifs = model('Gif', gifSchema);

export default Gifs;
