import { Schema, model } from 'mongoose';

const userChatSchema = new Schema(
	{
		message: String,
		from: String, // { name: '', _id: '', profile_picture: '' }
		createdAt: { type: Date, expires: 129600 },
	},
	{ timestamps: true }
);

const UserChats = model('UserChat', userChatSchema);

export default UserChats;
