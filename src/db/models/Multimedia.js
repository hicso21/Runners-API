import { Schema, model } from 'mongoose';

/*  
// type: 'text'
	data: {
		name: String,
		description: String,
	}
// type: 'tips'
	data: {
		name: String,
		description: String,
	}
// type: 'video'
	data: {
		name: String,
		description: String,
		src: String,
	}
// type: 'audio'
	data: {
		name: String,
		description: String,
		src: String,
	}
*/

const multimediaSchema = new Schema(
	{
		data: Object,
		type: String, // tip, audio, text, video
	},
	{ timestamps: true }
);

const Multimedias = model('Multimedia', multimediaSchema);

export default Multimedias;
