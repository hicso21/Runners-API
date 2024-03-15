import { Schema, model } from 'mongoose';

const calendarSchema = new Schema(
	{
		user_id: String,
		name: String,
		exercises: [
			{
				name: String,
				type: String,
				category: String,
				measure: String,
				duration: Number,
				measurement_unit: String,
				second_measure: String,
				second_duration: Number,
				second_measurement_unit: String,
				commentary: String,
			},
		],
		pdf: String,
		start: Date,
		end: Date,
		isDraggable: Boolean,
		completed: Boolean,
		createdAt: { type: Date, expires: 1209600 },
	},
	{ timestamps: true }
);

const Calendar = model('Calendar', calendarSchema);

export default Calendar;
