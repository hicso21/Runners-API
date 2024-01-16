import { Schema, model } from 'mongoose';

const globalChatSchema = new Schema(
	{
		message: String,
		from: String,
		user_id: String,
		profile_picture: String,
		timestamp: Number,
		on_response: Object,
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
