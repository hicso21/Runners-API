import { Schema, model } from 'mongoose';

const globalChatSchema = new Schema(
	{
		message: String,
		from: Object, // { name: '', _id: '', profile_picture: '' }
		createdAt: {
			type: Date,
			default: Date.now,
			index: { expires: 129600 },
		},
	},
	{ timestamps: true }
);

const GlobalChats = model('GlobalChat', globalChatSchema);

export default GlobalChats;
