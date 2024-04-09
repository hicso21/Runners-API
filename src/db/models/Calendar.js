import { Schema, model } from 'mongoose';

const calendarSchema = new Schema(
	{
		user_id: String,
		title: String,
		exercises: Array,
		// [
		// 	{
		// 		// name: String,
		// 		// type: String,
		// 		// category: String,
		// 		// measure: String,
		// 		// duration: Number,
		// 		// measurement_unit: String,
		// 		// second_measure: String,
		// 		// second_duration: Number,
		// 		// second_measurement_unit: String,
		// 		// commentary: String,
		// 		// repeat: Number,
		// 		// gif_id: String,
		// 	},
		// ]
		routine_id: String,
		type: String, // race || routine
		resource: Object,
		pdf: String,
		start: Date,
		end: Date,
		isDraggable: Boolean,
		allDay: Boolean,
		completed: Boolean,
		createdAt: { type: Date, expires: 2764800 },
	},
	{ timestamps: true }
);

const Calendar = model('Calendar', calendarSchema);

export default Calendar;
