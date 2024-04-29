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
        createdAt: { type: Date, default: Date.now, expires: 0 },
        //{ type: Date, expires: 2764800 },
    },
    { timestamps: true }
);

calendarSchema.index({ end: 1 }, { expireAfterSeconds: 0 });

calendarSchema.pre('remove', async function (next) {
    const calendar = this;

    if (calendar.type === 'race' && calendar.end < Date.now()) {
        // Race event past its end date, delete it
        next();
    } else if (
        calendar.type === 'routine' &&
        calendar.createdAt.getTime() + 2764800 * 1000 < Date.now()
    ) {
        // Routine past expiration time (2764800 seconds), delete it
        next();
    } else {
        // Not a race past its end or a routine past expiration, prevent deletion
        console.warn(
            `Calendar with type "${calendar.type}" and ${
                calendar.end ? 'end date' : 'createdAt'
            } not yet expired, preventing deletion.`
        );
        next(
            new Error(
                'Calendar deletion prevented due to type and date constraints'
            )
        );
    }
});

const Calendar = model('Calendar', calendarSchema);

export default Calendar;
