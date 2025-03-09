import { Schema, model } from 'mongoose';

const paidSchema = new Schema(
    {
        user_id: String,
        timestamp: { type: Date, expires: 2635200 },
    },
    { timestamps: true }
);

const Paids = model('Paid', paidSchema);

export default Paids;
