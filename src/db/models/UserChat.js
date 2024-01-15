import { Schema, model } from 'mongoose';

const userChatSchema = new Schema(
	{
		message: String,
		user_id: String,
		is_user: Boolean,
		createdAt: { type: Date, expires: 604800 },
	},
	{ timestamps: true }
);

const UserChats = model('UserChat', userChatSchema);

export default UserChats;
