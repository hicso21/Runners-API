import { Schema, model } from 'mongoose';

const userCodesSchema = new Schema(
    {
        name: String,
        email: String,
        price: String,
        price_id: String,
        code: String,
    },
    { timestamps: true }
);

const UserCodes = model('UserCodes', userCodesSchema);

export default UserCodes;
